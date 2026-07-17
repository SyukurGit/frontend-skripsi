"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type React from "react";
import {
  Activity,
  BarChart3,
  CreditCard,
  FileClock,
  Headphones,
  History,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  MonitorDot,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Ticket,
  UserRoundCog,
  Users,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/branding/logo-mark";
import { useShell } from "@/components/shell/shell-context";
import { useLogout } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

type NavItem = {
  href: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
};

function navForRole(role: "admin" | "cs" | "user"): NavItem[] {
  if (role === "admin") {
    return [
      { href: "/admin", label: "Overview", desc: "Ringkasan kontrol", icon: BarChart3 },
      { href: "/admin/logs", label: "Sesi & Audit", desc: "Jejak per ticket", icon: FileClock },
      { href: "/admin/terminal", label: "Terminal", desc: "Trace backend", icon: MonitorDot },
      { href: "/admin/stream", label: "Realtime", desc: "Event HIGH/MEDIUM", icon: Activity },
      { href: "/admin/users", label: "Akun", desc: "User dan CS", icon: Users },
    ];
  }
  if (role === "cs") {
    return [
      { href: "/cs", label: "Queue", desc: "Ticket terbuka", icon: Ticket },
      { href: "/cs/my-tickets", label: "Assignment", desc: "Ticket saya", icon: UserRoundCog },
      { href: "/cs/chat", label: "Chat", desc: "Percakapan aktif", icon: MessageSquare },
    ];
  }
  return [
    { href: "/user", label: "Dompet", desc: "Saldo dan akun", icon: Home },
    { href: "/user/transactions", label: "Transaksi", desc: "Riwayat dana", icon: CreditCard },
    { href: "/user/history", label: "Aktivitas", desc: "Jejak akun", icon: History },
    { href: "/user/tickets", label: "Bantuan", desc: "Ticket support", icon: Headphones },
  ];
}

function roleCopy(role: "admin" | "cs" | "user") {
  if (role === "admin") {
    return {
      label: "Administrator",
      title: "Audit Control Room",
      desc: "Pantau session, JIT, dan jejak keputusan backend.",
      tone: "border-cyan-900/50 bg-cyan-950/25 text-cyan-100",
    };
  }
  if (role === "cs") {
    return {
      label: "Customer Support",
      title: "Ticket-bound Workspace",
      desc: "Akses hanya berlaku pada ticket yang ditugaskan.",
      tone: "border-emerald-900/50 bg-emerald-950/25 text-emerald-100",
    };
  }
  return {
    label: "Pengguna",
    title: "Dompet Digital",
    desc: "Support dan transaksi berada dalam satu konteks akun.",
    tone: "border-amber-900/50 bg-amber-950/25 text-amber-100",
  };
}

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const toast = useToastStore((s) => s.push);
  const logout = useLogout();
  const { mobileOpen, setMobileOpen, collapsed, setCollapsed } = useShell();

  if (!user) return null;

  const items = navForRole(user.role);
  const copy = roleCopy(user.role);

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      clear();
      toast({ kind: "info", title: "Berhasil logout" });
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status !== 401) {
        toast({ kind: "error", title: "Logout gagal", detail: getErrorMessage(error, "Logout gagal") });
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm md:hidden"
        aria-label="Buka navigasi"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div
        className={clsx("fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition-opacity md:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#101820] text-white transition-all duration-300 md:sticky md:z-auto md:h-screen md:translate-x-0",
          collapsed ? "w-[88px]" : "w-[284px]",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col border-r border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <div className={clsx("min-w-0", collapsed && "mx-auto")}>
              {!collapsed ? <LogoMark inverse compact /> : <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold">DK</div>}
            </div>
            <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden" aria-label="Tutup navigasi">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-3 py-4">
            <div className={clsx("rounded-xl border p-3", copy.tone, collapsed && "p-2 text-center")}>
              {!collapsed ? (
                <>
                  <div className="text-[11px] font-semibold uppercase text-white/70">{copy.label}</div>
                  <div className="mt-2 text-sm font-semibold">{copy.title}</div>
                  <div className="mt-1 text-xs leading-5 text-white/70">{copy.desc}</div>
                </>
              ) : (
                <ShieldCheck className="mx-auto h-5 w-5" />
              )}
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {items.map((item) => {
              const active = pathname === item.href || (item.href !== `/${user.role}` && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={clsx(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                    active ? "bg-white text-slate-950 shadow-sm" : "text-white/72 hover:bg-white/8 hover:text-white",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <span className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", active ? "bg-emerald-50 text-emerald-700" : "bg-white/8 text-white/72 group-hover:text-white")}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  {!collapsed ? (
                    <span className="min-w-0">
                      <span className="block font-semibold">{item.label}</span>
                      <span className={clsx("mt-0.5 block truncate text-xs", active ? "text-slate-500" : "text-white/45")}>{item.desc}</span>
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-3">
            <div className={clsx("mb-3 flex items-center gap-3 rounded-lg bg-white/7 p-3", collapsed && "justify-center p-2")}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold">{user.email.slice(0, 1).toUpperCase()}</div>
              {!collapsed ? (
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold">{user.email}</div>
                  <div className="text-[11px] uppercase text-white/45">{user.role}</div>
                </div>
              ) : null}
            </div>
            <div className={clsx("flex gap-2", collapsed && "flex-col")}>
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="hidden h-10 flex-1 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:bg-white/8 hover:text-white lg:inline-flex"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logout.isPending}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-slate-950 hover:bg-slate-100 disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed ? (logout.isPending ? "Logout..." : "Logout") : null}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
