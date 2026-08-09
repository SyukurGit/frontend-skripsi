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
  const activeItems = items.filter((ticket) => ticket.status === "CLAIMED" || ticket.status === "IN_PROGRESS").slice(0, 2);

  return (
    <div>
      <Topbar title="Chat Customer Support" subtitle="Percakapan dari assignment aktif" />
      <PageHeader
        eyebrow="Percakapan aktif"
        title="Lanjutkan percakapan tiket"
        description="Customer Support hanya dapat membuka percakapan dari assignment tiket yang sedang aktif. Pilih satu ruang kerja untuk melanjutkan penanganan."
        actions={
          <Button asChild variant="secondary">
            <Link href="/cs">Buka antrian</Link>
          </Button>
        }
        meta={<Pill tone={activeItems.length >= 2 ? "warning" : "info"}>{activeItems.length}/2 percakapan aktif</Pill>}
      />

      <DataPanel
        title="Ruang chat"
        description="Daftar ini hanya memuat tiket yang sudah diambil atau sedang diproses."
        actions={<Pill tone="neutral">Maksimal 2 aktif</Pill>}
      >
        {q.isLoading ? <div className="text-sm text-slate-500">Memuat percakapan...</div> : null}
        {q.isError ? <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Gagal memuat tiket aktif")}</div> : null}
        {!q.isLoading && !q.isError ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {activeItems.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/cs/tickets/${ticket.id}`}
                className="group flex min-w-0 items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-slate-950">Tiket #{ticket.id}</div>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <ShieldCheck className="h-4 w-4" />
                      {ticket.status === "CLAIMED" ? "Siap memulai penanganan" : "Percakapan sedang berjalan"}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-700" />
              </Link>
            ))}
            {activeItems.length === 0 ? (
              <div className="lg:col-span-2">
                <EmptyState
                  title="Belum ada percakapan aktif"
                  description="Ambil tiket dari antrian untuk membentuk assignment dan membuka ruang chat."
                  action={
                    <Button asChild>
                      <Link href="/cs">Ambil tiket</Link>
                    </Button>
                  }
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </DataPanel>
    </div>
  );
}
