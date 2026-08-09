"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  FileClock,
  Radio,
  ShieldCheck,
  TerminalSquare,
  UsersRound,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { useAdminDashboard } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";

const observationRoutes = [
  {
    href: "/admin/logs",
    icon: FileClock,
    label: "Audit per tiket",
    detail: "Korelasi status, upaya JIT, dan aktivitas sensitif dalam satu sesi.",
    signal: "HISTORIS",
  },
  {
    href: "/admin/stream",
    icon: Radio,
    label: "Stream audit",
    detail: "Peristiwa HIGH dan MEDIUM yang masuk melalui koneksi langsung.",
    signal: "REALTIME",
  },
  {
    href: "/admin/terminal",
    icon: TerminalSquare,
    label: "Terminal teknis",
    detail: "Trace backend sementara untuk tiket yang masih dalam penanganan.",
    signal: "SEMENTARA",
  },
] as const;

export default function AdminHome() {
  const q = useAdminDashboard();
  const stats = q.data;

  const accountMetrics = [
    { label: "Pengguna", value: stats?.total_users ?? 0, detail: "akun akhir" },
    { label: "Customer Support", value: stats?.total_cs ?? 0, detail: "akun operasional" },
    { label: "Administrator", value: stats?.total_admins ?? 0, detail: "akun pengawasan" },
  ];

  const ticketMetrics = [
    {
      label: "Menunggu CS",
      code: "OPEN",
      value: stats?.tickets_unassigned ?? 0,
      detail: "Belum ditugaskan",
      tone: "bg-slate-400",
    },
    {
      label: "Dalam penanganan",
      code: "CLAIMED + IN_PROGRESS",
      value: stats?.tickets_in_process ?? 0,
      detail: "Diambil atau sedang dikerjakan",
      tone: "bg-indigo-600",
    },
    {
      label: "Siap ditutup",
      code: "RESOLVED",
      value: stats?.tickets_resolved ?? 0,
      detail: "Menunggu penutupan pengguna",
      tone: "bg-emerald-600",
    },
    {
      label: "Ditutup",
      code: "CLOSED",
      value: stats?.tickets_closed ?? 0,
      detail: "Siklus tiket selesai",
      tone: "bg-slate-700",
    },
  ];

  return (
    <div>
      <Topbar title="Observabilitas Admin" subtitle="Pantau jejak akses dan kesehatan alur operasional" />

      <section className="mb-5 border-b border-slate-200 pb-5 pt-1">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-700">
              <Activity className="h-4 w-4" />
              Ruang pengawasan
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">Sinyal akses dalam satu pandangan</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Admin mengamati jejak kebijakan dan aktivitas sistem. Akses JIT diputuskan oleh validasi backend, bukan
              melalui persetujuan Admin.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/logs"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(41,55,184,0.16)] hover:bg-[var(--brand-hover)]"
            >
              <FileClock className="h-4 w-4" />
              Buka audit
            </Link>
            <Link
              href="/admin/stream"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50"
            >
              <Radio className="h-4 w-4" />
              Pantau stream
            </Link>
          </div>
        </div>
      </section>

      {q.isError ? (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span className="h-2 w-2 shrink-0 rounded-full bg-rose-600" />
          {getErrorMessage(q.error, "Gagal memuat telemetry Admin")}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
        <div className="grid divide-y divide-slate-200 lg:grid-cols-[1.15fr_0.85fr] lg:divide-x lg:divide-y-0">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">Alur tiket</h2>
                <p className="mt-0.5 text-xs text-slate-500">Snapshot status operasional dari backend.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className={`h-2 w-2 rounded-full ${q.isLoading ? "bg-amber-500" : "bg-emerald-600"}`} />
                {q.isLoading ? "Memuat" : "Tersinkron"}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {ticketMetrics.map((metric) => (
                <div key={metric.code} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${metric.tone}`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-slate-900">{metric.label}</span>
                        <span className="font-mono text-[10px] text-slate-500">{metric.code}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{metric.detail}</div>
                    </div>
                  </div>
                  <div className="font-mono text-2xl font-semibold text-slate-950">{q.isLoading ? "-" : metric.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
              <h2 className="text-sm font-semibold text-slate-950">Sinyal kebijakan</h2>
              <p className="mt-0.5 text-xs text-slate-500">Hitungan event audit, bukan kotak masuk persetujuan.</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
              <div className="px-4 py-4 sm:px-5">
                <div className="text-xs font-semibold uppercase text-slate-500">Permintaan JIT tercatat</div>
                <div className="mt-2 font-mono text-2xl font-semibold text-indigo-700">
                  {q.isLoading ? "-" : (stats?.pending_jit_requests ?? 0)}
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">Event permintaan yang diperiksa backend.</p>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <div className="text-xs font-semibold uppercase text-slate-500">Aksi sensitif</div>
                <div className="mt-2 font-mono text-2xl font-semibold text-rose-700">
                  {q.isLoading ? "-" : (stats?.sensitive_actions ?? 0)}
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">Aksi yang memerlukan korelasi audit.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <div className="text-sm font-semibold text-slate-900">Pemisahan tugas tetap berlaku</div>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Admin membaca bukti. CS mengajukan kebutuhan akses, lalu backend mengevaluasi konteks tiket dan
                  kebijakan JIT.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid border-t border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-slate-200">
          {accountMetrics.map((metric, index) => (
            <div key={metric.label} className={`${index > 0 ? "border-t border-slate-200 sm:border-t-0" : ""} px-4 py-3 sm:px-5`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">{metric.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{metric.detail}</div>
                </div>
                <div className="font-mono text-xl font-semibold text-slate-950">{q.isLoading ? "-" : metric.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-950">Indeks observability</h2>
            <p className="mt-0.5 text-xs text-slate-500">Pilih sumber sesuai kedalaman investigasi.</p>
          </div>
          <UsersRound className="h-5 w-5 text-slate-400" />
        </div>
        <div className="divide-y divide-slate-100">
          {observationRoutes.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="grid gap-3 px-4 py-4 hover:bg-slate-50 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center sm:px-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-indigo-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                </div>
                <p className="text-xs leading-5 text-slate-500">{item.detail}</p>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="font-mono text-[10px] font-semibold text-slate-500">{item.signal}</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
