"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { useMessages, useUserTicketActivity, useUserTickets } from "@/services/queries";
import { ChatPanel } from "@/components/chat/chat-panel";
import { getErrorMessage } from "@/utils/api-error";
import { auditActionHint, auditActionLabel, isSensitiveAuditAction } from "@/utils/audit";
import { format } from "date-fns";

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
      <Topbar title={valid ? `Ticket #${ticketId}` : "Tiket"} subtitle={valid ? "Pantau balasan dan status bantuan Anda" : "ID tiket tidak valid"} />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Ringkasan tiket</div>
              {ticket ? <StatusBadge status={ticket.status} /> : null}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Informasi bantuan</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ticket ID</span>
                <span className="font-semibold">{ticketId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Petugas</span>
                <span className="font-semibold">{ticket?.assignedCsId ?? "-"}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/user/tickets">
                <Button variant="secondary">Kembali</Button>
              </Link>
            </div>

            <div className="mt-4 rounded-3xl border border-blue-100 bg-blue-50/80 p-5">
              <div className="text-sm font-semibold text-slate-950">Yang dibatasi sistem dari sisi pengguna</div>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">Petugas hanya boleh melihat akun yang memang terikat ke tiket ini, bukan data pengguna lain secara umum.</div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">Tindakan sensitif pada akun Anda tidak aktif secara default dan harus melewati permintaan akses sementara dari sisi CS.</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {canAccessTicket ? (
            <>
              {tickets.isError ? <div className="mb-3 text-sm text-rose-700">{getErrorMessage(tickets.error, "Failed to load ticket metadata")}</div> : null}
              {!activity.isLoading && !activity.isError && sensitiveActivity.length > 0 ? (
                <Card className="border-amber-200 bg-amber-50/80">
                  <CardHeader>
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">Pemberitahuan akses sensitif</div>
                    <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Aktivitas Customer Service yang perlu diketahui pengguna</div>
                  </CardHeader>
                  <CardBody className="pt-4">
                    <div className="space-y-3">
                      {sensitiveActivity.slice(0, 3).map((item) => (
                        <div key={item.id} className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                          <div className="font-semibold text-slate-950">{auditActionLabel(item.action)}</div>
                          <div className="mt-1">{auditActionHint(item)}</div>
                          <div className="mt-2 text-xs text-amber-700">{format(new Date(item.createdAt), "PPp")}</div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              ) : null}
              {msgs.isError ? (
                <Card>
                  <CardHeader>
                    <div className="text-sm font-semibold">Pesan tidak tersedia</div>
                    <div className="mt-1 text-sm text-slate-500">{getErrorMessage(msgs.error, "Failed to load messages")}</div>
                  </CardHeader>
                  <CardBody className="pt-4">
                    <Link href="/user/tickets">
                      <Button variant="secondary">Kembali</Button>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                <>
                  <ChatPanel ticketId={ticketId} initial={msgs.data ?? []} role="user" />
                  {msgs.isLoading ? <div className="mt-2 text-xs text-slate-500">Memuat percakapan...</div> : null}
                </>
              )}
            </>
          ) : unauthorizedTicket ? (
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">Tiket tidak dapat diakses</div>
                <div className="mt-1 text-sm text-slate-500">Tiket ini bukan milik akun Anda atau sudah tidak tersedia.</div>
              </CardHeader>
              <CardBody className="pt-4">
                <Link href="/user/tickets">
                  <Button variant="secondary">Kembali ke tiket</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">Tiket tidak valid</div>
                <div className="mt-1 text-sm text-slate-500">Periksa kembali tautan tiket yang Anda buka.</div>
              </CardHeader>
              <CardBody className="pt-4">
                <Link href="/user/tickets">
                  <Button variant="secondary">Kembali ke tiket</Button>
                </Link>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
