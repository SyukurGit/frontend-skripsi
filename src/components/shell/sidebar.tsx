"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion } from "motion/react";
import {
  Activity,
  BarChart3,
  CreditCard,
  FileClock,
  Headphones,
  History,
  Home,
  LogOut,
  MessageSquare,
  MonitorDot,
  PanelLeftClose,
  PanelLeftOpen,
  Ticket,
  UserRoundCog,
  Users,
} from "lucide-react";
import type React from "react";
import { LogoMark } from "@/components/branding/logo-mark";
import { useShell } from "@/components/shell/shell-context";
import { useLogout } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { cn } from "@/utils/cn";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const roleLabel = {
  user: "Pengguna",
  cs: "Customer Support",
  admin: "Administrator",
} as const;

function navForRole(role: "admin" | "cs" | "user"): NavItem[] {
  if (role === "admin") {
    return [
      { href: "/admin", label: "Ringkasan", icon: BarChart3 },
      { href: "/admin/logs", label: "Audit", icon: FileClock },
      { href: "/admin/terminal", label: "Terminal", icon: MonitorDot },
      { href: "/admin/stream", label: "Langsung", icon: Activity },
      { href: "/admin/users", label: "Akun", icon: Users },
    ];
  }
  if (role === "cs") {
    return [
      { href: "/cs", label: "Antrian", icon: Ticket },
      { href: "/cs/my-tickets", label: "Penugasan", icon: UserRoundCog },
      { href: "/cs/chat", label: "Chat", icon: MessageSquare },
    ];
  }
  return [
    { href: "/user", label: "Dompet", icon: Home },
    { href: "/user/transactions", label: "Transaksi", icon: CreditCard },
    { href: "/user/history", label: "Aktivitas", icon: History },
    { href: "/user/tickets", label: "Bantuan", icon: Headphones },
  ];
}

function isActivePath(pathname: string, href: string, role: string) {
  return pathname === href || (href !== `/${role}` && pathname.startsWith(href));
}

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);
  const toast = useToastStore((state) => state.push);
  const logout = useLogout();
  const { collapsed, setCollapsed } = useShell();

  if (!user) return null;
  const items = navForRole(user.role);

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      clear();
      toast({ kind: "info", title: "Sesi ditutup" });
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) clear();
      else toast({ kind: "error", title: "Gagal keluar", detail: getErrorMessage(error, "Gagal keluar") });
    }
  }

  return (
    <Tooltip.Provider delayDuration={350}>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-[#dfe3e8] bg-white transition-[width] duration-200 md:flex md:flex-col",
          collapsed ? "w-[84px]" : "w-[248px]",
        )}
      >
        <div className={cn("flex h-[72px] items-center border-b border-[#e9ecf0] px-5", collapsed && "justify-center px-3")}>
          {collapsed ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#22262f] text-xs font-bold text-white">DK</div>
          ) : (
            <LogoMark compact />
          )}
        </div>

        <div className={cn("px-3 pt-5", collapsed && "px-2")}>
          {!collapsed ? (
            <div className="mb-3 px-3 text-[11px] font-semibold text-[#98a0ad]">{roleLabel[user.role]}</div>
          ) : null}
          <nav className="space-y-1">
            {items.map((item) => {
              const active = isActivePath(pathname, item.href, user.role);
              const Icon = item.icon;
              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium",
                    active ? "text-[#0f55ba]" : "text-[#596170] hover:bg-[#f4f6f8] hover:text-[#171a21]",
                    collapsed && "justify-center px-0",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="desktop-nav-active"
                      className="absolute inset-0 rounded-md bg-[#edf4ff]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
                  {!collapsed ? <span className="relative z-10">{item.label}</span> : null}
                </Link>
              );
              return collapsed ? (
                <Tooltip.Root key={item.href}>
                  <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content side="right" sideOffset={8} className="z-50 rounded-md bg-[#22262f] px-2.5 py-1.5 text-xs text-white shadow-lg">
                      {item.label}
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ) : (
                link
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#e9ecf0] p-3">
          {!collapsed ? (
            <div className="mb-2 min-w-0 px-2 py-2">
              <div className="truncate text-xs font-semibold text-[#252932]">{user.email}</div>
              <div className="mt-0.5 text-[11px] text-[#7b8492]">{roleLabel[user.role]}</div>
            </div>
          ) : null}
          <div className={cn("flex gap-2", collapsed && "flex-col")}>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-[#dfe3e8] text-[#667085] hover:bg-[#f4f6f8]"
              aria-label={collapsed ? "Perluas navigasi" : "Ringkas navigasi"}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={logout.isPending}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#22262f] px-3 text-xs font-semibold text-white hover:bg-[#101217] disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed ? "Keluar" : null}
            </button>
          </div>
        </div>
      </aside>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 grid border-t border-[#dfe3e8] bg-white/96 px-2 pt-2 backdrop-blur md:hidden" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const active = isActivePath(pathname, item.href, user.role);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-1.5 text-[10px] font-medium",
                active ? "text-[#0f55ba]" : "text-[#7b8492]",
              )}
            >
              {active ? <motion.span layoutId="mobile-nav-active" className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-[var(--brand)]" /> : null}
              <Icon className="h-[19px] w-[19px]" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </Tooltip.Provider>
  );
}
