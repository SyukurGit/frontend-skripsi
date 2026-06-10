"use client";

import * as React from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { ShellProvider, useShell } from "@/components/shell/shell-context";

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { collapsed } = useShell();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto flex min-h-screen max-w-full">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <div className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${collapsed ? "lg:px-10" : "lg:px-8"}`}>{children}</div>
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
