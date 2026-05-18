"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LogoMark } from "@/components/branding/logo-mark";
import { useShell } from "@/components/shell/shell-context";
import { useLogout } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

type IconName = "home" | "card" | "history" | "support" | "ticket" | "chat" | "shield" | "users";
type NavItem = { href: string; label: string; icon: IconName };

function Icon({ name, active }: { name: IconName; active: boolean }) {
  const stroke = active ? "currentColor" : "#64748b";
  const cls = "h-5 w-5";

  if (name === "home") {
    return <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" className={cls}><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/></svg>;
  }
  if (name === "card") {
    return <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" className={cls}><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/></svg>;
  }
  if (name === "history") {
    return <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" className={cls}><path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4h4"/><path d="M12 8v4l2.5 1.5"/></svg>;
  }
  if (name === "support") {
    return <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" className={cls}><path d="M6 9a6 6 0 1 1 12 0v4a2 2 0 0 1-2 2h-2"/><rect x="4" y="11" width="3" height="6" rx="1.5"/><rect x="17" y="11" width="3" height="6" rx="1.5"/><path d="M10 19h4"/></svg>;
  }
  if (name === "ticket") {
    return <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" className={cls}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5V10a2 2 0 0 0-2 2 2 2 0 0 0 2 2v2.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5V14a2 2 0 0 0 2-2 2 2 0 0 0-2-2Z"/><path d="M9 8h6"/><path d="M9 12h6"/></svg>;
  }
  if (name === "chat") {
    return <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" className={cls}><path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-4 4v-4H7.5A2.5 2.5 0 0 1 5 12.5Z"/></svg>;
  }
  if (name === "users") {
    return <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" className={cls}><path d="M16 19a4 4 0 0 0-8 0"/><circle cx="12" cy="10" r="3"/><path d="M19 19a3 3 0 0 0-2.2-2.9"/><path d="M17 7.2a3 3 0 0 1 0 5.6"/></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" className={cls}><path d="M12 3l7 4v5c0 4.5-2.8 7.7-7 9-4.2-1.3-7-4.5-7-9V7l7-4Z"/><path d="M9.5 12.5 11 14l3.5-4"/></svg>;
}

function navForRole(role: "admin" | "cs" | "user"): NavItem[] {
  if (role === "admin") {
    return [
      { href: "/admin", label: "Dashboard", icon: "home" },
      { href: "/admin/logs", label: "Logs", icon: "ticket" },
      { href: "/admin/terminal", label: "Terminal", icon: "chat" },
      { href: "/admin/users", label: "Users", icon: "users" },
      { href: "/admin/stream", label: "Realtime", icon: "chat" },
    ];
  }
  if (role === "cs") {
    return [
      { href: "/cs", label: "Dashboard", icon: "home" },
      { href: "/cs/my-tickets", label: "Tickets", icon: "ticket" },
      { href: "/cs/chat", label: "Chat", icon: "chat" },
    ];
  }
  return [
    { href: "/user", label: "Dashboard", icon: "home" },
    { href: "/user/transactions", label: "Transaksi", icon: "card" },
    { href: "/user/history", label: "Riwayat", icon: "history" },
    { href: "/user/tickets", label: "Customer Support", icon: "support" },
  ];
}

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const toast = useToastStore((s) => s.push);
  const logout = useLogout();
  const { mobileOpen, setMobileOpen, collapsed } = useShell();

  if (!user) return null;

  const items = navForRole(user.role);

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      clear();
      toast({ kind: "info", title: "Signed out" });
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status !== 401) {
        toast({ kind: "error", title: "Sign out failed", detail: getErrorMessage(error, "Logout failed") });
      }
    }
  }

  return (
    <>
      <div
        className={clsx("fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm transition md:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/70 bg-white/92 px-4 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur transition-all md:sticky md:z-20 md:h-screen md:translate-x-0 md:shadow-none",
          collapsed ? "w-[96px]" : "w-[274px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-1">
          <div className={clsx(collapsed && "mx-auto")}>{!collapsed ? <LogoMark compact /> : <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#335cff,#1d4ed8)] text-sm font-bold text-white">DK</div>}</div>
          <button type="button" onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 md:hidden">
            Close
          </button>
        </div>

        <div className={clsx("mt-6 rounded-[24px] bg-[linear-gradient(180deg,#eff6ff,#eef2ff)] p-4", collapsed && "px-2") }>
          <div className={clsx("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-blue-700 shadow-sm">
              {user.email.slice(0, 1).toUpperCase()}
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-950">{user.email}</div>
                <div className="text-xs text-slate-500">{user.role === "user" ? "Pengguna DompetKu" : user.role === "cs" ? "Petugas Support" : "Admin"}</div>
              </div>
            ) : null}
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-1.5">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium",
                  active ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  collapsed && "justify-center px-0",
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className={clsx("flex h-10 w-10 items-center justify-center rounded-2xl", active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600")}>
                  <Icon name={item.icon} active={active} />
                </span>
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className={clsx("mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-3", collapsed && "px-2") }>
          {!collapsed ? (
            <div className="mb-3 rounded-2xl bg-white px-3 py-2 text-xs text-slate-500">
              {user.role === "user" ? "Fitur bantuan pelanggan tersedia saat Anda membutuhkannya." : "Kelola tiket dan percakapan dari satu panel yang ringkas."}
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className={clsx(
              "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60",
              collapsed && "px-0",
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <Icon name="shield" active />
            {!collapsed ? (logout.isPending ? "Signing out..." : "Logout") : null}
          </button>
        </div>
      </aside>
    </>
  );
}
