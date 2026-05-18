"use client";

import Link from "next/link";
import { LogoMark } from "@/components/branding/logo-mark";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthedRedirect } from "@/hooks/use-authed-redirect";

const features = [
  {
    title: "Cek saldo real-time",
    desc: "Pantau saldo, aktivitas terakhir, dan status akun secara cepat dari dashboard utama.",
  },
  {
    title: "Transaksi cepat",
    desc: "Top up, transfer, dan lihat riwayat transaksi dengan alur yang terasa ringan seperti aplikasi fintech modern.",
  },
  {
    title: "Keamanan berlapis",
    desc: "Akses penting dijaga bertingkat. Pengguna cukup merasakan proses yang aman, sementara kontrol sensitif tetap terlindungi di belakang layar.",
  },
  {
    title: "Bantuan customer support",
    desc: "Saat butuh bantuan, pengguna bisa langsung menghubungi customer support dari dalam aplikasi tanpa keluar dari ekosistem DompetKu.",
  },
];

export default function Home() {
  useAuthedRedirect();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_30%),linear-gradient(180deg,#eef4ff_0%,#f8fbff_52%,#f4f7fb_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-[28px] border border-white/70 bg-white/88 px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur sm:px-6">
          <LogoMark compact />
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/login/user">
              <Button className="h-11">Login Pengguna</Button>
            </Link>
            <Link href="/login/staff">
              <Button variant="ghost" className="h-11 text-sm">Login Petugas</Button>
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,#0f172a_0%,#1d4ed8_58%,#335cff_100%)] px-7 py-8 text-white shadow-[0_32px_80px_rgba(37,99,235,0.18)] sm:px-10 sm:py-11">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
              Digital wallet experience
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              DompetKu - Dompet Digital Aman & Modern
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-50/88 sm:text-lg">
              Kelola saldo, lihat aktivitas transaksi, dan nikmati pengalaman dompet digital yang terasa ringan, aman, dan siap dipakai setiap hari.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login/user">
                <Button className="h-12 min-w-[210px] bg-white text-slate-950 shadow-none hover:bg-slate-100">Login Pengguna</Button>
              </Link>
              <Link href="/login/staff">
                <Button variant="secondary" className="h-12 min-w-[180px] border-white/20 bg-white/10 text-white hover:bg-white/16 hover:text-white">
                  Login Petugas
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Saldo aktif</div>
                <div className="mt-3 text-3xl font-semibold">Rp 12,5 Jt</div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Transaksi</div>
                <div className="mt-3 text-3xl font-semibold">Instan</div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Support</div>
                <div className="mt-3 text-3xl font-semibold">24/7</div>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-slate-200/80 bg-white/90">
            <CardBody className="flex h-full flex-col justify-between p-7 sm:p-8">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Produk fintech</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Dompet digital yang terasa seperti produk nyata, bukan tool internal.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Fokus utama DompetKu adalah pengalaman pengguna dalam mengelola saldo dan transaksi. Customer support hadir sebagai fitur pendukung saat dibutuhkan, bukan pusat dari seluruh tampilan.
                </p>
              </div>
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Wallet</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">Ringkasan saldo dan aktivitas harian</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Support</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">Akses bantuan pelanggan tanpa keluar dari aplikasi</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="mt-8 rounded-[36px] border border-white/70 bg-white/90 px-6 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:px-8 sm:py-10">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Kenapa DompetKu</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Semua yang Anda perlukan untuk mengelola dompet digital dalam satu produk.</h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f8fbff)]">
                <CardBody className="p-6">
                  <div className="text-lg font-semibold tracking-tight text-slate-950">{feature.title}</div>
                  <div className="mt-3 text-sm leading-7 text-slate-500">{feature.desc}</div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
