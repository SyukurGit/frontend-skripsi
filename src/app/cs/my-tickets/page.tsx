"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Inbox, MessageCircle } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState, PageHeader, Pill } from "@/components/ui/page";
import { useCsMyTickets } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";

export default function CsMyTicketsPage() {
  const q = useCsMyTickets();
  const items = q.data ?? [];
  const activeItems = items.filter((ticket) => ticket.status === "CLAIMED" || ticket.status === "IN_PROGRESS").slice(0, 2);
  const atLimit = activeItems.length >= 2;

  return (
    <div>
      <Topbar title="Assignment Saya" subtitle="Ruang kerja Customer Support" />
      <PageHeader
        eyebrow="Least Privilege"
        title="Tiket dalam assignment"
        description="Least Privilege membatasi Customer Support pada assignment tiket. Tiket di luar daftar ini tidak dapat digunakan untuk membuka percakapan atau profil pengguna."
        actions={
          <Button asChild variant="secondary">
            <Link href="/cs">
              <Inbox className="h-4 w-4" />
              Buka antrian
            </Link>
          </Button>
        }
        meta={<Pill tone={atLimit ? "warning" : "success"}>{activeItems.length}/2 tiket aktif</Pill>}
      />

      <section>
        <DataPanel
          title="Assignment aktif"
          description="Fokus kerja saat ini. Maksimal dua tiket aktif ditampilkan."
          actions={<Pill tone={atLimit ? "warning" : "info"}>{atLimit ? "Kapasitas penuh" : "Masih tersedia"}</Pill>}
        >
          {q.isLoading ? <div className="text-sm text-slate-500">Memuat tiket...</div> : null}
          {q.isError ? <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Gagal memuat tiket penugasan")}</div> : null}
          {!q.isLoading && !q.isError ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {activeItems.map((ticket, index) => (
                <div key={ticket.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase text-slate-500">Assignment {String(index + 1).padStart(2, "0")}</div>
                        <div className="font-semibold text-slate-950">Tiket #{ticket.id}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-500">
                          {ticket.status === "CLAIMED"
                            ? "Mulai penanganan untuk mengaktifkan alur akses sementara."
                            : "Percakapan dan permintaan JIT siap digunakan."}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm" className="w-full sm:w-auto">
                      <Link href={`/cs/tickets/${ticket.id}`}>
                        <MessageCircle className="h-4 w-4" />
                        Buka ruang kerja
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {activeItems.length === 0 ? (
                <div className="lg:col-span-2">
                  <EmptyState
                    title="Belum ada assignment aktif"
                    description="Ambil tiket dari antrian untuk membentuk ruang kerja Customer Support."
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
      </section>
    </div>
  );
}
