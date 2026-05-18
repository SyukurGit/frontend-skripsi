import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { CSBriefingModal } from "@/components/cs/cs-briefing-modal";

export default function CsLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth roles={["cs"]}>
      <AppShell>
        <CSBriefingModal />
        {children}
      </AppShell>
    </RequireAuth>
  );
}
