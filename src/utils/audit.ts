import type { AuditLog } from "@/types/api";

type MetadataMap = Record<string, unknown>;

export function auditMeta(log: AuditLog): MetadataMap {
  return typeof log.metadata === "object" && log.metadata !== null ? (log.metadata as MetadataMap) : {};
}

export function auditActionLabel(action: string) {
  switch (action) {
    case "TICKET_CREATE":
      return "Tiket dibuat";
    case "TICKET_CLAIM":
      return "Tiket diambil CS";
    case "TICKET_STATUS_UPDATE":
      return "Status tiket diperbarui";
    case "MESSAGE_SEND":
      return "Pesan dikirim";
    case "JIT_REQUEST":
      return "Permintaan JIT dibuat";
    case "JIT_REQUEST_DENIED":
      return "Permintaan JIT ditolak";
    case "VIEW_KYC":
      return "Akses data KYC";
    case "RESET_PASSWORD":
      return "Reset password";
    case "CHANGE_EMAIL":
      return "Ubah email";
    case "UNBLOCK_ACCOUNT":
      return "Buka blokir akun";
    case "RESET_PIN":
      return "Reset PIN";
    case "JIT_REVOKE_TICKET_CLOSED":
      return "JIT dicabut saat tiket ditutup";
    default:
      return action.replaceAll("_", " ");
  }
}

export function auditActionHint(log: AuditLog) {
  const meta = auditMeta(log);
  const feature = typeof meta.feature === "string" ? meta.feature : null;
  const nextStatus = typeof meta.status === "string" ? meta.status : null;

  switch (log.action) {
    case "TICKET_CLAIM":
      return "LP mulai aktif karena tiket sekarang terikat ke CS tertentu.";
    case "TICKET_STATUS_UPDATE":
      return nextStatus ? `Backend menerima perubahan status menjadi ${nextStatus}.` : "Backend memvalidasi transisi status tiket.";
    case "JIT_REQUEST":
      return feature ? `Backend memeriksa apakah fitur ${feature} boleh diaktifkan sementara.` : "Backend memeriksa syarat JIT sebelum memberi akses sementara.";
    case "JIT_REQUEST_DENIED":
      return feature ? `Permintaan akses sementara untuk fitur ${feature} ditolak karena syarat backend tidak terpenuhi.` : "Permintaan akses sementara ditolak karena syarat backend tidak terpenuhi.";
    case "VIEW_KYC":
      return "Data sensitif hanya dibuka dalam konteks tiket yang valid.";
    case "RESET_PASSWORD":
    case "CHANGE_EMAIL":
    case "UNBLOCK_ACCOUNT":
    case "RESET_PIN":
      return "Aksi sensitif ini hanya berjalan jika sesi JIT masih aktif.";
    case "JIT_REVOKE_TICKET_CLOSED":
      return "Sesi JIT dicabut otomatis ketika tiket selesai.";
    default:
      return "Aktivitas ini tercatat pada audit trail tiket.";
  }
}

export function isSensitiveAuditAction(action: string) {
  return ["JIT_REQUEST", "JIT_REQUEST_DENIED", "VIEW_KYC", "RESET_PASSWORD", "CHANGE_EMAIL", "UNBLOCK_ACCOUNT", "RESET_PIN", "JIT_REVOKE_TICKET_CLOSED"].includes(action);
}
