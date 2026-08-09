"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Inbox, LockKeyhole, UserRoundCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState, PageHeader, Pill } from "@/components/ui/page";
import { useCsClaimTicket, useCsMyTickets, useCsOpenTickets } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

export default function CsHome() {
  const toast = useToastStore((s) => s.push);
  const open = useCsOpenTickets();
  const my = useCsMyTickets();
  const claim = useCsClaimTicket();

  const openItems = open.data ?? [];
  const assignedItems = my.data ?? [];
  const activeItems = assignedItems.filter((ticket) => ticket.status === "CLAIMED" || ticket.status === "IN_PROGRESS");
  const visibleActiveItems = activeItems.slice(0, 2);
  const activeCount = activeItems.length;
  const atLimit = activeCount >= 2;
  const availableSlots = Math.max(0, 2 - activeCount);

  return (
    <div>
      <Topbar title="Customer Support" subtitle="Antrian dan assignment tiket" />
      <PageHeader
        eyebrow="Workspace operasional"
        title="Antrian Customer Support"
        description="Ambil tiket dari antrian untuk membentuk assignment. Assignment tiket menjadi batas akses Customer Support sebelum percakapan dan data pengguna dapat dibuka."
        actions={
          <Button asChild variant="dark">
            <Link href="/cs/my-tickets">
              <UserRoundCheck className="h-4 w-4" />
              Tiket saya
            </Link>
          </Button>
        }
        meta={
          <>
            <Pill tone={openItems.length > 0 ? "info" : "neutral"}>{openItems.length} tiket menunggu</Pill>
            <Pill tone={atLimit ? "warning" : "success"}>
              {atLimit ? "Kapasitas penuh 2/2" : `${availableSlots} slot tersedia`}
            </Pill>
          </>
        }
      />

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <DataPanel
          title="Antrian masuk"
          description="Tiket yang belum memiliki penanggung jawab. Ambil sesuai urutan dan kapasitas kerja."
          actions={<Pill tone={openItems.length > 0 ? "info" : "neutral"}>{openItems.length} menunggu</Pill>}
        >
          {open.isLoading ? <div className="text-sm text-slate-500">Memuat antrian...</div> : null}
          {open.isError ? <div className="text-sm text-rose-700">{getErrorMessage(open.error, "Gagal memuat antrian")}</div> : null}
          {!open.isLoading && !open.isError ? (
            <div className="space-y-3">
              {openItems.map((ticket, index) => {
                const isClaiming = claim.isPending && claim.variables === ticket.id;

                return (
                  <div key={ticket.id} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                          <Inbox className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold uppercase text-slate-500">Urutan {String(index + 1).padStart(2, "0")}</div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-semibold text-slate-950">Tiket #{ticket.id}</div>
                            <StatusBadge status={ticket.status} />
                          </div>
                          <div className="mt-1 text-sm text-slate-500">Belum memiliki assignment Customer Support.</div>
                        </div>
                      </div>
                      <Button
                        className="w-full sm:w-auto"
                        disabled={atLimit || claim.isPending}
                        onClick={async () => {
                          try {
                            await claim.mutateAsync(ticket.id);
                            toast({ kind: "success", title: "Tiket masuk ke assignment", detail: `Tiket #${ticket.id}` });
                          } catch (error) {
                            toast({ kind: "error", title: "Gagal mengambil tiket", detail: getErrorMessage(error, "Gagal") });
                          }
                        }}
                      >
                        {isClaiming ? "Mengambil..." : atLimit ? "Kapasitas penuh" : "Ambil tiket"}
                      </Button>
                    </div>
                  </div>
                );
              })}
              {openItems.length === 0 ? (
                <EmptyState title="Antrian kosong" description="Belum ada tiket baru yang menunggu Customer Support." />
              ) : null}
            </div>
          ) : null}
        </DataPanel>

        <DataPanel
          title="Sedang saya tangani"
          description="Maksimal dua assignment aktif pada satu waktu."
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link href="/cs/my-tickets">
                Lihat detail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {visibleActiveItems.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/cs/tickets/${ticket.id}`}
                className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-950">Tiket #{ticket.id}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {ticket.status === "CLAIMED" ? "Siap mulai ditangani" : "Penanganan sedang berjalan"}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              </Link>
            ))}
            {visibleActiveItems.length === 0 ? (
              <EmptyState title="Belum ada tiket aktif" description="Ambil satu tiket dari antrian untuk membuka ruang kerja." />
            ) : null}
            {atLimit ? (
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                Selesaikan satu assignment aktif sebelum mengambil tiket berikutnya.
              </div>
            ) : (
              <div className="flex gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
                Akses hanya terbentuk untuk tiket yang masuk ke assignment Anda.
              </div>
            )}
          </div>
        </DataPanel>
      </section>
    </div>
  );
}
