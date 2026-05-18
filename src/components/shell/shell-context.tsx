"use client";

import * as React from "react";

type ShellContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (open: boolean) => void;
};

const ShellContext = React.createContext<ShellContextValue | null>(null);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  return <ShellContext.Provider value={{ mobileOpen, setMobileOpen, collapsed, setCollapsed }}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const ctx = React.useContext(ShellContext);
  if (!ctx) {
    throw new Error("useShell must be used within ShellProvider");
  }
  return ctx;
}
