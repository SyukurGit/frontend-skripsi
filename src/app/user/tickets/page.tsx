"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  LockKeyhole,
  MessageCircle,
  Plus,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState } from "@/components/ui/page";
import { useCloseTicket, useUserTickets } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import type { TicketStatus } from "@/types/api";
import { getErrorMessage } from "@/utils/api-error";

const statusDescription: Record<TicketStatus, string> = {
  OPEN: "Menunggu Customer Support mengambil ticket.",
  CLAIMED: "Tiket sudah ditugaskan dan menunggu penanganan.",
  IN_PROGRESS: "Customer Support sedang menangani ticket ini.",
  RESOLVED: "Penanganan selesai dan tiket dapat Anda tutup.",
  CLOSED: "Percakapan selesai dan akses terkait tiket berakhir.",
};

function formatTicketDate(value?: string) {
  if (!value) return "Waktu pembuatan tidak tersedia";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu pembuatan tidak tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function UserTicketsPage() {
  const toast = useToastStore((state) => state.push);
  const ticketsQuery = useUserTickets();
  const closeTicket = useCloseTicket();
  const tickets = ticketsQuery.data ?? [];
  const active = tickets.filter((ticket) => ticket.status !== "CLOSED").length;
  const waitingForUser = tickets.filter((ticket) => ticket.status === "RESOLVED").length;

  return (
    <div>
      <Topbar title="Bantuan" subtitle="Percakapan dan status tiket pengguna" />

      <section className="mb-5 flex flex-col gap-4 py-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase text-indigo-700">
            Pusat bantuan DompetKu
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Tiket bantuan Anda
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Setiap percakapan dimulai dari tiket. Penugasan tiket membatasi lingkup akses CS,
            sedangkan fitur sensitif tetap memerlukan sesi Just-in-Time yang valid.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {ticketsQuery.isLoading ? (
              <span className="text-slate-500">Memuat ringkasan tiket...</span>
            ) : (
              <>
                <span className="font-semibold text-slate-950">{active} belum ditutup</span>
                <span className="text-slate-300" aria-hidden="true">
                  /
                </span>
                <span
                  className={
                    waitingForUser > 0 ? "font-semibold text-green-700" : "text-slate-500"
                  }
                >
                  {waitingForUser} menunggu konfirmasi Anda
                </span>
              </>
            )}
          </div>
        </div>
        <Link
          href="/user/tickets/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(41,55,184,0.16)] hover:bg-[var(--brand-hover)]"
        >
          <Plus className="h-4 w-4" />
          Buat tiket
        </Link>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <DataPanel
          title="Daftar tiket"
          description="Buka percakapan untuk melihat balasan dan transparansi akses."
        >
          {ticketsQuery.isLoading ? (
            <div className="space-y-3" aria-label="Memuat tiket">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse border-b border-slate-100 py-4 first:pt-0">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-56 max-w-full rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : null}

          {ticketsQuery.isError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {getErrorMessage(ticketsQuery.error, "Gagal memuat tiket")}
            </div>
          ) : null}

          {!ticketsQuery.isLoading && !ticketsQuery.isError ? (
            <div className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/user/tickets/${ticket.id}`}
                          className="font-semibold text-slate-950 hover:text-indigo-700"
                        >
                          Tiket #{ticket.id}
                        </Link>
                        <StatusBadge status={ticket.status} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {statusDescription[ticket.status]}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatTicketDate(ticket.createdAt)}
                        </span>
                        <span>
                          {ticket.assignedCsId
                            ? `Ditangani CS #${ticket.assignedCsId}`
                            : "Belum ditugaskan"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pl-[52px] sm:flex-row lg:shrink-0 lg:pl-0">
                    {ticket.status === "RESOLVED" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={closeTicket.isPending}
                        onClick={async () => {
                          try {
                            await closeTicket.mutateAsync(ticket.id);
                            toast({
                              kind: "success",
                              title: "Tiket ditutup",
                              detail: `#${ticket.id}`,
                            });
                          } catch (error: unknown) {
                            toast({
                              kind: "error",
                              title: "Gagal menutup tiket",
                              detail: getErrorMessage(error, "Gagal menutup tiket"),
                            });
                          }
                        }}
                      >
                        {closeTicket.isPending ? "Menutup..." : "Tutup tiket"}
                      </Button>
                    ) : null}
                    <Link
                      href={`/user/tickets/${ticket.id}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      Buka percakapan
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}

              {tickets.length === 0 ? (
                <EmptyState
                  title="Belum ada tiket"
                  description="Buat tiket untuk memulai percakapan bantuan dan membentuk konteks akses CS."
                  action={
                    <Link
                      href="/user/tickets/new"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 text-sm font-semibold text-white hover:bg-[var(--brand-hover)]"
                    >
                      <Plus className="h-4 w-4" />
                      Buat tiket pertama
                    </Link>
                  }
                />
              ) : null}
            </div>
          ) : null}
        </DataPanel>

        <aside className="xl:border-l xl:border-slate-200 xl:pl-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            <ShieldCheck className="h-4 w-4 text-indigo-700" />
            Batas akses CS
          </div>
          <h2 className="mt-3 text-lg font-semibold text-slate-950">
            Tiket menentukan ruang kerja
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Memiliki peran CS saja tidak memberikan akses global ke data pengguna.
          </p>

          <ol className="mt-5 space-y-5">
            {[
              {
                icon: UserRoundCheck,
                title: "Harus ditugaskan",
                description: "CS hanya bekerja pada tiket yang diambilnya.",
              },
              {
                icon: LockKeyhole,
                title: "Fitur tetap terkunci",
                description: "Aksi sensitif memerlukan sesi JIT yang spesifik.",
              },
              {
                icon: ShieldCheck,
                title: "Aktivitas tercatat",
                description: "Akses sensitif disimpan pada log audit tiket.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">{item.description}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>
      </section>
    </div>
  );
}
