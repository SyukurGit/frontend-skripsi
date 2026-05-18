"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const highlights = {
  user: [
    "Pantau tiket bantuan dan percakapan secara real-time.",
    "Akses histori penanganan langsung dari dashboard Anda.",
    "Alur penutupan tiket mengikuti status backend secara ketat.",
  ],
  staff: [
    "Kelola antrean tiket dengan alur kerja operasional yang rapi.",
    "Akses sensitif diamankan oleh Least Privilege dan JIT.",
    "Audit dan monitoring real-time tersedia untuk tim operasional.",
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
      toast({ kind: "success", title: "Login berhasil", detail: `Akun masuk sebagai ${res.user.role}` });
      router.replace(res.user.role === "admin" ? "/admin" : res.user.role === "cs" ? "/cs" : "/user");
    } catch (error) {
      toast({ kind: "error", title: "Login gagal", detail: getErrorMessage(error, "Login gagal") });
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_32%),linear-gradient(180deg,#eef4ff_0%,#f8fbff_46%,#f3f6fb_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-stretch overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur">
        <section className="relative hidden w-full max-w-[48%] overflow-hidden border-r border-slate-200/70 bg-[linear-gradient(160deg,#0f172a_0%,#1e3a8a_45%,#335cff_100%)] p-10 text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(191,219,254,0.18),transparent_24%)]" />
          <div className="relative z-10 flex h-full flex-col">
            <LogoMark inverse />
            <div className="mt-16 max-w-xl">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                {audience === "user" ? "Portal Pengguna" : "Portal Operasional"}
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight">{title}</h1>
              <p className="mt-4 text-base leading-7 text-blue-100/92">{description}</p>
            </div>
            <div className="mt-10 grid gap-4">
              {highlights[audience].map((item) => (
                <div key={item} className="rounded-2xl border border-white/12 bg-white/10 px-5 py-4 text-sm leading-6 text-blue-50">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-3xl border border-white/12 bg-slate-950/22 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/75">Backend status</div>
              <div className="mt-3 text-lg font-semibold">
                {health.isLoading
                  ? "Memeriksa koneksi layanan..."
                  : health.isError
                    ? "Layanan belum tersedia"
                    : `Terhubung ke ${health.data?.service ?? "service"}`}
              </div>
              <div className="mt-2 text-sm text-blue-100/80">
                {health.isError ? getErrorMessage(health.error, "Health check failed") : "Sistem siap dipakai untuk alur tiket, chat, dan audit."}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,247,252,0.96))] p-6 sm:p-8 lg:p-12">
          <Card className="w-full max-w-xl border-slate-200/80 bg-white/95 p-0 shadow-[0_24px_50px_rgba(15,23,42,0.10)]">
            <div className="border-b border-slate-200/70 px-8 py-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Akses aman</div>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Masuk ke DompetKu</h2>
                </div>
                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                  {audience === "user" ? "Pengguna" : "Petugas"}
                </div>
              </div>
              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-500">Gunakan akun yang telah diotorisasi untuk mengakses dashboard sesuai peran.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 px-8 py-7">
              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@dompetku.id" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" />
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">Akun uji cepat</div>
                <div>{audience === "user" ? "user@example.com / user123" : "cs@example.com / cs123 atau admin@example.com / admin123"}</div>
                <div className="text-xs text-slate-500">Session disimpan per tab browser. Reload pada tab yang sama tetap aman, tetapi tab lain dapat memakai sesi berbeda untuk role lain.</div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={login.isPending} className="h-12 flex-1">
                  {login.isPending ? "Memproses..." : "Masuk ke Dashboard"}
                </Button>
                <Button type="button" variant="secondary" className="h-12 sm:w-auto" onClick={() => health.refetch()} disabled={health.isFetching}>
                  {health.isFetching ? "Checking..." : "Cek Layanan"}
                </Button>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <Link href={backHref} className="font-medium text-slate-700 transition hover:text-slate-950">
                  Kembali
                </Link>
                <div>
                  Butuh akses lain?{" "}
                  <Link href={audience === "user" ? "/login/staff" : "/login/user"} className="font-semibold text-blue-700 hover:text-blue-900">
                    {audience === "user" ? "Masuk sebagai petugas" : "Masuk sebagai pengguna"}
                  </Link>
                </div>
              </div>
            </form>
          </Card>
        </section>
      </div>
    </div>
  );
}
