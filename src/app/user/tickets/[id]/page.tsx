"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  LockKeyhole,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { StatusBadge, ticketStatusLabel } from "@/components/ui/badge";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Card, CardBody } from "@/components/ui/card";
import { DataPanel, EmptyState } from "@/components/ui/page";
import { useMessages, useUserTicketActivity, useUserTickets } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";
import { auditActionHint, auditActionLabel, isSensitiveAuditAction } from "@/utils/audit";

function formatActivityDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function UserTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = Number(params.id);
  const valid = Number.isFinite(rawId) && rawId > 0;
  const ticketId = valid ? rawId : 0;

  const ticketsQuery = useUserTickets();
  const ticket = useMemo(
    () => (ticketsQuery.data ?? []).find((item) => item.id === ticketId) ?? null,
    [ticketsQuery.data, ticketId],
  );
  const accessibleTicketId = valid && ticket ? ticketId : 0;
  const messagesQuery = useMessages(accessibleTicketId, "user");
  const activityQuery = useUserTicketActivity(accessibleTicketId);
  const sensitiveActivity = (activityQuery.data ?? []).filter((item) =>
    isSensitiveAuditAction(item.action),
  );

  return (
    <div>
      <Topbar
        title={valid ? `Tiket #${ticketId}` : "Tiket"}
        subtitle={valid ? "Percakapan dan transparansi akses" : "ID tiket tidak valid"}
        status={
          ticket
            ? {
                label: ticketStatusLabel[ticket.status],
                tone: ticket.status === "RESOLVED" ? "live" : "muted",
              }
            : undefined
        }
      />

      <section className="mb-5 py-2">
        <Link
          href="/user/tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar tiket
        </Link>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase text-indigo-700">Ruang bantuan</div>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
              {valid ? `Percakapan tiket #${ticketId}` : "Tiket tidak valid"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Percakapan tetap sederhana untuk pengguna. Aktivitas sensitif CS yang terkait tiket
              ini ditampilkan terpisah sebagai transparansi.
            </p>
          </div>
          {ticket ? <StatusBadge status={ticket.status} /> : null}
        </div>
      </section>

      {!valid ? (
        <EmptyState
          title="ID tiket tidak valid"
          description="Periksa kembali tautan tiket atau kembali ke daftar bantuan."
          action={
            <Link
              href="/user/tickets"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Kembali ke daftar tiket
            </Link>
          }
        />
      ) : ticketsQuery.isLoading ? (
        <Card>
          <CardBody className="pt-6">
            <div className="animate-pulse">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-72 max-w-full rounded bg-slate-100" />
              <div className="mt-6 h-64 rounded-lg bg-slate-100" />
            </div>
          </CardBody>
        </Card>
      ) : ticketsQuery.isError ? (
        <DataPanel
          title="Tiket belum dapat dimuat"
          description={getErrorMessage(ticketsQuery.error, "Gagal memuat metadata tiket")}
        >
          <Link
            href="/user/tickets"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Kembali ke daftar tiket
          </Link>
        </DataPanel>
      ) : !ticket ? (
        <EmptyState
          title="Tiket tidak dapat diakses"
          description="Tiket ini bukan milik akun Anda atau sudah tidak tersedia."
          action={
            <Link
              href="/user/tickets"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Kembali ke daftar tiket
            </Link>
          }
        />
      ) : (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
              <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
                <div>
                  <h2 className="font-semibold text-slate-950">Transparansi akses</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Aktivitas sensitif yang direkam backend untuk tiket ini akan muncul di sini.
                  </p>
                </div>
              </div>

              {activityQuery.isLoading ? (
                <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:px-6">
                  Memeriksa aktivitas akses...
                </div>
              ) : activityQuery.isError ? (
                <div className="border-t border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-800 sm:px-6">
                  {getErrorMessage(activityQuery.error, "Aktivitas akses belum dapat dimuat")}
                </div>
              ) : sensitiveActivity.length > 0 ? (
                <div className="divide-y divide-amber-100 border-t border-amber-100 bg-amber-50">
                  {sensitiveActivity.slice(0, 4).map((item) => (
                    <article key={item.id} className="flex gap-3 px-5 py-4 sm:px-6">
                      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-950">
                          {auditActionLabel(item.action)}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {auditActionHint(item)}
                        </p>
                        <div className="mt-2 text-xs font-medium text-amber-800">
                          {formatActivityDate(item.createdAt)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:px-6">
                  Belum ada aktivitas sensitif yang tercatat pada tiket ini.
                </div>
              )}
            </section>

            {messagesQuery.isError ? (
              <DataPanel
                title="Percakapan tidak tersedia"
                description={getErrorMessage(messagesQuery.error, "Gagal memuat pesan")}
              >
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MessageCircle className="h-5 w-5 text-slate-400" />
                  Muat ulang halaman atau kembali ke daftar tiket.
                </div>
              </DataPanel>
            ) : (
              <>
                <ChatPanel
                  ticketId={ticketId}
                  initial={messagesQuery.data ?? []}
                  role="user"
                />
                {messagesQuery.isLoading ? (
                  <div className="text-xs text-slate-500">Memuat percakapan...</div>
                ) : null}
              </>
            )}
          </div>

          <aside className="space-y-6">
            <DataPanel title="Ringkasan tiket" description="Status yang terlihat oleh pengguna.">
              <dl className="divide-y divide-slate-100">
                <div className="flex items-center justify-between gap-3 py-3 first:pt-0">
                  <dt className="text-sm text-slate-500">ID tiket</dt>
                  <dd className="text-sm font-semibold text-slate-950">#{ticketId}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <dt className="text-sm text-slate-500">Status</dt>
                  <dd className="text-right text-sm font-semibold text-slate-950">
                    {ticketStatusLabel[ticket.status]}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-3 last:pb-0">
                  <dt className="text-sm text-slate-500">Petugas</dt>
                  <dd className="text-right text-sm font-semibold text-slate-950">
                    {ticket.assignedCsId ? `CS #${ticket.assignedCsId}` : "Belum ditugaskan"}
                  </dd>
                </div>
              </dl>
            </DataPanel>

            <section className="border-l-2 border-indigo-200 pl-4">
              <div className="text-xs font-semibold uppercase text-slate-500">
                Proteksi selama tiket aktif
              </div>
              <div className="mt-4 space-y-4">
                {[
                  {
                    icon: UserRoundCheck,
                    text: "CS harus ditugaskan pada tiket ini.",
                  },
                  {
                    icon: LockKeyhole,
                    text: "Data sensitif terkunci secara default.",
                  },
                  {
                    icon: Eye,
                    text: "Aksi sensitif ditampilkan kepada pengguna.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.text} className="flex gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700" />
                      <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </section>
      )}
    </div>
  );
}
