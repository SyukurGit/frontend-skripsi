"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  CheckCircle2,
  Clock3,
  FileClock,
  ShieldAlert,
  TimerReset,
  UserRound,
  XCircle,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { LevelBadge, StatusBadge } from "@/components/ui/badge";
import { useAdminSessionDetail, useAdminSessions } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";
import { auditActionHint, auditActionLabel } from "@/utils/audit";

function EmptyRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="px-5 py-10 text-center">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">{detail}</div>
    </div>
  );
}

export default function AdminLogsPage() {
  const sessions = useAdminSessions();
  const rows = sessions.data ?? [];
  const [selectedTicketId, setSelectedTicketId] = React.useState<number | null>(null);
  const effectiveTicketId = selectedTicketId ?? rows[0]?.ticket_id ?? 0;
  const detail = useAdminSessionDetail(effectiveTicketId);

  return (
    <div>
      <Topbar title="Audit per Tiket" subtitle="Korelasi sesi, keputusan kebijakan, dan aktivitas sensitif" />

      <section className="mb-5 border-b border-slate-200 pb-5 pt-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-700">
              <FileClock className="h-4 w-4" />
              Jejak audit persisten
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">Bukti akses, disusun per konteks tiket</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Admin meninjau hasil kebijakan dan kronologi aktivitas. Permintaan JIT dievaluasi backend berdasarkan
              penugasan, status tiket, fitur, dan masa berlaku akses.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className={`h-2 w-2 rounded-full ${sessions.isError ? "bg-rose-600" : sessions.isLoading ? "bg-amber-500" : "bg-emerald-600"}`} />
            {sessions.isLoading ? "Memuat sesi" : `${rows.length} sesi terindeks`}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
        <div className="grid xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200 xl:border-b-0 xl:border-r">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">Indeks sesi</div>
              <div className="mt-0.5 text-xs text-slate-500">Urutkan investigasi berdasarkan tiket.</div>
            </div>

            {sessions.isLoading ? <div className="px-4 py-5 text-sm text-slate-500">Memuat sesi audit...</div> : null}
            {sessions.isError ? (
              <div className="px-4 py-5 text-sm text-rose-700">{getErrorMessage(sessions.error, "Gagal memuat sesi bantuan")}</div>
            ) : null}
            {!sessions.isLoading && !sessions.isError ? (
              <div className="max-h-[520px] divide-y divide-slate-100 overflow-y-auto xl:max-h-[760px]">
                {rows.map((session) => {
                  const selected = effectiveTicketId === session.ticket_id;
                  return (
                    <button
                      key={session.ticket_id}
                      type="button"
                      onClick={() => setSelectedTicketId(session.ticket_id)}
                      className={`relative w-full px-4 py-3 text-left hover:bg-slate-50 ${selected ? "bg-indigo-50/70" : "bg-white"}`}
                    >
                      {selected ? <span className="absolute inset-y-0 left-0 w-1 bg-indigo-600" /> : null}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-mono text-[11px] font-semibold text-slate-500">TIKET #{session.ticket_id}</div>
                          <div className="mt-1 truncate text-sm font-semibold text-slate-950">
                            {session.assigned_cs_email ?? "Belum ditugaskan"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            Pengguna #{session.user_id}
                            {session.last_activity_at
                              ? ` / ${format(new Date(session.last_activity_at), "dd MMM, HH:mm")}`
                              : ""}
                          </div>
                        </div>
                        <StatusBadge status={session.ticket_status} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200 pt-2 text-xs text-slate-600">
                        <span>
                          <strong className="font-mono text-slate-900">{session.jit_attempts}</strong> upaya JIT
                        </span>
                        <span className="pl-3">
                          <strong className="font-mono text-slate-900">{session.sensitive_actions}</strong> sensitif
                        </span>
                      </div>
                    </button>
                  );
                })}
                {rows.length === 0 ? (
                  <EmptyRow title="Belum ada sesi audit" detail="Sesi muncul setelah tiket dibuat dan aktivitas mulai tercatat." />
                ) : null}
              </div>
            ) : null}
          </aside>

          <div className="min-w-0">
            <div className="flex min-h-[57px] items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
              <div>
                <div className="text-sm font-semibold text-slate-950">Detail sesi</div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                  {effectiveTicketId ? `TIKET #${effectiveTicketId}` : "TIDAK ADA PILIHAN"}
                </div>
              </div>
              {detail.data ? <StatusBadge status={detail.data.ticket_status} /> : null}
            </div>

            {effectiveTicketId === 0 ? (
              <EmptyRow title="Belum ada tiket terpilih" detail="Pilih sesi dari indeks untuk membuka detail audit." />
            ) : null}
            {detail.isLoading && effectiveTicketId > 0 ? (
              <div className="px-5 py-6 text-sm text-slate-500">Memuat detail sesi...</div>
            ) : null}
            {detail.isError ? (
              <div className="px-5 py-6 text-sm text-rose-700">{getErrorMessage(detail.error, "Gagal memuat detail sesi")}</div>
            ) : null}

            {detail.data ? (
              <div>
                <div className="grid divide-y divide-slate-100 border-b border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                  {[
                    {
                      label: "Pengguna",
                      value: detail.data.user_email ?? `ID ${detail.data.user_id}`,
                      icon: UserRound,
                    },
                    {
                      label: "CS ditugaskan",
                      value: detail.data.assigned_cs_email ?? "Belum ditugaskan",
                      icon: ShieldAlert,
                    },
                    {
                      label: "Tiket dibuat",
                      value: format(new Date(detail.data.created_at), "dd MMM yyyy, HH:mm"),
                      icon: Clock3,
                    },
                    {
                      label: "Diambil pada",
                      value: detail.data.claimed_at
                        ? format(new Date(detail.data.claimed_at), "dd MMM yyyy, HH:mm")
                        : "Belum diambil",
                      icon: CheckCircle2,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </div>
                        <div className="mt-2 truncate text-sm font-semibold text-slate-900" title={item.value}>
                          {item.value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <section className="border-b border-slate-200">
                  <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="flex items-center gap-2">
                      <TimerReset className="h-4 w-4 text-indigo-700" />
                      <h2 className="text-sm font-semibold text-slate-950">Evaluasi JIT</h2>
                      <span className="font-mono text-[11px] text-slate-500">{detail.data.jit_attempts.length} EVENT</span>
                    </div>
                    <span className="text-xs text-slate-500">Hasil kebijakan backend, bukan persetujuan manual Administrator.</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {detail.data.jit_attempts.map((attempt, index) => (
                      <div
                        key={`${attempt.requested_at}-${index}`}
                        className="grid gap-3 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-center sm:px-5"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{attempt.feature}</div>
                          <div className="mt-1 font-mono text-[10px] text-slate-500">
                            {format(new Date(attempt.requested_at), "dd MMM HH:mm:ss")}
                          </div>
                        </div>
                        <p className="text-xs leading-5 text-slate-600">{attempt.reason}</p>
                        <span
                          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            attempt.granted
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-rose-200 bg-rose-50 text-rose-800"
                          }`}
                        >
                          {attempt.granted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {attempt.granted ? "Diberikan backend" : "Ditolak kebijakan"}
                        </span>
                      </div>
                    ))}
                    {detail.data.jit_attempts.length === 0 ? (
                      <EmptyRow
                        title="Belum ada evaluasi JIT"
                        detail="Tiket yang baru diambil (CLAIMED) belum otomatis memenuhi syarat JIT. Evaluasi terjadi setelah alur mencapai konteks yang valid."
                      />
                    ) : null}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
                    <Clock3 className="h-4 w-4 text-indigo-700" />
                    <h2 className="text-sm font-semibold text-slate-950">Linimasa aktivitas</h2>
                    <span className="font-mono text-[11px] text-slate-500">{detail.data.activities.length} EVENT</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {detail.data.activities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="grid gap-3 px-4 py-3 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-start sm:px-5"
                      >
                        <div>
                          <div className="font-mono text-[11px] font-semibold text-slate-700">
                            {format(new Date(activity.createdAt), "HH:mm:ss")}
                          </div>
                          <div className="mt-1 font-mono text-[10px] text-slate-500">EVENT {index + 1}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-950">{auditActionLabel(activity.action)}</span>
                            <span className="font-mono text-[10px] uppercase text-slate-500">
                              {activity.role} / USER {activity.userId}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-slate-600">{auditActionHint(activity)}</p>
                        </div>
                        <LevelBadge level={activity.level} />
                      </div>
                    ))}
                    {detail.data.activities.length === 0 ? (
                      <EmptyRow title="Belum ada aktivitas" detail="Event muncul setelah pengguna atau CS berinteraksi dengan tiket." />
                    ) : null}
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
