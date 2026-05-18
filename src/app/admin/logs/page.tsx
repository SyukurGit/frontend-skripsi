"use client";

import * as React from "react";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { LevelBadge, StatusBadge } from "@/components/ui/badge";
import { useAdminSessionDetail, useAdminSessions } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";
import { auditActionHint, auditActionLabel } from "@/utils/audit";
import { format } from "date-fns";

export default function AdminLogsPage() {
  const sessions = useAdminSessions();
  const rows = sessions.data ?? [];
  const [selectedTicketId, setSelectedTicketId] = React.useState<number | null>(null);
  const effectiveTicketId = selectedTicketId ?? rows[0]?.ticket_id ?? 0;
  const detail = useAdminSessionDetail(effectiveTicketId);

  return (
    <div>
      <Topbar title="Logs Sesi Bantuan" subtitle="Buka sesi bantuan apa pun, termasuk yang sudah selesai, untuk melihat urutan tiket dibuat, diambil CS, permintaan JIT, dan seluruh aktivitas di dalamnya" />

      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Daftar sesi</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Sesi bantuan tercatat</div>
          </CardHeader>
          <CardBody className="pt-4">
            {sessions.isLoading ? <div className="text-sm text-slate-500">Memuat sesi...</div> : null}
            {sessions.isError ? <div className="text-sm text-rose-700">{getErrorMessage(sessions.error, "Gagal memuat sesi bantuan")}</div> : null}
            {!sessions.isLoading && !sessions.isError ? (
              <div className="space-y-3">
                {rows.map((session) => (
                  <button
                    key={session.ticket_id}
                    type="button"
                    onClick={() => setSelectedTicketId(session.ticket_id)}
                    className={`w-full rounded-[26px] border p-4 text-left transition-all ${effectiveTicketId === session.ticket_id ? "border-blue-200 bg-blue-50 shadow-[0_14px_32px_rgba(59,130,246,0.12)]" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Ticket #{session.ticket_id}</div>
                        <div className="mt-2 text-base font-semibold text-slate-950">{session.assigned_cs_email ?? "Belum diambil petugas"}</div>
                        <div className="mt-1 text-sm text-slate-500">User #{session.user_id} • dibuat {format(new Date(session.created_at), "PPp")}</div>
                      </div>
                      <StatusBadge status={session.ticket_status} />
                    </div>
                  </button>
                ))}
                {rows.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Belum ada sesi bantuan yang tercatat pada logs.</div> : null}
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Detail sesi</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Urutan aktivitas per tiket</div>
          </CardHeader>
          <CardBody className="pt-4">
            {effectiveTicketId === 0 ? <div className="text-sm text-slate-500">Pilih sesi untuk melihat detail.</div> : null}
            {detail.isLoading && effectiveTicketId > 0 ? <div className="text-sm text-slate-500">Memuat detail sesi...</div> : null}
            {detail.isError ? <div className="text-sm text-rose-700">{getErrorMessage(detail.error, "Gagal memuat detail sesi")}</div> : null}
            {detail.data ? (
              <div className="space-y-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tiket dibuat</div>
                    <div className="mt-2 text-base font-semibold text-slate-950">{format(new Date(detail.data.created_at), "PPp")}</div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Diambil oleh</div>
                    <div className="mt-2 text-base font-semibold text-slate-950">{detail.data.assigned_cs_email ?? "Belum ada petugas"}</div>
                    <div className="mt-1 text-sm text-slate-500">{detail.data.claimed_at ? format(new Date(detail.data.claimed_at), "PPp") : "Belum ada waktu pengambilan tiket"}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-950">Status permintaan JIT</div>
                  <div className="mt-3 space-y-3">
                    {detail.data.jit_attempts.map((attempt, index) => (
                      <div key={`${attempt.requested_at}-${index}`} className={`rounded-3xl border p-4 ${attempt.granted ? "border-emerald-200 bg-emerald-50/60" : "border-rose-200 bg-rose-50/70"}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-base font-semibold text-slate-950">{attempt.feature}</div>
                          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${attempt.granted ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{attempt.granted ? "Diberikan" : "Ditolak"}</div>
                        </div>
                        <div className="mt-2 text-sm text-slate-600">{attempt.reason}</div>
                        <div className="mt-2 text-xs text-slate-500">{format(new Date(attempt.requested_at), "PPp")}</div>
                      </div>
                    ))}
                    {detail.data.jit_attempts.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">Belum ada permintaan JIT pada sesi ini.</div> : null}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-950">Aktivitas dalam sesi</div>
                  <div className="mt-3 space-y-3">
                    {detail.data.activities.map((activity, index) => (
                      <div key={activity.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</div>
                            <div>
                              <div className="text-base font-semibold text-slate-950">{auditActionLabel(activity.action)}</div>
                              <div className="mt-1 text-sm text-slate-600">{auditActionHint(activity)}</div>
                            </div>
                          </div>
                          <LevelBadge level={activity.level} />
                        </div>
                        <div className="mt-3 text-xs text-slate-500">{format(new Date(activity.createdAt), "PPp")} • role {activity.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
