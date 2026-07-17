"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState, PageHeader, Pill } from "@/components/ui/page";
import { useCsMyTickets } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";

export default function CsChatPage() {
  const q = useCsMyTickets();
  const items = q.data ?? [];

  return (
    <div>
      <Topbar title="Chat" subtitle="Percakapan hanya dari ticket yang ditugaskan" />
      <PageHeader
        eyebrow="Bounded conversation"
        title="Pilih ruang chat berdasarkan assignment"
        description="CS tidak memilih pengguna secara bebas. Percakapan dibuka melalui ticket yang sudah masuk ke scope kerja CS."
        meta={<Pill tone="success">Chat mengikuti ticket scope</Pill>}
      />

      <DataPanel title="Percakapan aktif" description="Buka workspace ticket untuk membaca dan membalas chat pengguna.">
        {q.isLoading ? <div className="text-sm text-slate-500">Memuat percakapan...</div> : null}
        {q.isError ? <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Failed to load active tickets")}</div> : null}
        {!q.isLoading && !q.isError ? (
          <div className="space-y-3">
            {items.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold text-slate-950">Ticket #{ticket.id}</div>
                        <StatusBadge status={ticket.status} />
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <ShieldCheck className="h-4 w-4" />
                        Percakapan berada dalam boundary ticket.
                      </div>
                    </div>
                  </div>
                  <Link href={`/cs/tickets/${ticket.id}`}>
                    <Button variant="secondary">
                      Buka chat
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {items.length === 0 ? <EmptyState title="Belum ada percakapan aktif" description="Ambil ticket dari queue untuk membuka ruang chat." /> : null}
          </div>
        ) : null}
      </DataPanel>
    </div>
  );
}
