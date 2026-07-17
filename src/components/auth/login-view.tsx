"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, CheckCircle2, Database, KeyRound, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/page";
import { useHealth, useLogin } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

type LoginViewProps = {
  audience: "user" | "staff";
  title: string;
  description: string;
  defaultEmail: string;
  defaultPassword: string;
  backHref: string;
};

const roleNotes = {
  user: [
    "Membuat ticket bantuan dari konteks akun sendiri.",
    "Melihat chat dan notifikasi aktivitas sensitif.",
    "Menutup ticket hanya setelah status RESOLVED.",
  ],
  staff: [
    "CS bekerja hanya pada ticket yang ditugaskan.",
    "JIT hanya aktif saat status ticket IN_PROGRESS.",
    "Admin dapat membaca audit log dan terminal trace.",
  ],
} as const;

export function LoginView({ audience, title, description, defaultEmail, defaultPassword, backHref }: LoginViewProps) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const toast = useToastStore((s) => s.push);
  const health = useHealth();
  const login = useLogin();
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState(defaultPassword);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!token || !user) return;
    router.replace(user.role === "admin" ? "/admin" : user.role === "cs" ? "/cs" : "/user");
  }, [hydrated, token, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login.mutateAsync({ email, password });
      setAuth(res.token, res.user);
      toast({ kind: "success", title: "Login berhasil", detail: `Masuk sebagai ${res.user.role}` });
      router.replace(res.user.role === "admin" ? "/admin" : res.user.role === "cs" ? "/cs" : "/user");
    } catch (error) {
      toast({ kind: "error", title: "Login gagal", detail: getErrorMessage(error, "Login gagal") });
    }
  }

  const serviceReady = !health.isLoading && !health.isError;

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-4 py-6 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(16,24,32,0.18)] sm:p-7">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <LogoMark inverse compact />
              <Link href={backHref}>
                <Button variant="secondary" size="sm" className="border-white/15 bg-white/10 text-white hover:bg-white/15">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
              </Link>
            </div>

            <div className="mt-10 max-w-xl">
              <Pill tone={audience === "user" ? "warning" : "info"}>{audience === "user" ? "Portal Pengguna" : "Portal Staff"}</Pill>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
              <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
            </div>

            <div className="mt-8 grid gap-3">
              {roleNotes[audience].map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <div className="text-sm leading-6 text-slate-200">{item}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto rounded-xl border border-white/10 bg-white/6 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                <Activity className="h-4 w-4" />
                Backend health
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{health.isLoading ? "Memeriksa layanan..." : serviceReady ? "Layanan siap" : "Layanan bermasalah"}</div>
                  <div className="mt-1 text-sm text-slate-400">{serviceReady ? health.data?.service ?? "support-backend" : health.isError ? getErrorMessage(health.error, "Health check gagal") : "Menunggu response"}</div>
                </div>
                <Button size="sm" variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/15" onClick={() => health.refetch()} disabled={health.isFetching}>
                  Cek
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Authenticated demo session
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Masuk ke DompetKu</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Gunakan akun demo untuk menguji role dan alur backend.</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white">
                {audience === "user" ? <UserRound className="h-6 w-6" /> : <LockKeyhole className="h-6 w-6" />}
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <UserRound className="h-4 w-4" />
                  Email
                </label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@example.com" />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <KeyRound className="h-4 w-4" />
                  Password
                </label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password akun demo" />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <Database className="h-4 w-4 text-emerald-700" />
                  Akun uji cepat
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  {audience === "user" ? "user@example.com / user123" : "cs@example.com / cs123 atau admin@example.com / admin123"}
                </div>
                <div className="mt-2 text-xs leading-5 text-slate-500">Session disimpan per tab agar role user, CS, dan admin bisa diuji berdampingan.</div>
              </div>

              <Button type="submit" size="lg" disabled={login.isPending} className="w-full">
                {login.isPending ? "Memproses login..." : "Masuk"}
              </Button>

              <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <Link href={backHref} className="font-semibold text-slate-800 hover:text-slate-950">Kembali ke pilihan role</Link>
                <Link href={audience === "user" ? "/login/staff" : "/login/user"} className="font-semibold text-emerald-800 hover:text-emerald-900">
                  {audience === "user" ? "Masuk sebagai staff" : "Masuk sebagai pengguna"}
                </Link>
              </div>
            </form>
          </Card>
        </section>
      </div>
    </main>
  );
}
