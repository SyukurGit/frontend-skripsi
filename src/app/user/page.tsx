"use client";

import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { DemoScriptCard } from "@/components/demo/demo-script-card";
import { useAuthStore } from "@/store/auth";
import { formatMoneyIDR } from "@/utils/format";

const balance = 12500000;

const quickActions = [
  { label: "Top Up", hint: "Isi saldo instan" },
  { label: "Transfer", hint: "Kirim ke pengguna lain" },
  { label: "Riwayat", hint: "Lihat aktivitas terbaru" },
];

const transactions = [
  { id: 1, title: "Top Up via Virtual Account", date: "12 Mei 2026, 09:10", amount: 2500000, kind: "in" as const },
  { id: 2, title: "Transfer ke Aulia S.", date: "11 Mei 2026, 19:34", amount: -350000, kind: "out" as const },
  { id: 3, title: "Pembayaran Tagihan Internet", date: "10 Mei 2026, 08:22", amount: -420000, kind: "out" as const },
  { id: 4, title: "Cashback Promo Merchant", date: "09 Mei 2026, 14:17", amount: 75000, kind: "in" as const },
];

export default function UserHome() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Ringkasan saldo, transaksi, dan akses bantuan pelanggan" />

      <section className="grid gap-6 xl:grid-cols-[1.28fr_0.72fr]">
        <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,#0f172a,#1d4ed8_58%,#335cff)] text-white shadow-[0_24px_70px_rgba(37,99,235,0.18)]">
          <CardBody className="p-7 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/80">Saldo Anda</div>
            <div className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{formatMoneyIDR(balance)}</div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50/90 sm:text-base">
              Kelola saldo harian Anda dengan tampilan yang bersih, cepat, dan mudah dipahami - seperti aplikasi dompet digital yang siap dipakai setiap hari.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="rounded-3xl border border-white/14 bg-white/10 p-5 text-left hover:bg-white/14"
                >
                  <div className="text-base font-semibold text-white">{action.label}</div>
                  <div className="mt-2 text-sm text-blue-100/80">{action.hint}</div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        <DemoScriptCard
          title={`Selamat datang, ${user?.email}`}
          subtitle="Bagian pengguna berfungsi sebagai konteks aplikasi dompet digital, bukan fokus utama penelitian."
          steps={[
            "Tunjukkan bahwa pengguna melihat saldo dan transaksi seperti aplikasi dompet digital pada umumnya.",
            "Arahkan ke fitur Customer Support untuk memperlihatkan bahwa bantuan pelanggan tetap berada di dalam produk yang sama.",
            "Masuk ke detail tiket jika ingin menunjukkan bahwa pengguna dapat melihat transparansi aktivitas bantuan tanpa memperoleh akses internal.",
          ]}
        />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Transaksi masuk" value={formatMoneyIDR(2575000)} hint="Akumulasi pemasukan terbaru ke dompet Anda." />
        <StatCard label="Transaksi keluar" value={formatMoneyIDR(770000)} hint="Pengeluaran terbaru yang tercatat pada akun Anda." />
        <StatCard label="Customer support" value="Siap" hint="Tim bantuan tersedia saat Anda memerlukan asistensi." />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Riwayat transaksi</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Aktivitas terbaru</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-base font-semibold text-slate-950">{tx.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{tx.date}</div>
                  </div>
                  <div className={`text-lg font-semibold ${tx.kind === "in" ? "text-emerald-600" : "text-slate-900"}`}>
                    {tx.kind === "in" ? "+" : "-"}
                    {formatMoneyIDR(Math.abs(tx.amount))}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Bantuan pelanggan</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Butuh bantuan?</div>
          </CardHeader>
          <CardBody className="space-y-4 pt-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Jika Anda mengalami kendala transaksi, saldo, atau membutuhkan pengecekan akun, hubungi customer support langsung dari dalam aplikasi.
            </div>
            <Link href="/user/tickets">
              <Button className="h-12 w-full">Hubungi Customer Support</Button>
            </Link>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
