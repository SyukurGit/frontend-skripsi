"use client";

import Link from "next/link";
import { Headphones, LockKeyhole, MessageCircle, Plus, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState, PageHeader, Pill } from "@/components/ui/page";
import { StatCard } from "@/components/ui/stat-card";
import { useCloseTicket, useUserTickets } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

export default function UserTicketsPage() {
  const toast = useToastStore((s) => s.push);
  const q = useUserTickets();
  const close = useCloseTicket();
  const tickets = q.data ?? [];
  const active = tickets.filter((t) => t.status !== "CLOSED").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div>
      <Topbar title="Bantuan" subtitle="Ticket support sebagai konteks pembatasan akses" />
      <PageHeader
        eyebrow="Customer support"
        title="Pusat bantuan DompetKu"
        description="Pengguna hanya membuat dan memantau ticket. Akses internal CS tetap dikendalikan oleh assignment, status ticket, dan JIT pada backend."
        actions={
          <Link href="/user/tickets/new">
            <Button>
              <Plus className="h-4 w-4" />
              Buat ticket
            </Button>
          </Link>
        }
        meta={<Pill tone="info">Ticket-bound access</Pill>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Ticket aktif" value={active} hint="Belum ditutup pengguna" tone="info" />
        <StatCard label="Siap ditutup" value={resolved} hint="Status RESOLVED dari CS" tone="success" />
        <StatCard label="Batas akses CS" value="Kontekstual" hint="Hanya dari ticket terkait" tone="neutral" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.45fr]">
        <DataPanel title="Daftar ticket" description="Buka ticket untuk melanjutkan chat atau menutup ticket yang sudah selesai.">
          {q.isLoading ? <div className="text-sm text-slate-500">Memuat ticket...</div> : null}
          {q.isError ? <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Failed to load tickets")}</div> : null}
          {!q.isLoading && !q.isError ? (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/user/tickets/${t.id}`} className="font-semibold text-slate-950 hover:text-emerald-700">
                            Ticket #{t.id}
                          </Link>
                          <StatusBadge status={t.status} />
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          Petugas: {t.assignedCsId ? `CS #${t.assignedCsId}` : "menunggu assignment"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/user/tickets/${t.id}`}>
                        <Button variant="secondary" size="sm">
                          Buka
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={close.isPending || t.status !== "RESOLVED"}
                        onClick={async () => {
                          try {
                            await close.mutateAsync(t.id);
                            toast({ kind: "success", title: "Ticket ditutup", detail: `#${t.id}` });
                          } catch (e: unknown) {
                            toast({ kind: "error", title: "Gagal menutup ticket", detail: getErrorMessage(e, "Close failed") });
                          }
                        }}
                      >
                        Tutup
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {tickets.length === 0 ? (
                <EmptyState title="Belum ada ticket" description="Buat ticket baru untuk memulai percakapan bantuan dan menguji boundary akses CS." />
              ) : null}
            </div>
          ) : null}
        </DataPanel>

        <DataPanel title="Prinsip akses" description="Yang terjadi ketika ticket dibuat.">
          <div className="space-y-3">
            {[
              { icon: Headphones, title: "Assignment", desc: "CS harus mengambil ticket sebelum dapat bekerja." },
              { icon: LockKeyhole, title: "Least privilege", desc: "Data pengguna tidak terbuka sebagai daftar umum." },
              { icon: ShieldCheck, title: "JIT", desc: "Fitur sensitif aktif sementara setelah ticket IN_PROGRESS." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <Icon className="h-5 w-5 text-emerald-700" />
                  <div className="mt-3 font-semibold text-slate-950">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </DataPanel>
      </section>
    </div>
  );
}
