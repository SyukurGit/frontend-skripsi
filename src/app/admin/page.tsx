"use client";

import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { useAdminDashboard } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";

export default function AdminHome() {
  const q = useAdminDashboard();
  const stats = q.data;

  return (
    <div>
      <Topbar title="Admin Dashboard" subtitle="Ringkasan angka utama untuk pengguna, petugas, dan sesi bantuan yang sedang berjalan" />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,#0f172a,#1d4ed8_58%,#335cff)] text-white shadow-[0_24px_70px_rgba(37,99,235,0.18)]">
          <CardBody className="p-7 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/80">Admin summary</div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Panel ini memusatkan seluruh angka penting sebelum admin masuk ke detail sesi bantuan.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50/90 sm:text-base">
              Gunakan halaman ini untuk membuka demo dari sudut pandang admin: berapa jumlah akun, berapa tiket yang masih bergerak, dan berapa banyak aktivitas sensitif yang sudah tercatat.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/admin/logs"><Button className="h-12 bg-white text-slate-950 shadow-none hover:bg-slate-100">Buka halaman logs</Button></Link>
              <Link href="/admin/users"><Button variant="secondary" className="h-12 border-white/20 bg-white/10 text-white hover:bg-white/16 hover:text-white">Kelola pengguna</Button></Link>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Status sistem</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Ikhtisar cepat</div>
          </CardHeader>
          <CardBody className="pt-4">
            {q.isLoading ? <div className="text-sm text-slate-500">Memuat statistik...</div> : null}
            {q.isError ? <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Gagal memuat statistik admin")}</div> : null}
            {stats ? (
              <div className="space-y-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Dashboard ini sengaja dibuat ringkas. Semua pembuktian alur LP dan JIT ada pada halaman logs per sesi.</div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total user" value={stats?.total_users ?? 0} hint="Jumlah akun pengguna akhir yang terdaftar." />
        <StatCard label="Total CS" value={stats?.total_cs ?? 0} hint="Jumlah akun customer service yang aktif di sistem." />
        <StatCard label="Total admin" value={stats?.total_admins ?? 0} hint="Jumlah akun administrator yang dapat membuka panel kontrol." />
        <StatCard label="Tiket diproses" value={stats?.tickets_in_process ?? 0} hint="Tiket yang sedang berada pada status CLAIMED atau IN_PROGRESS." />
        <StatCard label="Belum diambil" value={stats?.tickets_unassigned ?? 0} hint="Tiket terbuka yang belum diambil oleh customer service." />
        <StatCard label="Menunggu ditutup" value={stats?.tickets_resolved ?? 0} hint="Tiket yang sudah selesai ditangani dan menunggu penutupan." />
        <StatCard label="Tiket selesai" value={stats?.tickets_closed ?? 0} hint="Jumlah tiket yang telah ditutup sepenuhnya." />
        <StatCard label="Aksi sensitif" value={stats?.sensitive_actions ?? 0} hint="Jumlah eksekusi tindakan sensitif yang tercatat pada audit." />
        <StatCard label="Permintaan JIT" value={stats?.pending_jit_requests ?? 0} hint="Jumlah permintaan JIT yang tercatat pada audit, baik yang diterima maupun ditolak." />
      </section>
    </div>
  );
}
