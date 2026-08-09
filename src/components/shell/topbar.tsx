"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { useLogout } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { cn } from "@/utils/cn";

const roleLabel = {
  user: "Pengguna",
  cs: "Customer Support",
  admin: "Administrator",
} as const;

export function Topbar({
  title,
  subtitle,
  status,
}: {
  title: string;
  subtitle?: string;
  status?: { label: string; tone?: "live" | "muted" | "warn" };
}) {
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);
  const toast = useToastStore((state) => state.push);
  const logout = useLogout();

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      clear();
      toast({ kind: "info", title: "Sesi ditutup" });
    } catch (error) {
      const statusCode = (error as { response?: { status?: number } }).response?.status;
      if (statusCode === 401) clear();
      else toast({ kind: "error", title: "Gagal keluar", detail: getErrorMessage(error, "Gagal keluar") });
    }
  }

  return (
    <header className="mb-5 flex min-h-[56px] items-center justify-between gap-3 border-b border-[#dfe3e8] pb-3">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-[#171a21] sm:text-xl">{title}</h1>
        {subtitle ? <p className="mt-0.5 hidden truncate text-xs text-[#7b8492] sm:block">{subtitle}</p> : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {status ? (
          <div
            className={cn(
              "hidden items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-medium sm:flex",
              status.tone === "live" && "border-[#c8daf8] bg-[#edf4ff] text-[#1356b8]",
              status.tone === "warn" && "border-[#f0d5ad] bg-[#fff8e9] text-[#8c5207]",
              (!status.tone || status.tone === "muted") && "border-[#dfe3e8] bg-white text-[#667085]",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.label}
          </div>
        ) : null}

        {user ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button type="button" className="flex h-10 items-center gap-2 rounded-md border border-[#dfe3e8] bg-white px-2 hover:bg-[#f8fafc]" aria-label="Buka menu akun">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22262f] text-xs font-bold text-white">
                  {user.email.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-[150px] text-left sm:block">
                  <span className="block truncate text-xs font-semibold text-[#252932]">{user.email}</span>
                  <span className="block text-[10px] text-[#7b8492]">{roleLabel[user.role]}</span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7b8492]" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={6} className="z-[80] min-w-48 rounded-md border border-[#dfe3e8] bg-white p-1.5 shadow-[0_12px_30px_rgba(17,26,36,0.14)]">
                <div className="border-b border-[#e9ecf0] px-2 py-2 sm:hidden">
                  <div className="truncate text-xs font-semibold text-[#252932]">{user.email}</div>
                  <div className="mt-0.5 text-[11px] text-[#7b8492]">{roleLabel[user.role]}</div>
                </div>
                <DropdownMenu.Item
                  onSelect={() => void handleLogout()}
                  className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 text-sm text-[#596170] outline-none hover:bg-[#f4f6f8] focus:bg-[#f4f6f8]"
                >
                  <LogOut className="h-4 w-4" />
                  {logout.isPending ? "Menutup sesi..." : "Keluar"}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : null}
      </div>
    </header>
  );
}
