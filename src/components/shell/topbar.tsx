"use client";

import clsx from "clsx";
import { Bell, Menu, ShieldCheck } from "lucide-react";
import { useShell } from "@/components/shell/shell-context";
import { useAuthStore } from "@/store/auth";

export function Topbar({
  title,
  subtitle,
  status,
}: {
  title: string;
  subtitle?: string;
  status?: { label: string; tone?: "live" | "muted" | "warn" };
}) {
  const user = useAuthStore((s) => s.user);
  const { setMobileOpen } = useShell();

  return (
    <header className="sticky top-0 z-30 mb-5 rounded-xl border border-slate-200 bg-[#fbfcf8]/92 px-4 py-3 shadow-[0_8px_24px_rgba(16,24,32,0.045)] backdrop-blur sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 md:hidden"
            aria-label="Buka navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              DompetKu Access Control
            </div>
            <div className="mt-0.5 truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">{title}</div>
            {subtitle ? <div className="hidden truncate text-sm text-slate-500 sm:block">{subtitle}</div> : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {status ? (
            <div
              className={clsx(
                "hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold sm:inline-flex",
                status.tone === "live" && "border-emerald-200 bg-emerald-50 text-emerald-800",
                status.tone === "warn" && "border-amber-200 bg-amber-50 text-amber-800",
                (!status.tone || status.tone === "muted") && "border-slate-200 bg-slate-50 text-slate-700",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {status.label}
            </div>
          ) : null}
          <div className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 lg:flex">
            <Bell className="h-4 w-4 text-slate-500" />
            <div className="text-xs text-slate-500">Demo ready</div>
          </div>
          {user ? (
            <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 sm:px-3">
              <div className="hidden text-right sm:block">
                <div className="max-w-[180px] truncate text-sm font-semibold text-slate-900">{user.email}</div>
                <div className="text-xs uppercase text-slate-500">{user.role}</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                {user.email.slice(0, 1).toUpperCase()}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
