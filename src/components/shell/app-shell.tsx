"use client";

import * as React from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { ShellProvider, useShell } from "@/components/shell/shell-context";

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { collapsed } = useShell();

  return (
    <div className="min-h-screen bg-[#f6f7f4]">
      <div className="mx-auto flex min-h-screen max-w-full">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <div className={`mx-auto max-w-[1480px] px-4 py-4 sm:px-5 lg:py-5 ${collapsed ? "lg:px-8" : "lg:px-6"}`}>{children}</div>
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
