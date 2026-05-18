import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Role = "admin" | "cs" | "user";

export type AuthUser = {
  id: number;
  email: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setAuth: (token, user) => set({ token, user }),
      clear: () => set({ token: null, user: null }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "dompetku-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        try {
          window.localStorage.removeItem("dompetku-auth");
        } catch {
          // ignore legacy storage cleanup failure
        }
        state?.setHydrated(true);
      },
    },
  ),
);
