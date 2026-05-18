"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dompetku-cs-briefing-seen";

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-7">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Briefing demonstrasi</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Least Privilege sudah aktif sejak sesi Customer Service dimulai.</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Halaman ini tidak hanya menerapkan RBAC dasar. RBAC memang memverifikasi bahwa Anda berperan sebagai Customer Service, tetapi mekanisme utama pada penelitian ini melangkah lebih jauh melalui pembatasan lingkup akses (Least Privilege) dan pembatasan durasi akses (Just-In-Time Access).
        </p>

        <div className="mt-5 grid gap-3">
          {[
            "Anda tidak dapat membuka tiket yang tidak ditugaskan kepada akun Customer Service ini.",
            "Data pengguna yang terlihat pada halaman kerja hanya berasal dari tiket aktif yang sedang Anda tangani, sehingga ruang akses menjadi sempit dan kontekstual.",
            "Fitur sensitif tidak aktif secara default dan baru dapat dibuka sementara setelah backend menyetujui permintaan Just-In-Time.",
          ].map((item, index) => (
            <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</div>
              <div className="text-sm leading-6 text-slate-600">{item}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          Saat presentasi, tekankan bahwa keputusan akses tidak berhenti pada verifikasi role, tetapi juga mempertimbangkan konteks tiket, status pekerjaan, serta durasi akses yang dibatasi secara otomatis.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={close}>Tutup</Button>
          <Button onClick={close}>Saya pahami</Button>
        </div>
      </div>
    </div>
  );
}
