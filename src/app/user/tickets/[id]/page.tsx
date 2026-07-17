"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, LockKeyhole, ShieldAlert, UserRoundCheck } from "lucide-react";
import { format } from "date-fns";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ChatPanel } from "@/components/chat/chat-panel";
import { DataPanel, EmptyState, KeyValue, PageHeader, Pill } from "@/components/ui/page";
import { useMessages, useUserTicketActivity, useUserTickets } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";
import { auditActionHint, auditActionLabel, isSensitiveAuditAction } from "@/utils/audit";

export default function UserTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = Number(params.id);
  const valid = Number.isFinite(rawId) && rawId > 0;
  const ticketId = valid ? rawId : 0;

  const tickets = useUserTickets();
  const ticket = useMemo(() => (tickets.data ?? []).find((t) => t.id === ticketId) ?? null, [tickets.data, ticketId]);
  const canAccessTicket = valid && !!ticket;
  const resolvedTicketId = canAccessTicket ? ticketId : 0;
  const msgs = useMessages(resolvedTicketId, "user");
  const activity = useUserTicketActivity(resolvedTicketId);
  const unauthorizedTicket = valid && !tickets.isLoading && !tickets.isError && !ticket;
  const sensitiveActivity = (activity.data ?? []).filter((item) => isSensitiveAuditAction(item.action));

  return (
    <div>
      <Topbar title={valid ? `Ticket #${ticketId}` : "Ticket"} subtitle={valid ? "Chat dan transparansi akses" : "ID ticket tidak valid"} />
      <PageHeader
        eyebrow="Ticket detail"
        title={valid ? `Ruang bantuan #${ticketId}` : "Ticket tidak valid"}
        description="Halaman ini menunjukkan pengalaman pengguna akhir: chat tetap sederhana, sedangkan aktivitas sensitif CS ditampilkan sebagai transparansi."
        actions={
          <Link href="/user/tickets">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        }
        meta={ticket ? <StatusBadge status={ticket.status} /> : <Pill tone="warning">Memeriksa akses</Pill>}
      />

      <section className="grid gap-5 xl:grid-cols-[0.42fr_1fr]">
        <div className="space-y-5">
          <DataPanel title="Ringkasan ticket" description="Data yang aman dilihat oleh pengguna.">
            <div className="space-y-3">
              <KeyValue label="Ticket ID" value={valid ? `#${ticketId}` : "-"} />
              <KeyValue label="Petugas" value={ticket?.assignedCsId ? `CS #${ticket.assignedCsId}` : "Belum ditugaskan"} />
              <KeyValue label="Status" value={ticket?.status ?? "-"} />
            </div>
          </DataPanel>

          <DataPanel title="Boundary akses" description="Aturan yang berlaku saat ticket diproses.">
            <div className="space-y-3">
              {[
                { icon: UserRoundCheck, text: "CS harus ditugaskan pada ticket ini sebelum dapat bekerja." },
                { icon: LockKeyhole, text: "Data sensitif tidak tersedia secara default." },
                { icon: Eye, text: "Aktivitas sensitif yang terjadi akan ditampilkan kepada pengguna." },
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
          </DataPanel>
        </div>

        <div className="space-y-5">
          {canAccessTicket ? (
            <>
              {tickets.isError ? <div className="text-sm text-rose-700">{getErrorMessage(tickets.error, "Failed to load ticket metadata")}</div> : null}
              {!activity.isLoading && !activity.isError && sensitiveActivity.length > 0 ? (
                <DataPanel title="Pemberitahuan akses sensitif" description="Aktivitas ini berasal dari audit backend untuk ticket yang sedang dibuka.">
                  <div className="space-y-3">
                    {sensitiveActivity.slice(0, 4).map((item) => (
                      <div key={item.id} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                          <div>
                            <div className="font-semibold text-slate-950">{auditActionLabel(item.action)}</div>
                            <div className="mt-1 text-sm leading-6 text-slate-600">{auditActionHint(item)}</div>
                            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
                              {format(new Date(item.createdAt), "PPp")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DataPanel>
              ) : null}

              {msgs.isError ? (
                <DataPanel title="Pesan tidak tersedia" description={getErrorMessage(msgs.error, "Failed to load messages")}>
                  <Link href="/user/tickets">
                    <Button variant="secondary">Kembali ke ticket</Button>
                  </Link>
                </DataPanel>
              ) : (
                <>
                  <ChatPanel ticketId={ticketId} initial={msgs.data ?? []} role="user" />
                  {msgs.isLoading ? <div className="text-xs text-slate-500">Memuat percakapan...</div> : null}
                </>
              )}
            </>
          ) : unauthorizedTicket ? (
            <DataPanel title="Ticket tidak dapat diakses" description="Ticket ini bukan milik akun Anda atau sudah tidak tersedia.">
              <Link href="/user/tickets">
                <Button variant="secondary">Kembali ke daftar ticket</Button>
              </Link>
            </DataPanel>
          ) : (
            <EmptyState title="Ticket tidak valid" description="Periksa kembali tautan ticket yang Anda buka." />
          )}
        </div>
      </section>
    </div>
  );
}
