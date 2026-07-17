"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, MessageCircle } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState, PageHeader, Pill } from "@/components/ui/page";
import { StatCard } from "@/components/ui/stat-card";
import { useCsMyTickets } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";

export default function CsMyTicketsPage() {
  const q = useCsMyTickets();
  const items = q.data ?? [];
  const inProgress = items.filter((t) => t.status === "IN_PROGRESS").length;
  const claimed = items.filter((t) => t.status === "CLAIMED").length;
  const resolved = items.filter((t) => t.status === "RESOLVED").length;

  return (
    <div>
      <Topbar title="Assignment" subtitle="Ticket yang sudah terikat ke akun CS" />
      <PageHeader
        eyebrow="My ticket scope"
        title="Daftar kerja yang boleh diakses"
        description="Jika ticket tidak muncul di daftar ini, CS tidak memiliki konteks assignment untuk membuka percakapan atau profil pengguna."
        meta={<Pill tone="info">Least privilege enforced by assignment</Pill>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Claimed" value={claimed} hint="Perlu dinaikkan ke IN_PROGRESS" tone="neutral" />
        <StatCard label="In progress" value={inProgress} hint="JIT dapat diuji di status ini" tone="success" />
        <StatCard label="Resolved" value={resolved} hint="Siap diselesaikan" tone="info" />
      </section>

      <section className="mt-5">
        <DataPanel title="Ticket dalam penugasan" description="Buka workspace untuk chat, status, profil terbatas, dan permintaan JIT.">
          {q.isLoading ? <div className="text-sm text-slate-500">Memuat ticket...</div> : null}
          {q.isError ? <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Failed to load assigned tickets")}</div> : null}
          {!q.isLoading && !q.isError ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {items.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-950">Ticket #{ticket.id}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-500">Konteks kerja sudah terikat ke akun CS ini.</div>
                      </div>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/cs/tickets/${ticket.id}`}>
                      <Button size="sm">
                        <MessageCircle className="h-4 w-4" />
                        Buka workspace
                      </Button>
                    </Link>
                    <Link href={`/cs/tickets/${ticket.id}`}>
                      <Button variant="secondary" size="sm">
                        Detail
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {items.length === 0 ? <EmptyState title="Belum ada ticket" description="Ambil ticket dari queue agar scope kerja CS terbentuk." /> : null}
            </div>
          ) : null}
        </DataPanel>
      </section>
    </div>
  );
}
