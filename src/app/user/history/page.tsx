"use client";

import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const historyItems = [
  "Top up berhasil ditambahkan ke saldo utama.",
  "Transfer selesai tanpa perlu konfirmasi tambahan.",
  "Cashback merchant masuk otomatis ke akun Anda.",
];

export default function UserHistoryPage() {
  return (
    <div>
      <Topbar title="Riwayat" subtitle="Lihat jejak aktivitas akun dan transaksi terbaru" />
      <Card>
        <CardHeader>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Jejak aktivitas</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Riwayat akun DompetKu</div>
        </CardHeader>
        <CardBody className="pt-4">
          <div className="space-y-3">
            {historyItems.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white">0{index + 1}</div>
                <div className="text-sm leading-7 text-slate-600">{item}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
