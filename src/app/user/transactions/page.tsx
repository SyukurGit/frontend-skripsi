"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Headphones,
  ReceiptText,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Card } from "@/components/ui/card";
import { DataPanel } from "@/components/ui/page";
import { formatMoneyIDR } from "@/utils/format";

const transactions = [
  {
    id: "SIM-VA-120526",
    title: "Top Up Virtual Account",
    date: "12 Mei 2026, 09.10",
    amount: 2500000,
    type: "Dana masuk",
  },
  {
    id: "SIM-TRF-110526",
    title: "Transfer ke Aulia S.",
    date: "11 Mei 2026, 19.34",
    amount: -350000,
    type: "Dana keluar",
  },
  {
    id: "SIM-BIL-100526",
    title: "Pembayaran Internet",
    date: "10 Mei 2026, 08.22",
    amount: -420000,
    type: "Dana keluar",
  },
  {
    id: "SIM-CBK-090526",
    title: "Cashback Merchant",
    date: "9 Mei 2026, 14.17",
    amount: 75000,
    type: "Dana masuk",
  },
];

export default function UserTransactionsPage() {
  return (
    <div>
      <Topbar title="Transaksi" subtitle="Aktivitas saldo simulasi" />

      <section className="mb-5 flex flex-col gap-4 py-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-amber-800">
              Data simulasi
            </span>
            <span className="text-xs text-slate-500">Tidak memproses dana nyata</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Aktivitas saldo
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Daftar ini hanya memberi konteks dompet digital untuk skenario bantuan. Fokus prototipe
            tetap pada kontrol akses melalui tiket.
          </p>
        </div>
        <Link
          href="/user/tickets/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white hover:bg-[var(--brand-hover)]"
        >
          <Headphones className="h-4 w-4" />
          Laporkan kendala
        </Link>
      </section>

      <Card className="overflow-hidden">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[0.8fr_0.8fr_1.4fr]">
          <div className="border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-r sm:px-6">
            <div className="text-xs font-semibold uppercase text-slate-500">Dana masuk</div>
            <div className="mt-2 text-xl font-semibold text-green-700 font-tabular sm:text-2xl">
              {formatMoneyIDR(2575000)}
            </div>
          </div>
          <div className="border-b border-slate-100 px-5 py-4 sm:border-b-0 lg:border-r sm:px-6">
            <div className="text-xs font-semibold uppercase text-slate-500">Dana keluar</div>
            <div className="mt-2 text-xl font-semibold text-slate-950 font-tabular sm:text-2xl">
              {formatMoneyIDR(770000)}
            </div>
          </div>
          <div className="flex items-start gap-3 px-5 py-4 sm:col-span-2 sm:border-t sm:border-slate-100 lg:col-span-1 lg:border-t-0 sm:px-6">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
            <div>
              <div className="text-sm font-semibold text-slate-950">Semua transaksi contoh berhasil</div>
              <div className="mt-1 text-sm leading-6 text-slate-500">
                Tidak ada dispute aktif pada skenario ini.
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="mt-5">
        <DataPanel
          title="Daftar transaksi"
          description="Referensi transaksi diawali SIM untuk menandai data demonstrasi."
        >
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => {
              const incoming = transaction.amount >= 0;
              const Icon = incoming ? ArrowDownLeft : ArrowUpRight;

              return (
                <article
                  key={transaction.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        incoming
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-950">{transaction.title}</h2>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <ReceiptText className="h-3.5 w-3.5" />
                        <span>{transaction.id}</span>
                        <span aria-hidden="true">/</span>
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pl-[52px] sm:pl-0 sm:text-right">
                    <div
                      className={`text-base font-semibold font-tabular ${
                        incoming ? "text-green-700" : "text-slate-950"
                      }`}
                    >
                      {incoming ? "+" : "-"}
                      {formatMoneyIDR(Math.abs(transaction.amount))}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{transaction.type} / Berhasil</div>
                  </div>
                </article>
              );
            })}
          </div>
        </DataPanel>
      </section>

      <div className="mt-5 flex flex-col gap-3 border-l-4 border-indigo-600 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-950">Kendala transaksi diselesaikan melalui tiket</div>
          <div className="mt-1 text-sm leading-6 text-slate-500">
            Percakapan tiket membentuk konteks penugasan sebelum CS menangani akun.
          </div>
        </div>
        <Link
          href="/user/tickets"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
        >
          Buka pusat bantuan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
