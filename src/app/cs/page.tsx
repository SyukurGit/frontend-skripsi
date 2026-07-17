"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Inbox, LockKeyhole, UserRoundCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState, PageHeader, Pill } from "@/components/ui/page";
import { StatCard } from "@/components/ui/stat-card";
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
      <Topbar title="CS Workspace" subtitle="Queue bantuan dengan akses berbasis assignment" />
      <PageHeader
        eyebrow="Ticket-bound workspace"
        title="Ambil ticket hanya saat masih ada kapasitas penugasan"
        description="CS tidak bekerja dari daftar seluruh pengguna. Semua akses dimulai dari ticket yang diambil, lalu dipersempit lagi oleh status dan sesi JIT."
        actions={
          <Link href="/cs/my-tickets">
            <Button variant="dark">
              <UserRoundCheck className="h-4 w-4" />
              Ticket saya
            </Button>
          </Link>
        }
        meta={atLimit ? <Pill tone="warning">Kapasitas penuh: 2/2 aktif</Pill> : <Pill tone="success">Slot tersedia: {activeCount}/2 aktif</Pill>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Queue masuk" value={openItems.length} hint="OPEN dan belum ditugaskan" tone="info" />
        <StatCard label="Aktif ditangani" value={`${activeCount}/2`} hint="CLAIMED atau IN_PROGRESS" tone={atLimit ? "warning" : "success"} />
        <StatCard label="Resolved" value={resolvedCount} hint="Menunggu ditutup pengguna/admin flow" tone="neutral" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.48fr]">
        <DataPanel title="Queue ticket masuk" description="Claim ticket untuk mengikat konteks kerja ke akun CS ini.">
          {open.isLoading ? <div className="text-sm text-slate-500">Memuat antrian...</div> : null}
          {open.isError ? <div className="text-sm text-rose-700">{getErrorMessage(open.error, "Gagal memuat antrian")}</div> : null}
          {!open.isLoading && !open.isError ? (
            <div className="space-y-3">
              {openItems.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                        <Inbox className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-slate-950">Ticket #{ticket.id}</div>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <div className="mt-1 text-sm text-slate-500">Belum ada CS yang memiliki scope akses ke ticket ini.</div>
                      </div>
                    </div>
                    <Button
                      disabled={atLimit || claim.isPending}
                      onClick={async () => {
                        try {
                          await claim.mutateAsync(ticket.id);
                          toast({ kind: "success", title: "Ticket berhasil diambil", detail: `#${ticket.id}` });
                        } catch (error) {
                          toast({ kind: "error", title: "Gagal mengambil ticket", detail: getErrorMessage(error, "Gagal") });
                        }
                      }}
                    >
                      {atLimit ? "Limit 2 ticket" : "Ambil ticket"}
                    </Button>
                  </div>
                </div>
              ))}
              {openItems.length === 0 ? <EmptyState title="Queue kosong" description="Tidak ada ticket OPEN yang menunggu assignment." /> : null}
            </div>
          ) : null}
        </DataPanel>

        <DataPanel title="Ticket saya" description="Akses operasional hanya berasal dari daftar ini.">
          <div className="space-y-3">
            {assignedItems.slice(0, 5).map((ticket) => (
              <Link
                key={ticket.id}
                href={`/cs/tickets/${ticket.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <div>
                  <div className="font-semibold text-slate-950">Ticket #{ticket.id}</div>
                  <div className="mt-1 text-sm text-slate-500">Buka workspace</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.status} />
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              </Link>
            ))}
            {assignedItems.length === 0 ? <EmptyState title="Belum ada assignment" description="Claim ticket dari queue untuk memulai pengujian LP." /> : null}
            {atLimit ? (
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                Selesaikan salah satu ticket aktif sebelum mengambil ticket baru.
              </div>
            ) : (
              <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
                Scope akses akan terbentuk setelah ticket berhasil diambil.
              </div>
            )}
          </div>
        </DataPanel>
      </section>
    </div>
  );
}
