"use client";

import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { DataPanel, PageHeader, Pill } from "@/components/ui/page";
import { StatCard } from "@/components/ui/stat-card";
import { formatMoneyIDR } from "@/utils/format";

const transactions = [
  { title: "Top Up Virtual Account", date: "12 Mei 2026", amount: 2500000, status: "Berhasil", type: "Masuk" },
  { title: "Transfer ke Aulia S.", date: "11 Mei 2026", amount: -350000, status: "Berhasil", type: "Keluar" },
  { title: "Pembayaran Internet", date: "10 Mei 2026", amount: -420000, status: "Berhasil", type: "Keluar" },
  { title: "Cashback Merchant", date: "09 Mei 2026", amount: 75000, status: "Berhasil", type: "Masuk" },
];

export default function UserTransactionsPage() {
  return (
    <div>
      <Topbar title="Transaksi" subtitle="Aktivitas dompet sebagai konteks skenario support" />
      <PageHeader
        eyebrow="Aktivitas dompet"
        title="Transaksi dummy yang mendukung narasi dompet digital"
        description="Data transaksi ini tidak menjadi fokus penelitian. Fungsinya memberi konteks realistis saat pengguna membuat ticket bantuan."
        meta={<Pill tone="info">Context data, bukan data finansial nyata</Pill>}
      />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total masuk" value={formatMoneyIDR(2575000)} hint="Simulasi pemasukan" tone="success" />
        <StatCard label="Total keluar" value={formatMoneyIDR(770000)} hint="Simulasi pengeluaran" tone="warning" />
        <StatCard label="Status" value="Normal" hint="Tidak ada dispute aktif" tone="neutral" />
      </section>
      <section className="mt-5">
        <DataPanel title="Daftar transaksi" description="Dipakai untuk membuat alur bantuan terasa seperti produk dompet digital.">
          <div className="space-y-3">
            {transactions.map((tx) => {
              const incoming = tx.amount >= 0;
              const Icon = incoming ? ArrowDownLeft : ArrowUpRight;
              return (
                <div key={`${tx.title}-${tx.date}`} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${incoming ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">{tx.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <ReceiptText className="h-4 w-4" />
                        {tx.date}
                        <span>•</span>
                        {tx.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className={`text-lg font-semibold font-tabular ${incoming ? "text-emerald-700" : "text-slate-950"}`}>
                      {incoming ? "+" : "-"}{formatMoneyIDR(Math.abs(tx.amount))}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase text-emerald-700">{tx.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </DataPanel>
      </section>
    </div>
  );
}
