import { create } from "zustand";

export type ToastKind = "success" | "error" | "info";

export type Toast = {
  id: string;
  kind: ToastKind;
  title: string;
  detail?: string;
  createdAt: number;
};

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id" | "createdAt">) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => ({
      toasts: [...s.toasts, { ...t, id: uid(), createdAt: Date.now() }].slice(-5),
    })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
