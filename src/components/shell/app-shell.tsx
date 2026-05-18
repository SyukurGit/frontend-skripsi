"use client";

import * as React from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { ShellProvider, useShell } from "@/components/shell/shell-context";

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { collapsed } = useShell();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#f3f6fb_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <div className={`mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:py-6 ${collapsed ? "lg:px-10" : "lg:px-8"}`}>{children}</div>
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
