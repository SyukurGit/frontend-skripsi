import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { RequireAuth } from "@/components/auth/require-auth";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth roles={["user"]}>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
