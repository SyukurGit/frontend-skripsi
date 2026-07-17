"use client";

import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, UserRound } from "lucide-react";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { useAuthedRedirect } from "@/hooks/use-authed-redirect";

const options = [
  {
    href: "/login/user",
    title: "Portal Pengguna",
    desc: "Masuk sebagai nasabah untuk melihat saldo, transaksi, membuat ticket, dan menerima transparansi aktivitas sensitif.",
    badge: "USER",
    icon: UserRound,
  },
  {
    href: "/login/staff",
    title: "Workspace Staff",
    desc: "Masuk sebagai CS atau Admin untuk menguji assignment ticket, JIT access, audit log, dan terminal trace.",
    badge: "CS / ADMIN",
    icon: Headphones,
  },
];

export default function LoginChooserPage() {
  useAuthedRedirect();

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <LogoMark compact />
          <Link href="/homepage">
            <Button variant="secondary" size="sm">Landing</Button>
          </Link>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_48px_rgba(16,24,32,0.07)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                Role-based entry point
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Pilih ruang uji sesuai aktor sistem.</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Frontend ini sengaja memisahkan pengalaman pengguna, Customer Support, dan Administrator agar pengujian RBAC, Least Privilege, dan JIT dapat terlihat dari alur yang berbeda.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <Link
                    key={option.href}
                    href={option.href}
                    className="group rounded-xl border border-slate-200 bg-[#fbfcf8] p-5 transition hover:border-emerald-300 hover:bg-emerald-50/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">{option.badge}</span>
                    </div>
                    <div className="mt-5 text-xl font-semibold text-slate-950">{option.title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{option.desc}</div>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                      Lanjutkan
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
