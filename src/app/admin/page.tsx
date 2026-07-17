"use client";

import Link from "next/link";
import { Activity, FileClock, Radio, TerminalSquare, UsersRound } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { DataPanel, PageHeader, Pill } from "@/components/ui/page";
import { StatCard } from "@/components/ui/stat-card";
import { useAdminDashboard } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";

export default function AdminHome() {
  const q = useAdminDashboard();
  const stats = q.data;

  return (
    <div>
      <Topbar title="Admin Lab" subtitle="Observability untuk RBAC, LP, JIT, dan audit trail" />
      <PageHeader
        eyebrow="Security control room"
        title="Pantau seluruh bukti pengujian akses"
        description="Admin tidak hanya melihat angka. Panel ini mengarahkan penguji ke sesi ticket, audit realtime, terminal trace, dan manajemen akun yang relevan dengan skripsi."
        actions={
          <>
            <Link href="/admin/logs">
              <Button>
                <FileClock className="h-4 w-4" />
                Sesi audit
              </Button>
            </Link>
            <Link href="/admin/stream">
              <Button variant="secondary">
                <Radio className="h-4 w-4" />
                Realtime
              </Button>
            </Link>
          </>
        }
        meta={q.isError ? <Pill tone="danger">{getErrorMessage(q.error, "Gagal memuat statistik")}</Pill> : <Pill tone="success">Audit pipeline aktif</Pill>}
      />

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Pengguna" value={stats?.total_users ?? 0} hint="Akun user akhir" tone="neutral" />
        <StatCard label="Customer Service" value={stats?.total_cs ?? 0} hint="Akun operator CS" tone="info" />
        <StatCard label="Admin" value={stats?.total_admins ?? 0} hint="Akun pengawas" tone="neutral" />
        <StatCard label="IN_PROGRESS" value={stats?.tickets_in_process ?? 0} hint="Ticket siap uji JIT" tone="success" />
        <StatCard label="OPEN" value={stats?.tickets_unassigned ?? 0} hint="Belum di-claim CS" tone="warning" />
        <StatCard label="RESOLVED" value={stats?.tickets_resolved ?? 0} hint="Menunggu penutupan" tone="info" />
        <StatCard label="CLOSED" value={stats?.tickets_closed ?? 0} hint="Sesi selesai" tone="neutral" />
        <StatCard label="Aksi sensitif" value={stats?.sensitive_actions ?? 0} hint="Perlu audit ketat" tone="danger" />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <DataPanel title="Jalur observability" description="Gunakan urutan ini saat presentasi pengujian backend.">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: FileClock, title: "Sesi & audit", href: "/admin/logs", desc: "Lifecycle ticket dan JIT attempt." },
              { icon: TerminalSquare, title: "Terminal trace", href: "/admin/terminal", desc: "Log teknis per ticket." },
              { icon: Radio, title: "Realtime stream", href: "/admin/stream", desc: "Event audit masuk langsung." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-700" />
                  <div className="mt-3 font-semibold text-slate-950">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</div>
                </Link>
              );
            })}
          </div>
        </DataPanel>

        <DataPanel title="Status sistem" description="Ringkasan kesiapan demo.">
          {q.isLoading ? <div className="text-sm text-slate-500">Memuat statistik...</div> : null}
          {!q.isLoading && !q.isError ? (
            <div className="space-y-3">
              {[
                { icon: Activity, text: "Query dashboard backend berhasil." },
                { icon: UsersRound, text: "Akun user dan CS dapat dikelola dari admin." },
                { icon: FileClock, text: "Audit trail menjadi sumber pembuktian skenario." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                    <div className="text-sm leading-6 text-slate-600">{item.text}</div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </DataPanel>
      </section>
    </div>
  );
}
