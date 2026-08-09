"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Check,
  Clock3,
  Headphones,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { DataPanel } from "@/components/ui/page";

const historyItems = [
  {
    title: "Top up saldo berhasil",
    time: "12 Mei 2026, 09.24",
    description: "Saldo contoh bertambah melalui simulasi virtual account.",
    source: "Simulasi dompet",
    icon: ReceiptText,
    tone: "bg-green-50 text-green-700",
  },
  {
    title: "Tiket bantuan dibuat",
    time: "12 Mei 2026, 10.02",
    description: "Ticket membentuk konteks sebelum Customer Support menangani pengguna.",
    source: "Contoh alur tiket",
    icon: BellRing,
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Tiket ditugaskan kepada CS",
    time: "12 Mei 2026, 10.06",
    description: "Least Privilege membatasi lingkup kerja CS pada tiket yang ditugaskan.",
    source: "Contoh kontrol akses",
    icon: Check,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    title: "Aktivitas sensitif diberitahukan",
    time: "Pembaruan muncul selama tiket aktif",
    description: "Aksi sensitif yang terkait tiket ditampilkan sebagai transparansi kepada pengguna.",
    source: "Contoh transparansi",
    icon: ShieldCheck,
    tone: "bg-amber-50 text-amber-700",
  },
];

export default function UserHistoryPage() {
  return (
    <div>
      <Topbar title="Aktivitas" subtitle="Jejak demonstrasi akun dan tiket" />

      <section className="mb-5 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-700">
          <Clock3 className="h-4 w-4" />
          Skenario demonstrasi
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
          Hubungan aktivitas dompet dan kontrol akses
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Linimasa ini menjelaskan alur prototipe, bukan riwayat finansial nyata. Bukti audit
          operasional tetap dibentuk oleh aktivitas tiket pada backend.
        </p>
      </section>

      <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <ReceiptText className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="leading-6">
          Seluruh nilai saldo dan transaksi pada linimasa adalah data simulasi. Item kontrol akses
          di bawah menggambarkan urutan pengujian skripsi.
        </p>
      </div>

      <DataPanel
        title="Linimasa skenario"
        description="Urutan ringkas dari aktivitas dompet hingga transparansi akses."
      >
        <ol className="relative before:absolute before:bottom-5 before:left-5 before:top-5 before:w-px before:bg-slate-200 before:content-['']">
          {historyItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <li
                key={item.title}
                className="relative flex gap-4 pb-6 last:pb-0 sm:gap-5"
              >
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-4 ring-white ${item.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div
                  className={`min-w-0 flex-1 ${
                    index < historyItems.length - 1 ? "border-b border-slate-100 pb-6" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">
                        Langkah {String(index + 1).padStart(2, "0")}
                      </div>
                      <h2 className="mt-1 font-semibold text-slate-950">{item.title}</h2>
                    </div>
                    <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      {item.source}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-600">{item.time}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </DataPanel>

      <section className="mt-5 flex flex-col gap-4 rounded-lg bg-slate-950 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex gap-3">
          <Headphones className="mt-0.5 h-5 w-5 shrink-0 text-indigo-200" />
          <div>
            <h2 className="text-sm font-semibold">Lihat status tiket yang sebenarnya</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
              Daftar tiket mengambil data backend dan menjadi titik masuk utama untuk percakapan
              serta pemberitahuan aktivitas sensitif.
            </p>
          </div>
        </div>
        <Link
          href="/user/tickets"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-slate-100"
        >
          Lihat tiket
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
