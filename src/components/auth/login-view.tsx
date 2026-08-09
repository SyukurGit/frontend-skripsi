"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Activity,
  ArrowLeft,
  Check,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHealth, useLogin } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { cn } from "@/utils/cn";

type LoginViewProps = {
  audience: "user" | "staff";
  title: string;
  description: string;
  defaultEmail: string;
  defaultPassword: string;
  backHref: string;
};

const roleLabel = {
  user: "Pengguna",
  cs: "Customer Support",
  admin: "Administrator",
} as const;

const scopeRows = {
  user: [
    "Ticket hanya dapat dibuka dari akun pengguna sendiri.",
    "Aktivitas sensitif pada ticket ditampilkan sebagai transparansi.",
    "Saldo dan transaksi pada antarmuka merupakan data simulasi.",
  ],
  staff: [
    "Customer Support hanya bekerja pada ticket yang di-assign.",
    "Session JIT hanya dapat diterbitkan ketika ticket IN_PROGRESS.",
    "Administrator memantau audit, bukan menyetujui JIT secara manual.",
  ],
} as const;

export function LoginView({
  audience,
  title,
  description,
  defaultEmail,
  defaultPassword,
  backHref,
}: LoginViewProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const toast = useToastStore((state) => state.push);
  const health = useHealth();
  const login = useLogin();
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState(defaultPassword);

  React.useEffect(() => {
    if (!hydrated || !token || !user) return;
    router.replace(user.role === "admin" ? "/admin" : user.role === "cs" ? "/cs" : "/user");
  }, [hydrated, token, user, router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await login.mutateAsync({ email, password });
      setAuth(response.token, response.user);
      toast({
        kind: "success",
        title: "Login berhasil",
        detail: `Masuk sebagai ${roleLabel[response.user.role]}. Akses tetap mengikuti konteks kerja.`,
      });
      router.replace(response.user.role === "admin" ? "/admin" : response.user.role === "cs" ? "/cs" : "/user");
    } catch (error) {
      toast({ kind: "error", title: "Login gagal", detail: getErrorMessage(error, "Login gagal") });
    }
  }

  function applyCredential(kind: "user" | "cs" | "admin") {
    const credentials = {
      user: ["user@example.com", "user123"],
      cs: ["cs@example.com", "cs123"],
      admin: ["admin@example.com", "admin123"],
    } as const;
    setEmail(credentials[kind][0]);
    setPassword(credentials[kind][1]);
  }

  const serviceReady = !health.isLoading && !health.isError;

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <header className="border-b border-[#dfe3e8] bg-white">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <LogoMark compact />
          <Button asChild variant="ghost" size="sm">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
              Pilih aktor
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-1 lg:sticky lg:top-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand)]">
            {audience === "user" ? <UserRound className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
            {audience === "user" ? "Akses pengguna" : "Akses pengguna internal"}
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-[#171a21] sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-[#667085]">{description}</p>

          <div className="mt-7 divide-y divide-[#dfe3e8] border-y border-[#dfe3e8]">
            {scopeRows[audience].map((row) => (
              <div key={row} className="flex gap-3 py-3.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                <span className="text-sm leading-6 text-[#596170]">{row}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="border border-[#dfe3e8] bg-white"
        >
          <div className="border-b border-[#e9ecf0] px-5 py-5 sm:px-7">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7b8492]">
              <ShieldCheck className="h-4 w-4 text-[var(--brand)]" />
              Sesi akun pengujian
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-[#171a21]">Masuk ke DompetKu</h2>
            <p className="mt-1 text-sm text-[#667085]">Gunakan akun yang sesuai dengan aktor skenario.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#3b414b]">
                <UserRound className="h-4 w-4 text-[#7b8492]" />
                Email
              </label>
              <Input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@example.com"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#3b414b]">
                <KeyRound className="h-4 w-4 text-[#7b8492]" />
                Password
              </label>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password akun uji"
              />
            </div>

            <div className="border border-[#dfe3e8] bg-[#f8fafc] p-3.5">
              <div className="text-xs font-semibold text-[#596170]">Isi akun uji</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {audience === "user" ? (
                  <button type="button" onClick={() => applyCredential("user")} className="rounded-md border border-[#d6dbe1] bg-white px-3 py-2 text-xs font-semibold text-[#3b414b] hover:border-[var(--brand)] hover:text-[var(--brand)]">
                    Pengguna
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => applyCredential("cs")} className="rounded-md border border-[#d6dbe1] bg-white px-3 py-2 text-xs font-semibold text-[#3b414b] hover:border-[var(--brand)] hover:text-[var(--brand)]">
                      Customer Support
                    </button>
                    <button type="button" onClick={() => applyCredential("admin")} className="rounded-md border border-[#d6dbe1] bg-white px-3 py-2 text-xs font-semibold text-[#3b414b] hover:border-[var(--brand)] hover:text-[var(--brand)]">
                      Administrator
                    </button>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs leading-5 text-[#7b8492]">Kredensial hanya untuk lingkungan lokal prototipe.</p>
            </div>

            <div className="border-l-2 border-[var(--coral)] bg-[#fff1ed] px-3 py-2.5 text-xs leading-5 text-[#6e3c32]">
              Login tidak memberikan akses penuh. Backend tetap memeriksa ticket, assignment, status, feature, dan session JIT.
            </div>

            <Button type="submit" size="lg" disabled={login.isPending} className="w-full">
              {login.isPending ? "Memeriksa akun..." : "Masuk"}
            </Button>
          </form>

          <div className="flex flex-col gap-3 border-t border-[#e9ecf0] bg-[#f8fafc] px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex min-w-0 items-center gap-2 text-[#667085]">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", serviceReady ? "bg-[#3a8a63]" : health.isLoading ? "bg-[#c47b16]" : "bg-[#c83243]")} />
              <span className="truncate">
                {health.isLoading ? "Memeriksa backend" : serviceReady ? "Backend prototipe terhubung" : getErrorMessage(health.error, "Backend tidak terhubung")}
              </span>
            </div>
            <button type="button" onClick={() => health.refetch()} disabled={health.isFetching} className="inline-flex items-center gap-1.5 font-semibold text-[var(--brand)] disabled:opacity-50">
              {health.isFetching ? <Activity className="h-3.5 w-3.5 animate-pulse" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Periksa ulang
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
