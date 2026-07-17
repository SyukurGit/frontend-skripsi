"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Headphones, LockKeyhole, ReceiptText, ShieldCheck, Smartphone } from "lucide-react";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { useAuthedRedirect } from "@/hooks/use-authed-redirect";
import { formatMoneyIDR } from "@/utils/format";

const transactions = [
  { label: "Top up VA", value: "+Rp 2.500.000", tone: "text-emerald-700" },
  { label: "Internet rumah", value: "-Rp 420.000", tone: "text-slate-800" },
  { label: "Cashback merchant", value: "+Rp 75.000", tone: "text-emerald-700" },
];

export default function Homepage() {
  useAuthedRedirect();

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <header className="border-b border-slate-200 bg-white/86 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <LogoMark compact />
          <div className="flex items-center gap-2">
            <Link href="/login/user">
              <Button variant="ghost" size="sm">Pengguna</Button>
            </Link>
            <Link href="/login/staff">
              <Button size="sm">Staff</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            Prototipe dompet digital untuk pengujian LP + JIT
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            DompetKu memperlihatkan akses internal yang dibatasi oleh ticket, waktu, dan audit.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Sisi pengguna tetap terasa seperti aplikasi dompet digital, sementara sisi staff membuktikan bahwa Customer Support tidak otomatis punya akses penuh terhadap data sensitif.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/login/user">
              <Button size="lg" className="w-full sm:w-auto">
                Masuk sebagai pengguna
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login/staff">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Buka workspace staff
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["RBAC", "Role tetap menjadi gerbang awal."],
              ["Least Privilege", "CS hanya melihat ticket yang ditugaskan."],
              ["JIT Access", "Fitur sensitif aktif sementara."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-950">{title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-3 shadow-[0_28px_70px_rgba(16,24,32,0.18)]">
            <div className="rounded-[22px] bg-[#f9faf5] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">Saldo utama</div>
                  <div className="mt-2 text-3xl font-semibold font-tabular">{formatMoneyIDR(12500000)}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <Smartphone className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="text-xs text-slate-500">Status akun</div>
                  <div className="mt-1 font-semibold text-emerald-700">Aktif</div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="text-xs text-slate-500">KYC</div>
                  <div className="mt-1 font-semibold text-slate-950">Terkendali</div>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {transactions.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ReceiptText className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.tone}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
          {[
            { icon: Headphones, title: "Support berbasis ticket", desc: "Setiap percakapan bantuan punya konteks dan status lifecycle." },
            { icon: LockKeyhole, title: "Data sensitif terkunci", desc: "KYC dan aksi akun tidak terbuka permanen untuk CS." },
            { icon: CheckCircle2, title: "Audit dapat ditelusuri", desc: "Admin melihat keputusan backend secara formal dan realtime." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-[#fbfcf8] p-5">
                <Icon className="h-5 w-5 text-emerald-700" />
                <div className="mt-4 font-semibold text-slate-950">{item.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
