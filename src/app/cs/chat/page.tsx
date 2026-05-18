"use client";

import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { useCsMyTickets } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";

export default function CsChatPage() {
  const q = useCsMyTickets();
  const items = q.data ?? [];

  return (
    <div>
      <Topbar title="Chat" subtitle="Pilih tiket aktif untuk melanjutkan percakapan dengan pengguna tanpa keluar dari konteks penugasan" />

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Percakapan aktif</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Chat berdasarkan tiket</div>
        </CardHeader>
        <CardBody className="pt-4">
          {q.isLoading ? <div className="text-sm text-slate-500">Memuat percakapan...</div> : null}
          {q.isError ? <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Failed to load active tickets")}</div> : null}
          {!q.isLoading && !q.isError ? (
            <div className="space-y-3">
              {items.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-base font-semibold text-slate-950">Ticket #{ticket.id}</div>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <div className="mt-1 text-sm text-slate-500">Buka tiket untuk membaca dan membalas chat pengguna di dalam ruang akses yang sudah dibatasi oleh sistem.</div>
                  </div>
                  <Link href={`/cs/tickets/${ticket.id}`}>
                    <Button variant="secondary">Buka chat</Button>
                  </Link>
                </div>
              ))}
              {items.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Belum ada percakapan aktif.</div> : null}
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
