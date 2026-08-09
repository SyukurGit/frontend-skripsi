import clsx from "clsx";
import type { TicketStatus, AuditLevel } from "@/types/api";

export const ticketStatusLabel: Record<TicketStatus, string> = {
  OPEN: "Menunggu CS",
  CLAIMED: "Sudah diambil",
  IN_PROGRESS: "Sedang diproses",
  RESOLVED: "Siap ditutup",
  CLOSED: "Ditutup",
};

const auditLevelLabel: Record<AuditLevel, string> = {
  HIGH: "Tinggi",
  MEDIUM: "Sedang",
  LOW: "Rendah",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const cls =
    status === "OPEN"
      ? "border-[#d8dde4] bg-[#f5f7fa] text-[#596170]"
      : status === "CLAIMED"
        ? "border-[#f0d5ad] bg-[#fff8e9] text-[#8c5207]"
        : status === "IN_PROGRESS"
          ? "border-[#c8daf8] bg-[#edf4ff] text-[#1356b8]"
          : status === "RESOLVED"
            ? "border-[#cde3d7] bg-[#eef7f2] text-[#236847]"
            : "border-[#cfd5dd] bg-[#edf0f4] text-[#4e5663]";
  return (
    <span className={clsx("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", cls)}>
      {ticketStatusLabel[status]}
    </span>
  );
}

export function LevelBadge({ level }: { level: AuditLevel }) {
  const cls =
    level === "HIGH"
      ? "border-[#f0c7cd] bg-[#fff1f3] text-[#a92637]"
      : level === "MEDIUM"
        ? "border-[#f0d5ad] bg-[#fff8e9] text-[#8c5207]"
        : "border-[#d8dde4] bg-[#f5f7fa] text-[#596170]";
  return (
    <span className={clsx("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", cls)}>
      {auditLevelLabel[level]}
    </span>
  );
}
