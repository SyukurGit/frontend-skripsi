import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Headphones,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { demoAccounts, type DemoRole } from "@/data/demo-accounts";

export const metadata: Metadata = {
  title: "Akun Demo | DompetKu",
  description: "Daftar akun yang tersedia untuk menguji prototipe DompetKu.",
};

const roleMeta: Record<
  DemoRole,
  { label: string; description: string; icon: typeof UserRound; accent: string; soft: string }
> = {
  user: {
    label: "Pengguna",
    description: "Membuat tiket dan melihat data simulasi milik akun sendiri.",
    icon: UserRound,
    accent: "text-[#1769e0]",
    soft: "bg-[#edf4ff]",
  },
  cs: {
    label: "Customer Support",
    description: "Menangani tiket yang telah di-assign sesuai konteks kerja.",
    icon: Headphones,
    accent: "text-[#8a5410]",
    soft: "bg-[#fff5df]",
  },
  admin: {
    label: "Administrator",
    description: "Memantau pengguna, sesi, terminal, dan bukti audit.",
    icon: ShieldCheck,
    accent: "text-[#9f3f30]",
    soft: "bg-[#fff1ed]",
  },
};

export default function DemoAccountsPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <header className="border-b border-[#dfe3e8] bg-white">
        <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <LogoMark compact />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke login
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12">
        <div className="flex max-w-3xl items-start gap-4">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#22262f] text-white">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs font-semibold text-[var(--brand)]">Kredensial pengujian terbuka</div>
            <h1 className="mt-2 text-3xl font-semibold text-[#171a21] sm:text-4xl">Akun demo yang terdaftar</h1>
            <p className="mt-3 text-sm leading-7 text-[#667085] sm:text-base">
              Gunakan salah satu akun berikut untuk menguji alur berdasarkan role. Daftar ini khusus untuk database lokal prototipe.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {demoAccounts.map((account) => {
            const meta = roleMeta[account.role];
            const Icon = meta.icon;

            return (
              <article key={account.email} className="overflow-hidden border border-[#dfe3e8] bg-white">
                <div className="flex items-start justify-between gap-4 border-b border-[#e9ecf0] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-md ${meta.soft} ${meta.accent}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#252932]">{meta.label}</div>
                      <div className="mt-0.5 text-xs uppercase text-[#7b8492]">Role: {account.role}</div>
                    </div>
                  </div>
                  <span className="rounded-full border border-[#dfe3e8] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold text-[#596170]">
                    Aktif
                  </span>
                </div>

                <div className="space-y-4 px-5 py-5 sm:px-6">
                  <p className="text-xs leading-5 text-[#667085]">{meta.description}</p>
                  <dl className="grid gap-3 sm:grid-cols-[5.5rem_1fr] sm:items-center">
                    <dt className="text-xs font-semibold text-[#7b8492]">Email</dt>
                    <dd className="overflow-x-auto rounded-md bg-[#f5f7fa] px-3 py-2 font-mono text-sm font-medium text-[#252932]">
                      {account.email}
                    </dd>
                    <dt className="text-xs font-semibold text-[#7b8492]">Password</dt>
                    <dd className="overflow-x-auto rounded-md bg-[#fff1ed] px-3 py-2 font-mono text-sm font-semibold text-[#8a3f31]">
                      {account.password}
                    </dd>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 border border-[#c8daf8] bg-[#edf4ff] px-4 py-4 text-sm text-[#33557d] sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-6">
            Halaman ini sengaja menampilkan password secara terbuka karena aplikasi hanya digunakan sebagai media demonstrasi lokal.
          </p>
          <Link href="/login" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)]">
            Pilih portal login
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
