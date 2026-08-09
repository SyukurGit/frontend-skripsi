"use client";

import * as React from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { ShellProvider, useShell } from "@/components/shell/shell-context";
import { RoleScopeNotice } from "@/components/shell/role-scope-notice";

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { collapsed } = useShell();

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
          <div className={`mx-auto max-w-[1520px] px-4 py-3 sm:px-5 lg:py-4 ${collapsed ? "lg:px-8" : "lg:px-7"}`}>
            <RoleScopeNotice />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <ShellFrame>{children}</ShellFrame>
    </ShellProvider>
  );
}
