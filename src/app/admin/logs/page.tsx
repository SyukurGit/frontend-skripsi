"use client";

import * as React from "react";
import { format } from "date-fns";
import { CheckCircle2, Clock3, ShieldAlert, TimerReset } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { LevelBadge, StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState, KeyValue, PageHeader, Pill } from "@/components/ui/page";
import { useAdminSessionDetail, useAdminSessions } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";
import { auditActionHint, auditActionLabel } from "@/utils/audit";

export default function AdminLogsPage() {
  const sessions = useAdminSessions();
  const rows = sessions.data ?? [];
  const [selectedTicketId, setSelectedTicketId] = React.useState<number | null>(null);
  const effectiveTicketId = selectedTicketId ?? rows[0]?.ticket_id ?? 0;
  const detail = useAdminSessionDetail(effectiveTicketId);

  return (
    <div>
      <Topbar title="Sesi & Audit" subtitle="Lifecycle ticket, assignment, JIT, dan aktivitas sensitif" />
      <PageHeader
        eyebrow="Audit evidence"
        title="Jejak akses per ticket"
        description="Halaman ini menjadi pembuktian administratif bahwa akses tidak hanya dinilai dari role, tetapi juga ticket, status, fitur, dan waktu."
        meta={<Pill tone="info">{rows.length} sesi tercatat</Pill>}
      />

      <section className="grid gap-5 xl:grid-cols-[0.42fr_1fr]">
        <DataPanel title="Daftar sesi" description="Pilih ticket untuk melihat bukti audit lengkap.">
          {sessions.isLoading ? <div className="text-sm text-slate-500">Memuat sesi...</div> : null}
          {sessions.isError ? <div className="text-sm text-rose-700">{getErrorMessage(sessions.error, "Gagal memuat sesi bantuan")}</div> : null}
          {!sessions.isLoading && !sessions.isError ? (
            <div className="space-y-3">
              {rows.map((session) => (
                <button
                  key={session.ticket_id}
                  type="button"
                  onClick={() => setSelectedTicketId(session.ticket_id)}
                  className={`w-full rounded-lg border p-4 text-left transition ${effectiveTicketId === session.ticket_id ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase text-slate-500">Ticket #{session.ticket_id}</div>
                      <div className="mt-2 font-semibold text-slate-950">{session.assigned_cs_email ?? "Belum diambil CS"}</div>
                      <div className="mt-1 text-sm text-slate-500">User #{session.user_id}</div>
                    </div>
                    <StatusBadge status={session.ticket_status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md bg-white px-2 py-1 text-slate-600">Sensitive: {session.sensitive_actions}</div>
                    <div className="rounded-md bg-white px-2 py-1 text-slate-600">JIT: {session.jit_attempts}</div>
                  </div>
                </button>
              ))}
              {rows.length === 0 ? <EmptyState title="Belum ada sesi" description="Buat ticket dari user lalu claim dari CS untuk menghasilkan audit." /> : null}
            </div>
          ) : null}
        </DataPanel>

        <DataPanel title="Detail sesi" description={effectiveTicketId ? `Ticket #${effectiveTicketId}` : "Pilih sesi dari panel kiri."}>
          {effectiveTicketId === 0 ? <EmptyState title="Belum ada ticket terpilih" description="Pilih sesi untuk membuka detail." /> : null}
          {detail.isLoading && effectiveTicketId > 0 ? <div className="text-sm text-slate-500">Memuat detail sesi...</div> : null}
          {detail.isError ? <div className="text-sm text-rose-700">{getErrorMessage(detail.error, "Gagal memuat detail sesi")}</div> : null}
          {detail.data ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                <KeyValue label="Dibuat" value={format(new Date(detail.data.created_at), "PPp")} />
                <KeyValue label="CS" value={detail.data.assigned_cs_email ?? "Belum ada"} />
                <KeyValue label="Status" value={<StatusBadge status={detail.data.ticket_status} />} />
              </div>

              <section>
                <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                  <TimerReset className="h-5 w-5 text-emerald-700" />
                  Permintaan JIT
                </div>
                <div className="space-y-3">
                  {detail.data.jit_attempts.map((attempt, index) => (
                    <div key={`${attempt.requested_at}-${index}`} className={`rounded-lg border p-4 ${attempt.granted ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-950">{attempt.feature}</div>
                          <div className="mt-1 text-sm leading-6 text-slate-600">{attempt.reason}</div>
                        </div>
                        <Pill tone={attempt.granted ? "success" : "danger"}>{attempt.granted ? "Granted" : "Denied"}</Pill>
                      </div>
                      <div className="mt-2 text-xs font-semibold uppercase text-slate-500">{format(new Date(attempt.requested_at), "PPp")}</div>
                    </div>
                  ))}
                  {detail.data.jit_attempts.length === 0 ? <EmptyState title="Belum ada JIT attempt" description="Ubah ticket ke IN_PROGRESS lalu ajukan JIT dari workspace CS." /> : null}
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                  <Clock3 className="h-5 w-5 text-emerald-700" />
                  Timeline aktivitas
                </div>
                <div className="space-y-3">
                  {detail.data.activities.map((activity, index) => (
                    <div key={activity.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-semibold text-slate-600">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="font-semibold text-slate-950">{auditActionLabel(activity.action)}</div>
                              {activity.level === "HIGH" ? <ShieldAlert className="h-4 w-4 text-rose-700" /> : <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-slate-600">{auditActionHint(activity)}</div>
                          </div>
                        </div>
                        <LevelBadge level={activity.level} />
                      </div>
                      <div className="mt-3 text-xs text-slate-500">{format(new Date(activity.createdAt), "PPp")} - role {activity.role}</div>
                    </div>
                  ))}
                  {detail.data.activities.length === 0 ? <EmptyState title="Belum ada aktivitas" description="Aktivitas akan muncul setelah user atau CS berinteraksi dengan ticket." /> : null}
                </div>
              </section>
            </div>
          ) : null}
        </DataPanel>
      </section>
    </div>
  );
}
