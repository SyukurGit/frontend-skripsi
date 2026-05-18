import clsx from "clsx";
import type { TicketStatus, AuditLevel } from "@/types/api";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const cls =
    status === "OPEN"
      ? "bg-zinc-100 text-zinc-800"
      : status === "CLAIMED"
        ? "bg-amber-100 text-amber-900"
        : status === "IN_PROGRESS"
          ? "bg-sky-100 text-sky-900"
          : status === "RESOLVED"
            ? "bg-emerald-100 text-emerald-900"
            : "bg-zinc-200 text-zinc-900";
  return (
    <span className={clsx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", cls)}>
      {status}
    </span>
  );
}

export function LevelBadge({ level }: { level: AuditLevel }) {
  const cls =
    level === "HIGH"
      ? "bg-rose-100 text-rose-900"
      : level === "MEDIUM"
        ? "bg-amber-100 text-amber-900"
        : "bg-zinc-100 text-zinc-800";
  return (
    <span className={clsx("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", cls)}>
      {level}
    </span>
  );
}
