import { create } from "zustand";

export type JitFeature =
  | "RESET_PASSWORD"
  | "UNBLOCK_ACCOUNT"
  | "CHANGE_EMAIL"
  | "RESET_PIN"
  | "VIEW_KYC";

export type JitSessionView = {
  ticketId: number;
  feature: JitFeature;
  expiredAt: string; // ISO
};

type JitState = {
  sessions: Record<string, JitSessionView>; // key: `${ticketId}:${feature}`
  set: (s: JitSessionView) => void;
  clear: (ticketId: number, feature: JitFeature) => void;
  clearTicket: (ticketId: number) => void;
  get: (ticketId: number, feature: JitFeature) => JitSessionView | null;
  isActive: (ticketId: number, feature: JitFeature) => boolean;
  getRemainingMs: (ticketId: number, feature: JitFeature) => number;
};

function key(ticketId: number, feature: JitFeature) {
  return `${ticketId}:${feature}`;
}

export const useJitStore = create<JitState>((set, get) => ({
  sessions: {},
  set: (s) =>
    set((st) => ({
      sessions: { ...st.sessions, [key(s.ticketId, s.feature)]: s },
    })),
  clear: (ticketId, feature) =>
    set((st) => {
      const next = { ...st.sessions };
      delete next[key(ticketId, feature)];
      return { sessions: next };
    }),
  clearTicket: (ticketId) =>
    set((st) => {
      const next = { ...st.sessions };
      for (const k of Object.keys(next)) {
        if (k.startsWith(`${ticketId}:`)) delete next[k];
      }
      return { sessions: next };
    }),
  get: (ticketId, feature) => {
    return get().sessions[key(ticketId, feature)] ?? null;
  },
  isActive: (ticketId, feature) => {
    const s = get().sessions[key(ticketId, feature)];
    if (!s) return false;
    return Date.now() < new Date(s.expiredAt).getTime();
  },
  getRemainingMs: (ticketId, feature) => {
    const s = get().sessions[key(ticketId, feature)];
    if (!s) return 0;
    return Math.max(0, new Date(s.expiredAt).getTime() - Date.now());
  },
}));
