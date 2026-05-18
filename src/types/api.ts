export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Role = "admin" | "cs" | "user";

export type LoginResponse = {
  token: string;
  user: { id: number; email: string; role: Role };
};

export type HealthResponse = {
  service: string;
};

export type TicketStatus = "OPEN" | "CLAIMED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type Ticket = {
  id: number;
  userId: number;
  assignedCsId?: number | null;
  status: TicketStatus;
  createdAt?: string;
};

export type Message = {
  id: number;
  ticketId: number;
  senderId: number;
  message: string;
  createdAt: string;
};

export type AuditLevel = "LOW" | "MEDIUM" | "HIGH";
export type AuditLog = {
  id: number;
  userId: number;
  role: Role;
  level: AuditLevel;
  action: string;
  ticketId?: number | null;
  metadata?: unknown;
  createdAt: string;
};

export type UserProfile = {
  userId: number;
  phone: string;
  balance: number;
  kycData: unknown;
  exposureState?: string;
  policyNote?: string;
  grantedFeature?: string;
};

export type JitRequestResponse = {
  expired_at: string;
  feature: string;
};

export type AdminDashboardStats = {
  total_users: number;
  total_cs: number;
  total_admins: number;
  tickets_in_process: number;
  tickets_unassigned: number;
  tickets_resolved: number;
  tickets_closed: number;
  sensitive_actions: number;
  pending_jit_requests: number;
};

export type AdminSessionListItem = {
  ticket_id: number;
  user_id: number;
  ticket_status: TicketStatus;
  created_at: string;
  assigned_cs_id?: number | null;
  assigned_cs_email?: string | null;
  claimed_at?: string | null;
  last_activity_at?: string | null;
  sensitive_actions: number;
  jit_attempts: number;
};

export type AdminJitAttempt = {
  requested_at: string;
  feature: string;
  granted: boolean;
  reason: string;
};

export type AdminSessionDetail = {
  ticket_id: number;
  user_id: number;
  user_email?: string | null;
  ticket_status: TicketStatus;
  created_at: string;
  assigned_cs_id?: number | null;
  assigned_cs_email?: string | null;
  claimed_at?: string | null;
  jit_attempts: AdminJitAttempt[];
  activities: AuditLog[];
};

export type ManagedUser = {
  id: number;
  email: string;
  role: Role;
  created_at: string;
};

export type TerminalLogEntry = {
  ticket_id: number;
  sequence: number;
  timestamp: string;
  level: string;
  source: string;
  message: string;
};
