"use client";

import { BellRing, Clock3, ReceiptText, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { DataPanel, PageHeader, Pill } from "@/components/ui/page";

const historyItems = [
  {
    title: "Top up saldo berhasil",
    time: "12 Mei 2026, 09.24",
    desc: "Saldo utama bertambah dari simulasi virtual account.",
    icon: ReceiptText,
    tone: "emerald",
  },
  {
    title: "Ticket bantuan dibuat",
    time: "12 Mei 2026, 10.02",
    desc: "Percakapan support dibuka sebagai konteks pembatasan akses CS.",
    icon: BellRing,
    tone: "amber",
  },
  {
    title: "Akses sensitif dipantau",
    time: "Realtime saat ticket aktif",
    desc: "Setiap tindakan CS terhadap data akun akan muncul sebagai aktivitas transparansi.",
    icon: ShieldCheck,
    tone: "sky",
  },
];

const toneClass: Record<(typeof historyItems)[number]["tone"], string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  sky: "bg-sky-100 text-sky-700",
};

export default function UserHistoryPage() {
  return (
    <div>
      <Topbar title="Riwayat Akun" subtitle="Jejak aktivitas dompet dan konteks bantuan" />
      <PageHeader
        eyebrow="Activity ledger"
        title="Riwayat dibuat untuk menjelaskan konteks, bukan menjadi pusat penelitian"
        description="Pengguna melihat pengalaman dompet yang normal, sementara sistem tetap menonjolkan kapan ticket bantuan dan pemantauan akses mulai berlaku."
        meta={<Pill tone="success">Transparansi pengguna aktif</Pill>}
      />

      <DataPanel title="Timeline aktivitas" description="Alur ini membantu penguji memahami hubungan transaksi, ticket, dan audit akses.">
        <div className="relative space-y-3">
          {historyItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[auto_1fr]">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass[item.tone]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-slate-950">{item.title}</div>
                    <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {index + 1}
                    </div>
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-600">{item.time}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </DataPanel>
    </div>
  );
}
