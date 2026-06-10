"use client";

import clsx from "clsx";
import { LogoMark } from "@/components/branding/logo-mark";
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
  const { setMobileOpen, collapsed, setCollapsed } = useShell();

  return (
    <header className="sticky top-0 z-30 mb-8 rounded-lg border border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="md:hidden">
            <LogoMark compact />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">DompetKu</div>
            <div className="mt-1 text-xl font-bold tracking-tight text-slate-950">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 lg:inline-flex"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
          {status ? (
            <div
              className={clsx(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                status.tone === "live" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                status.tone === "warn" && "border-amber-200 bg-amber-50 text-amber-700",
                (!status.tone || status.tone === "muted") && "border-slate-200 bg-slate-50 text-slate-600",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {status.label}
            </div>
          ) : null}
          {user ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-slate-900">{user.email}</div>
                <div className="text-xs text-slate-500">Akun aktif</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
                {user.email.slice(0, 1).toUpperCase()}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
