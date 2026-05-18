"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type Role } from "@/store/auth";

export function RequireAuth({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: Role[];
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      router.replace(user.role === "admin" ? "/admin" : user.role === "cs" ? "/cs" : "/user");
    }
  }, [hydrated, token, user, roles, router]);

  if (!hydrated) return null;
  if (!token || !user) return null;
  if (roles && roles.length > 0 && !roles.includes(user.role)) return null;
  return <>{children}</>;
}
