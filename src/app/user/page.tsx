"use client";

import Link from "next/link";
import { ArrowUpRight, CreditCard, Headphones, ShieldCheck, WalletCards } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { DataPanel, PageHeader, Pill } from "@/components/ui/page";
import { StatCard } from "@/components/ui/stat-card";
import { formatMoneyIDR } from "@/utils/format";

const balance = 12500000;

const transactions = [
  { id: 1, title: "Top Up Virtual Account", date: "12 Mei 2026, 09:10", amount: 2500000, kind: "in" as const },
  { id: 2, title: "Transfer ke Aulia S.", date: "11 Mei 2026, 19:34", amount: -350000, kind: "out" as const },
  { id: 3, title: "Tagihan Internet", date: "10 Mei 2026, 08:22", amount: -420000, kind: "out" as const },
  { id: 4, title: "Cashback Merchant", date: "09 Mei 2026, 14:17", amount: 75000, kind: "in" as const },
];

export default function UserHome() {
  return (
    <div>
      <Topbar title="Dompet Pengguna" subtitle="Konteks produk untuk pengujian akses internal" />
      <PageHeader
        eyebrow="Portal pengguna"
        title="Akun dompet digital dengan jalur bantuan yang dapat diaudit"
        description="Area ini dibuat seperti aplikasi dompet biasa, tetapi setiap ticket bantuan akan menjadi konteks pembatasan akses Customer Support."
        actions={
          <>
            <Link href="/user/tickets/new">
              <Button>
                <Headphones className="h-4 w-4" />
                Buat ticket
              </Button>
            </Link>
            <Link href="/user/transactions">
              <Button variant="secondary">
                <CreditCard className="h-4 w-4" />
                Transaksi
              </Button>
            </Link>
          </>
        }
        meta={<Pill tone="success">Akun aktif dan terverifikasi sebagian</Pill>}
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_0.72fr]">
        <div className="rounded-xl bg-slate-950 p-5 text-white shadow-[0_18px_48px_rgba(16,24,32,0.16)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-300">
                <WalletCards className="h-4 w-4" />
                Saldo utama
              </div>
              <div className="mt-3 text-4xl font-semibold font-tabular sm:text-5xl">{formatMoneyIDR(balance)}</div>
              <div className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Saldo dan transaksi bersifat dummy untuk membangun konteks dompet digital. Mekanisme penelitian ada pada ticket dan akses internal.</div>
            </div>
            <div className="hidden rounded-xl border border-white/10 bg-white/6 p-4 text-right sm:block">
              <div className="text-xs uppercase text-slate-400">Limit harian</div>
              <div className="mt-1 font-semibold">Rp 25.000.000</div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white/8 p-4">
              <div className="text-xs text-slate-400">KYC</div>
              <div className="mt-1 font-semibold">PENDING</div>
            </div>
            <div className="rounded-lg bg-white/8 p-4">
              <div className="text-xs text-slate-400">Status akun</div>
              <div className="mt-1 font-semibold text-emerald-300">Normal</div>
            </div>
            <div className="rounded-lg bg-white/8 p-4">
              <div className="text-xs text-slate-400">Support</div>
              <div className="mt-1 font-semibold">Ticket-based</div>
            </div>
          </div>
        </div>

        <DataPanel title="Transparansi akses" description="Pengguna bisa melihat aktivitas sensitif yang terjadi pada sesi bantuannya.">
          <div className="space-y-3">
            {[
              "CS tidak dapat melihat data pengguna tanpa ticket yang ditugaskan.",
              "Aksi sensitif membutuhkan JIT dan tercatat ke audit log.",
              "Notifikasi sistem muncul di chat saat akses sensitif dilakukan.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <div className="text-sm leading-6 text-slate-600">{item}</div>
              </div>
            ))}
          </div>
        </DataPanel>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <StatCard label="Pemasukan terbaru" value={formatMoneyIDR(2575000)} hint="Total transaksi masuk dummy" tone="success" />
        <StatCard label="Pengeluaran terbaru" value={formatMoneyIDR(770000)} hint="Total transaksi keluar dummy" tone="warning" />
        <StatCard label="Ticket context" value="Aktif" hint="Support berjalan melalui ticket" tone="info" />
      </section>

      <section className="mt-5">
        <DataPanel
          title="Transaksi terbaru"
          description="Konteks aktivitas keuangan untuk skenario bantuan pelanggan."
          actions={
            <Link href="/user/history">
              <Button variant="secondary" size="sm">
                Lihat riwayat
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        >
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <div className="text-sm font-semibold text-slate-950">{tx.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{tx.date}</div>
                </div>
                <div className={`text-sm font-semibold font-tabular ${tx.kind === "in" ? "text-emerald-700" : "text-slate-900"}`}>
                  {tx.kind === "in" ? "+" : "-"}
                  {formatMoneyIDR(Math.abs(tx.amount))}
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
      </section>
    </div>
  );
}
