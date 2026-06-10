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
      <Topbar title="Admin Dashboard" subtitle="Ringkasan sistem dan aktivitas pengguna" />

      {/* Overview Card */}
      <section className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white sm:p-8">
        <div className="text-sm font-semibold text-blue-100">Kontrol Sistem</div>
        <div className="mt-3 text-2xl font-bold">Pantau dan kelola sistem</div>
        <p className="mt-3 text-sm text-blue-100">
          Lihat ikhtisar menyeluruh dari pengguna, tiket, dan aktivitas audit.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/logs">
            <Button className="bg-white text-blue-600 hover:bg-slate-100">Lihat Logs</Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="secondary" className="border-white/30 bg-white/10 hover:bg-white/20">Kelola Pengguna</Button>
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total pengguna" value={stats?.total_users ?? 0} hint="Akun pengguna terdaftar" />
        <StatCard label="Total CS" value={stats?.total_cs ?? 0} hint="Petugas support aktif" />
        <StatCard label="Total admin" value={stats?.total_admins ?? 0} hint="Administrator aktif" />
        <StatCard label="Tiket aktif" value={stats?.tickets_in_process ?? 0} hint="Tiket dalam penanganan" />
        <StatCard label="Tiket terbuka" value={stats?.tickets_unassigned ?? 0} hint="Menunggu diambil" />
        <StatCard label="Tiket resolved" value={stats?.tickets_resolved ?? 0} hint="Siap ditutup" />
        <StatCard label="Tiket tertutup" value={stats?.tickets_closed ?? 0} hint="Sudah ditutup" />
        <StatCard label="Aksi sensitif" value={stats?.sensitive_actions ?? 0} hint="Aktivitas mencurigakan" />
      </section>

      {/* Quick Access */}
      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">Tools</div>
            <div className="mt-2 text-xl font-bold text-slate-950">Akses cepat</div>
          </CardHeader>
          <CardBody className="space-y-2 pt-4">
            <Link href="/admin/logs" className="block">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-950">
                Audit Logs →
              </Button>
            </Link>
            <Link href="/admin/terminal" className="block">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-950">
                Terminal →
              </Button>
            </Link>
            <Link href="/admin/stream" className="block">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-950">
                Real-time Stream →
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">Info</div>
            <div className="mt-2 text-xl font-bold text-slate-950">Status sistem</div>
          </CardHeader>
          <CardBody className="pt-4">
            {q.isLoading ? (
              <div className="text-sm text-slate-500">Memuat statistik...</div>
            ) : q.isError ? (
              <div className="text-sm text-red-600">{getErrorMessage(q.error, "Gagal memuat statistik")}</div>
            ) : (
              <div className="space-y-2 text-sm text-slate-600">
                <div>✓ Sistem berjalan normal</div>
                <div>✓ Semua layanan aktif</div>
                <div>✓ Audit trail aktif</div>
              </div>
            )}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
