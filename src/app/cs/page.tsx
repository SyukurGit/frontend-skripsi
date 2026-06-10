"use client";

import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
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
  const activeCount = assignedItems.filter((t) => t.status === "CLAIMED" || t.status === "IN_PROGRESS").length;
  const resolvedCount = assignedItems.filter((t) => t.status === "RESOLVED").length;
  const atLimit = activeCount >= 2;

  return (
    <div>
      <Topbar title="Dashboard Petugas" subtitle="Kelola antrian tiket dan percakapan pelanggan" />

      {/* Overview Card */}
      <section className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white sm:p-8">
        <div className="text-sm font-semibold text-blue-100">Status Penugasan</div>
        <div className="mt-3 text-3xl font-bold">
          {activeCount} dari 2 tiket aktif
        </div>
        <p className="mt-3 text-sm text-blue-100">
          Anda dapat menangani maksimal 2 tiket secara bersamaan. Selesaikan tiket yang aktif untuk membuka slot baru.
        </p>
        <div className="mt-6">
          <Link href="/cs/my-tickets">
            <Button className="bg-white text-blue-600 hover:bg-slate-100">Lihat semua tiket</Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Antrian masuk" value={openItems.length} hint="Tiket baru menunggu untuk diambil" />
        <StatCard label="Sedang ditangani" value={activeCount} hint="Tiket aktif Anda saat ini" />
        <StatCard label="Siap ditutup" value={resolvedCount} hint="Tiket selesai yang dapat ditutup" />
      </section>

      {/* Tickets Grid */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Incoming Queue */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">Antrian</div>
                <div className="mt-2 text-xl font-bold text-slate-950">Tiket masuk</div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{openItems.length}</div>
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            {open.isLoading ? (
              <div className="text-sm text-slate-500">Memuat antrian...</div>
            ) : open.isError ? (
              <div className="text-sm text-red-600">{getErrorMessage(open.error, "Gagal memuat antrian")}</div>
            ) : (
              <div className="space-y-3">
                {openItems.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-slate-950">Ticket #{ticket.id}</div>
                        <StatusBadge status={ticket.status} />
                      </div>
                    </div>
                    <Button
                      disabled={atLimit || claim.isPending}
                      onClick={async () => {
                        try {
                          await claim.mutateAsync(ticket.id);
                          toast({ kind: "success", title: "Tiket berhasil diambil", detail: `#${ticket.id}` });
                        } catch (error) {
                          toast({ kind: "error", title: "Gagal mengambil tiket", detail: getErrorMessage(error, "Gagal") });
                        }
                      }}
                    >
                      {atLimit ? "Limit" : "Ambil"}
                    </Button>
                  </div>
                ))}
                {openItems.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Tidak ada tiket baru
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Active Tickets */}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">Aktif</div>
            <div className="mt-2 text-xl font-bold text-slate-950">Tiket saya</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="space-y-3">
              {assignedItems.slice(0, 5).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/cs/tickets/${ticket.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-blue-300 hover:bg-blue-50"
                >
                  <div>
                    <div className="font-semibold text-slate-950">Ticket #{ticket.id}</div>
                  </div>
                  <StatusBadge status={ticket.status} />
                </Link>
              ))}
              {assignedItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Belum ada tiket
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
