import type { AdminJitAttempt, AdminSessionDetail, AdminSessionListItem, ManagedUser, TerminalLogEntry, Ticket, Message, AuditLog, UserProfile } from "@/types/api";

function obj(raw: unknown): Record<string, unknown> {
  return typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
}

function pick(r: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    if (r[k] !== undefined) return r[k];
  }
  return undefined;
}

function asNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") return Number(v);
  return Number(v);
}

function asString(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v);
}

function hash32(s: string): number {
  // Simple FNV-1a 32-bit hash; stable across sessions.
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mapTicket(raw: unknown): Ticket {
  const r = obj(raw);
  const assignedRaw = pick(r, ["assigned_cs_id", "assignedCsId", "AssignedCSID"]);
  return {
    // Backend Go structs may serialize as ID/UserID/... without json tags.
    id: asNumber(pick(r, ["id", "ID"])),
    userId: asNumber(pick(r, ["user_id", "userId", "UserID"])),
    assignedCsId:
      assignedRaw === undefined || assignedRaw === null ? null : asNumber(assignedRaw),
    status: asString(pick(r, ["status", "Status"])) as Ticket["status"],
    createdAt: (pick(r, ["created_at", "createdAt", "CreatedAt"]) as string | undefined) ?? undefined,
  };
}

export function mapMessage(raw: unknown): Message {
  const r = obj(raw);

  const ticketId = asNumber(pick(r, ["ticket_id", "ticketId", "TicketID"]));
  const senderId = asNumber(pick(r, ["sender_id", "senderId", "SenderID"]));
  const message = asString(pick(r, ["message", "Message"])) || "";
  const createdAt = asString(pick(r, ["created_at", "createdAt", "CreatedAt"])) || new Date().toISOString();

  let id = asNumber(pick(r, ["id", "ID"]));
  // WS payload used to omit id; keep UI stable even if missing.
  if (!Number.isFinite(id) || id <= 0) {
    id = -hash32(`${ticketId}|${senderId}|${createdAt}|${message}`);
  }

  return { id, ticketId, senderId, message, createdAt };
}

export function mapAudit(raw: unknown): AuditLog {
  const r = obj(raw);
  return {
    id: asNumber(pick(r, ["id", "ID"])),
    userId: asNumber(pick(r, ["user_id", "userId", "UserID"])),
    role: asString(pick(r, ["role", "Role"])) as AuditLog["role"],
    level: asString(pick(r, ["level", "Level"])) as AuditLog["level"],
    action: asString(pick(r, ["action", "Action"])) || "",
    ticketId: (pick(r, ["ticket_id", "ticketId", "TicketID"]) as number | null | undefined) ?? null,
    metadata: pick(r, ["metadata", "Metadata"]),
    createdAt: asString(pick(r, ["created_at", "createdAt", "CreatedAt"])) || new Date().toISOString(),
  };
}

export function mapProfile(raw: unknown): UserProfile {
  const r = obj(raw);
  return {
    userId: asNumber(pick(r, ["user_id", "userId", "UserID"])),
    phone: asString(pick(r, ["phone", "Phone"])) || "",
    balance: asNumber(pick(r, ["balance", "Balance"])) || 0,
    kycData: pick(r, ["kyc_data", "kycData", "KYCData"]),
    exposureState: asString(pick(r, ["exposure_state", "exposureState", "ExposureState"])) || undefined,
    policyNote: asString(pick(r, ["policy_note", "policyNote", "PolicyNote"])) || undefined,
    grantedFeature: asString(pick(r, ["granted_feature", "grantedFeature", "GrantedFeature"])) || undefined,
  };
}

export function mapAdminSessionListItem(raw: unknown): AdminSessionListItem {
  const r = obj(raw);
  return {
    ticket_id: asNumber(pick(r, ["ticket_id", "ticketId", "TicketID"])),
    user_id: asNumber(pick(r, ["user_id", "userId", "UserID"])),
    ticket_status: asString(pick(r, ["ticket_status", "ticketStatus", "TicketStatus"])) as AdminSessionListItem["ticket_status"],
    created_at: asString(pick(r, ["created_at", "createdAt", "CreatedAt"])),
    assigned_cs_id: pick(r, ["assigned_cs_id", "assignedCsId", "AssignedCSID"]) as number | null | undefined,
    assigned_cs_email: pick(r, ["assigned_cs_email", "assignedCsEmail", "AssignedCSEmail"]) as string | null | undefined,
    claimed_at: pick(r, ["claimed_at", "claimedAt", "ClaimedAt"]) as string | null | undefined,
    last_activity_at: pick(r, ["last_activity_at", "lastActivityAt", "LastActivityAt"]) as string | null | undefined,
    sensitive_actions: asNumber(pick(r, ["sensitive_actions", "sensitiveActions", "SensitiveActions"])),
    jit_attempts: asNumber(pick(r, ["jit_attempts", "jitAttempts", "JITAttempts"])),
  };
}

export function mapAdminJitAttempt(raw: unknown): AdminJitAttempt {
  const r = obj(raw);
  return {
    requested_at: asString(pick(r, ["requested_at", "requestedAt", "RequestedAt"])),
    feature: asString(pick(r, ["feature", "Feature"])),
    granted: Boolean(pick(r, ["granted", "Granted"])),
    reason: asString(pick(r, ["reason", "Reason"])),
  };
}

export function mapAdminSessionDetail(raw: unknown): AdminSessionDetail {
  const r = obj(raw);
  return {
    ticket_id: asNumber(pick(r, ["ticket_id", "ticketId", "TicketID"])),
    user_id: asNumber(pick(r, ["user_id", "userId", "UserID"])),
    user_email: pick(r, ["user_email", "userEmail", "UserEmail"]) as string | null | undefined,
    ticket_status: asString(pick(r, ["ticket_status", "ticketStatus", "TicketStatus"])) as AdminSessionDetail["ticket_status"],
    created_at: asString(pick(r, ["created_at", "createdAt", "CreatedAt"])),
    assigned_cs_id: pick(r, ["assigned_cs_id", "assignedCsId", "AssignedCSID"]) as number | null | undefined,
    assigned_cs_email: pick(r, ["assigned_cs_email", "assignedCsEmail", "AssignedCSEmail"]) as string | null | undefined,
    claimed_at: pick(r, ["claimed_at", "claimedAt", "ClaimedAt"]) as string | null | undefined,
    jit_attempts: asArray(pick(r, ["jit_attempts", "jitAttempts", "JITAttempts"]) ?? []).map(mapAdminJitAttempt),
    activities: asArray(pick(r, ["activities", "Activities"]) ?? []).map(mapAudit),
  };
}

export function mapManagedUser(raw: unknown): ManagedUser {
  const r = obj(raw);
  return {
    id: asNumber(pick(r, ["id", "ID"])),
    email: asString(pick(r, ["email", "Email"])),
    role: asString(pick(r, ["role", "Role"])) as ManagedUser["role"],
    created_at: asString(pick(r, ["created_at", "createdAt", "CreatedAt"])),
  };
}

export function mapTerminalLogEntry(raw: unknown): TerminalLogEntry {
  const r = obj(raw);
  return {
    ticket_id: asNumber(pick(r, ["ticket_id", "ticketId", "TicketID"])),
    sequence: asNumber(pick(r, ["sequence", "Sequence"])),
    timestamp: asString(pick(r, ["timestamp", "Timestamp"])),
    level: asString(pick(r, ["level", "Level"])),
    source: asString(pick(r, ["source", "Source"])),
    message: asString(pick(r, ["message", "Message"])),
  };
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
