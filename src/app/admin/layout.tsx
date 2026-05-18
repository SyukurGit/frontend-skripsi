import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { RequireAuth } from "@/components/auth/require-auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth roles={["admin"]}>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
