"use client";

import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatMoneyIDR } from "@/utils/format";

const transactions = [
  { title: "Top Up via Virtual Account", date: "12 Mei 2026", amount: 2500000, status: "Berhasil" },
  { title: "Transfer ke Aulia S.", date: "11 Mei 2026", amount: -350000, status: "Berhasil" },
  { title: "Pembayaran Tagihan Internet", date: "10 Mei 2026", amount: -420000, status: "Berhasil" },
];

export default function UserTransactionsPage() {
  return (
    <div>
      <Topbar title="Transaksi" subtitle="Kelola aktivitas keluar masuk dana dari satu tempat" />
      <Card>
        <CardHeader>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Daftar transaksi</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Semua aktivitas dompet digital</div>
        </CardHeader>
        <CardBody className="pt-4">
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={`${tx.title}-${tx.date}`} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-semibold text-slate-950">{tx.title}</div>
                  <div className="mt-1 text-sm text-slate-500">{tx.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-950">{tx.amount >= 0 ? "+" : "-"}{formatMoneyIDR(Math.abs(tx.amount))}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-600">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
