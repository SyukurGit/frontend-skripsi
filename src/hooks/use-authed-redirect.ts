"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export function useAuthedRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const hydrated = useAuthStore((s) => s.hydrated);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!token) return;

    if (pathname === "/" || pathname === "/login" || pathname.startsWith("/login/")) {
      router.replace(role === "admin" ? "/admin" : role === "cs" ? "/cs" : "/user");
    }
  }, [hydrated, token, role, pathname, router]);
}
