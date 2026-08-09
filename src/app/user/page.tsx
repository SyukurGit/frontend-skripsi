"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Headphones,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { useUserTickets } from "@/services/queries";
import { formatMoneyIDR } from "@/utils/format";

const balance = 12500000;

const transactions = [
  { id: 1, title: "Top Up Virtual Account", date: "12 Mei 2026, 09.10", amount: 2500000 },
  { id: 2, title: "Transfer ke Aulia S.", date: "11 Mei 2026, 19.34", amount: -350000 },
  { id: 3, title: "Tagihan Internet", date: "10 Mei 2026, 08.22", amount: -420000 },
];

const accessSteps = [
  "Tiket dibuat oleh pengguna",
  "Customer Support ditugaskan pada tiket",
  "Akses sensitif dibatasi sesi JIT",
];

export default function UserHome() {
  const ticketsQuery = useUserTickets();
  const tickets = ticketsQuery.data ?? [];
  const activeTickets = tickets.filter((ticket) => ticket.status !== "CLOSED");
  const latestTicket = activeTickets[0] ?? tickets[0];

  return (
    <div>
      <Topbar title="Dompet" subtitle="Akun simulasi dan bantuan berbasis tiket" />

      <section className="overflow-hidden rounded-lg bg-slate-950 text-white">
        <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="px-5 py-7 sm:px-7 sm:py-9 lg:px-9">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-200">
              <Headphones className="h-4 w-4" />
              Bantuan berbasis tiket
            </div>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
              Ada kendala dengan akun simulasi Anda?
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Buat tiket untuk memulai percakapan. Tiket menjadi konteks yang membatasi petugas,
              fitur sensitif, dan durasi akses pada prototipe penelitian ini.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/user/tickets/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                Buat tiket bantuan
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/user/tickets"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                Lihat tiket saya
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/[0.04] px-5 py-6 sm:px-7 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-400">Tiket saat ini</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {ticketsQuery.isLoading
                    ? "Memuat status..."
                    : `${activeTickets.length} tiket belum ditutup`}
                </div>
              </div>
              {latestTicket ? <StatusBadge status={latestTicket.status} /> : null}
            </div>

            <ol className="mt-6 space-y-4">
              {accessSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-indigo-200">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-300">{step}</span>
                </li>
              ))}
            </ol>

            {ticketsQuery.isError ? (
              <div className="mt-5 border-t border-white/10 pt-4 text-xs text-amber-200">
                Status tiket belum dapat disinkronkan.
              </div>
            ) : latestTicket ? (
              <Link
                href={`/user/tickets/${latestTicket.id}`}
                className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-white hover:text-indigo-200"
              >
                Buka tiket #{latestTicket.id}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)]">
        <Card>
          <CardBody className="pt-5 sm:pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <WalletCards className="h-4 w-4" />
                  Saldo utama
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-950 font-tabular sm:text-4xl">
                  {formatMoneyIDR(balance)}
                </div>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                Simulasi
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Saldo, limit, dan transaksi pada portal ini hanya data demonstrasi. Tidak ada dana
              atau layanan pembayaran nyata.
            </p>

            <dl className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
              <div className="flex items-center justify-between gap-3 py-3 text-sm">
                <dt className="text-slate-500">Limit transaksi harian</dt>
                <dd className="font-semibold text-slate-900 font-tabular">Rp 25.000.000</dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-3 text-sm">
                <dt className="text-slate-500">Status akun contoh</dt>
                <dd className="font-semibold text-green-700">Normal</dd>
              </div>
            </dl>

            <Link
              href="/user/transactions"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              Lihat transaksi simulasi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardBody>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-950">Transaksi terbaru</h2>
              <p className="mt-1 text-sm text-slate-500">Data simulasi untuk konteks bantuan.</p>
            </div>
            <Clock3 className="h-5 w-5 text-slate-400" />
          </div>
          <CardBody className="pt-1">
            <div className="divide-y divide-slate-100">
              {transactions.map((transaction) => {
                const incoming = transaction.amount > 0;
                const Icon = incoming ? ArrowDownLeft : ArrowUpRight;

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          incoming
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-950">
                          {transaction.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{transaction.date}</div>
                      </div>
                    </div>
                    <div
                      className={`shrink-0 text-sm font-semibold font-tabular ${
                        incoming ? "text-green-700" : "text-slate-950"
                      }`}
                    >
                      {incoming ? "+" : "-"}
                      {formatMoneyIDR(Math.abs(transaction.amount))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mt-5 flex flex-col gap-4 rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
          <div>
            <h2 className="text-sm font-semibold text-slate-950">Akses internal tidak terbuka dari halaman dompet</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              Assignment ticket membatasi pengguna yang boleh ditangani Customer Support. Aksi sensitif berikutnya
              tetap memerlukan sesi Just-in-Time yang valid dan tercatat.
            </p>
          </div>
        </div>
        <Link
          href="/user/tickets"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 text-sm font-semibold text-indigo-800 hover:border-indigo-300"
        >
          Pusat bantuan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
