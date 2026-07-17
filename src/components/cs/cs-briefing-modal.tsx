"use client";

import * as React from "react";
import { ClipboardList, LockKeyhole, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dompetku-cs-briefing-seen";

const points = [
  { icon: ClipboardList, title: "Ambil ticket", desc: "Assignment membentuk ruang kerja yang boleh diakses CS." },
  { icon: LockKeyhole, title: "Data dibatasi", desc: "Profil sensitif tetap terkunci sebelum syarat JIT terpenuhi." },
  { icon: TimerReset, title: "Akses sementara", desc: "Fitur sensitif aktif hanya selama sesi JIT masih berlaku." },
];

export function CSBriefingModal() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const seen = window.sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = window.setTimeout(() => setOpen(true), 280);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function close() {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_30px_80px_rgba(16,24,32,0.22)]">
        <div className="bg-slate-950 px-6 py-5 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Briefing workspace CS</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Uji akses dimulai dari ticket, bukan dari data pengguna.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Interface ini disusun untuk memperlihatkan RBAC, Least Privilege, dan Just-In-Time Access secara berurutan saat demonstrasi.
          </p>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          {points.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <Icon className="h-5 w-5 text-emerald-700" />
                <div className="mt-3 font-semibold text-slate-950">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={close}>
            Tutup
          </Button>
          <Button onClick={close}>Mulai uji</Button>
        </div>
      </div>
    </div>
  );
}
