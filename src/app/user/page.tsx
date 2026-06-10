"use client";

import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { useAuthStore } from "@/store/auth";
import { formatMoneyIDR } from "@/utils/format";

const balance = 12500000;

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
      <Topbar title="Dashboard" subtitle="Saldo dan aktivitas transaksi Anda" />

      {/* Balance Overview */}
      <section className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white sm:p-8">
        <div className="text-sm font-semibold text-blue-100">Saldo Anda</div>
        <div className="mt-3 text-4xl font-bold sm:text-5xl">{formatMoneyIDR(balance)}</div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/user/transactions" className="flex-1">
            <Button className="w-full bg-white text-blue-600 hover:bg-slate-100">Transaksi</Button>
          </Link>
          <Link href="/user/tickets" className="flex-1">
            <Button variant="secondary" className="w-full border-white/30 bg-white/10 hover:bg-white/20">Support</Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Transaksi masuk" value={formatMoneyIDR(2575000)} hint="Total pemasukan terbaru" />
        <StatCard label="Transaksi keluar" value={formatMoneyIDR(770000)} hint="Total pengeluaran terbaru" />
        <StatCard label="Status akun" value="Aktif" hint="Akun dalam kondisi normal" />
      </section>

      {/* Transactions & Support */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">Riwayat</div>
            <div className="mt-2 text-xl font-bold text-slate-950">Transaksi terbaru</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div>
                    <div className="font-medium text-slate-950">{tx.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{tx.date}</div>
                  </div>
                  <div className={`font-semibold ${tx.kind === "in" ? "text-emerald-600" : "text-slate-900"}`}>
                    {tx.kind === "in" ? "+" : "-"}
                    {formatMoneyIDR(Math.abs(tx.amount))}
                  </div>
                </div>
              ))}
              <Link href="/user/history">
                <Button variant="ghost" className="w-full mt-2 text-slate-600 hover:text-slate-950">Lihat semua →</Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Support Card */}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">Bantuan</div>
            <div className="mt-2 text-xl font-bold text-slate-950">Hubungi support</div>
          </CardHeader>
          <CardBody className="space-y-4 pt-4">
            <p className="text-sm text-slate-600">Butuh bantuan dengan saldo, transaksi, atau akun? Tim customer support kami siap membantu.</p>
            <Link href="/user/tickets">
              <Button className="w-full">Buka ticket</Button>
            </Link>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
