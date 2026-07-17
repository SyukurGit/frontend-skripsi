import clsx from "clsx";
import type { TicketStatus, AuditLevel } from "@/types/api";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const cls =
    status === "OPEN"
      ? "border-slate-200 bg-slate-50 text-slate-700"
      : status === "CLAIMED"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : status === "IN_PROGRESS"
          ? "border-cyan-200 bg-cyan-50 text-cyan-800"
          : status === "RESOLVED"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-slate-300 bg-slate-100 text-slate-800";
  return (
    <span className={clsx("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase", cls)}>
      {status}
    </span>
  );
}

export function LevelBadge({ level }: { level: AuditLevel }) {
  const cls =
    level === "HIGH"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : level === "MEDIUM"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-slate-200 bg-slate-50 text-slate-700";
  return (
    <span className={clsx("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase", cls)}>
      {level}
    </span>
  );
}
