import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { AdminDashboardStats, ApiEnvelope, HealthResponse, JitRequestResponse, LoginResponse } from "@/types/api";
import { mapAdminSessionDetail, mapAdminSessionListItem, mapAudit, mapManagedUser, mapMessage, mapProfile, mapTerminalLogEntry, mapTicket } from "@/utils/map";

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

export const qk = {
  health: () => ["health"] as const,
  userTickets: () => ["userTickets"] as const,
  csOpenTickets: () => ["csOpenTickets"] as const,
  csMyTickets: (csId?: number) => ["csMyTickets", csId ?? "me"] as const,
  messages: (ticketId: number) => ["messages", ticketId] as const,
  ticketActivity: (ticketId: number) => ["ticketActivity", ticketId] as const,
  audit: (level: string, limit: number) => ["audit", level, limit] as const,
  adminDashboard: () => ["adminDashboard"] as const,
  adminSessions: () => ["adminSessions"] as const,
  adminSessionDetail: (ticketId: number) => ["adminSessionDetail", ticketId] as const,
  adminTerminalTickets: () => ["adminTerminalTickets"] as const,
  adminTerminalLogs: (ticketId: number) => ["adminTerminalLogs", ticketId] as const,
  adminUsers: () => ["adminUsers"] as const,
  profile: (ticketId: number) => ["profile", ticketId] as const,
};

async function getData<T>(path: string) {
  const res = await api.get<ApiEnvelope<T>>(path);
  return res.data.data;
}

export async function fetchAuditLogs(level: "LOW" | "HIGH" | "MEDIUM", limit = 100) {
  return asArray(await getData<unknown>(`/admin/audit-logs?level=${level}&limit=${limit}`)).map(mapAudit);
}

async function postData<T>(path: string, payload?: unknown) {
  const res = await api.post<ApiEnvelope<T>>(path, payload);
  return res.data.data;
}

export function useHealth() {
  return useQuery({
    queryKey: qk.health(),
    queryFn: () => getData<HealthResponse>("/health"),
    retry: 0,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) => postData<LoginResponse>("/auth/login", payload),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => postData<null>("/auth/logout"),
    onSuccess: () => qc.clear(),
  });
}

export function useUserTickets() {
  return useQuery({
    queryKey: qk.userTickets(),
    queryFn: async () => asArray(await getData<unknown>("/user/tickets")).map(mapTicket),
    refetchInterval: 15000,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => mapTicket(await postData<unknown>("/user/tickets")),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.userTickets() }),
  });
}

export function useCloseTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ticketId: number) => {
      await postData<null>(`/user/tickets/${ticketId}/close`);
      return ticketId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.userTickets() }),
  });
}

export function useCsOpenTickets() {
  return useQuery({
    queryKey: qk.csOpenTickets(),
    queryFn: async () => asArray(await getData<unknown>("/cs/tickets/open")).map(mapTicket),
    refetchInterval: 15000,
  });
}

export function useCsClaimTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ticketId: number) => {
      await postData<null>(`/cs/tickets/${ticketId}/claim`);
      return ticketId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.csOpenTickets() });
      qc.invalidateQueries({ queryKey: qk.csMyTickets() });
    },
  });
}

export function useCsMyTickets() {
  return useQuery({
    queryKey: qk.csMyTickets(),
    queryFn: async () => asArray(await getData<unknown>("/cs/tickets/my")).map(mapTicket),
    refetchInterval: 15000,
  });
}

export function useCsTicket(ticketId: number) {
  return useQuery({
    queryKey: ["csTicket", ticketId],
    enabled: Number.isFinite(ticketId) && ticketId > 0,
    queryFn: async () => mapTicket(await getData<unknown>(`/cs/tickets/${ticketId}`)),
  });
}

export function useUpdateTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: number; status: string }) => {
      await postData<null>(`/cs/tickets/${ticketId}/status`, { status });
      return { ticketId, status };
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: qk.csOpenTickets() });
      qc.invalidateQueries({ queryKey: qk.csMyTickets() });
      qc.invalidateQueries({ queryKey: qk.userTickets() });
      qc.invalidateQueries({ queryKey: qk.messages(vars.ticketId) });
    },
  });
}

export function useMessages(ticketId: number, role: "user" | "cs") {
  return useQuery({
    queryKey: qk.messages(ticketId),
    enabled: Number.isFinite(ticketId) && ticketId > 0,
    queryFn: async () => {
      const path = role === "cs" ? `/cs/tickets/${ticketId}/messages?limit=50` : `/user/tickets/${ticketId}/messages?limit=50`;
      return asArray(await getData<unknown>(path)).map(mapMessage);
    },
  });
}

export function useUserTicketActivity(ticketId: number) {
  return useQuery({
    queryKey: qk.ticketActivity(ticketId),
    enabled: Number.isFinite(ticketId) && ticketId > 0,
    queryFn: async () => asArray(await getData<unknown>(`/user/tickets/${ticketId}/activity`)).map(mapAudit),
    refetchInterval: 10000,
  });
}

export function useSendMessage(ticketId: number, role: "user" | "cs") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const path = role === "cs" ? `/cs/tickets/${ticketId}/messages` : `/user/tickets/${ticketId}/messages`;
      return mapMessage(await postData<unknown>(path, { message: text }));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.messages(ticketId) }),
  });
}

export function useTicketUserProfile(ticketId: number) {
  return useQuery({
    queryKey: qk.profile(ticketId),
    enabled: Number.isFinite(ticketId) && ticketId > 0,
    queryFn: async () => mapProfile(await getData<unknown>(`/cs/tickets/${ticketId}/user/profile`)),
  });
}

export function useRequestJit(ticketId: number) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (feature: string) => postData<JitRequestResponse>(`/cs/tickets/${ticketId}/jit/request`, { feature }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: qk.profile(ticketId) });
			qc.invalidateQueries({ queryKey: qk.messages(ticketId) });
		},
	});
}

export function useSensitiveAction(ticketId: number, action: "reset-password" | "unblock-account" | "change-email" | "reset-pin") {
  return useMutation({
    mutationFn: (payload: unknown) => postData<unknown>(`/cs/tickets/${ticketId}/sensitive/${action}`, payload),
  });
}

export function useAuditLogs(level: "LOW" | "HIGH" | "MEDIUM", limit = 100) {
  return useQuery({
    queryKey: qk.audit(level, limit),
    queryFn: () => fetchAuditLogs(level, limit),
    refetchInterval: 10000,
  });
}

export function useAllAuditLogs(limit = 200) {
  return useQuery({
    queryKey: qk.audit("ALL", limit),
    queryFn: async () => asArray(await getData<unknown>(`/admin/audit-logs?limit=${limit}`)).map(mapAudit),
    refetchInterval: 10000,
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: qk.adminDashboard(),
    queryFn: () => getData<AdminDashboardStats>("/admin/dashboard"),
    refetchInterval: 10000,
  });
}

export function useAdminSessions() {
  return useQuery({
    queryKey: qk.adminSessions(),
    queryFn: async () => asArray(await getData<unknown>("/admin/sessions")).map(mapAdminSessionListItem),
    refetchInterval: 10000,
  });
}

export function useAdminSessionDetail(ticketId: number) {
  return useQuery({
    queryKey: qk.adminSessionDetail(ticketId),
    enabled: Number.isFinite(ticketId) && ticketId > 0,
    queryFn: async () => mapAdminSessionDetail(await getData<unknown>(`/admin/sessions/${ticketId}`)),
    refetchInterval: 10000,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: qk.adminUsers(),
    queryFn: async () => asArray(await getData<unknown>("/admin/users")).map(mapManagedUser),
    refetchInterval: 10000,
  });
}

export function useAdminTerminalTickets() {
  return useQuery({
    queryKey: qk.adminTerminalTickets(),
    queryFn: async () => asArray(await getData<unknown>("/admin/terminal/tickets")).map(mapAdminSessionListItem),
    refetchInterval: 10000,
  });
}

export function useAdminTerminalLogs(ticketId: number) {
  return useQuery({
    queryKey: qk.adminTerminalLogs(ticketId),
    enabled: Number.isFinite(ticketId) && ticketId > 0,
    queryFn: async () => asArray(await getData<unknown>(`/admin/terminal/tickets/${ticketId}/logs?limit=200`)).map(mapTerminalLogEntry),
    refetchInterval: 10000,
  });
}

export function useAdminCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; password: string; role: "user" | "cs" }) => mapManagedUser(await postData<unknown>("/admin/users", payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.adminUsers() });
      qc.invalidateQueries({ queryKey: qk.adminDashboard() });
    },
  });
}
