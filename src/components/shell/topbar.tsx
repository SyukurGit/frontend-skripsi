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
    <header className="sticky top-0 z-30 mb-8 rounded-[28px] border border-white/70 bg-white/90 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur sm:px-5 lg:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 md:hidden"
            aria-label="Open sidebar"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
            </span>
          </button>
          <div className="md:hidden">
            <LogoMark compact />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">DompetKu</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{title}</div>
            {subtitle ? <div className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</div> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 lg:inline-flex"
          >
            {collapsed ? "Expand menu" : "Collapse menu"}
          </button>
          {status ? (
            <div
              className={clsx(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold",
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
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-slate-900">{user.email}</div>
                <div className="text-xs text-slate-500">Akun aktif</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dbeafe,#eef2ff)] text-sm font-bold text-blue-700">
                {user.email.slice(0, 1).toUpperCase()}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
