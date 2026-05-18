"use client";

import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { useCloseTicket, useUserTickets } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

export default function UserTicketsPage() {
  const toast = useToastStore((s) => s.push);
  const q = useUserTickets();
  const close = useCloseTicket();

  return (
    <div>
      <Topbar title="Customer Support" subtitle="Hubungi tim bantuan DompetKu saat membutuhkan asistensi" />

      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Pusat bantuan</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Tiket bantuan Anda</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">Gunakan halaman ini untuk menunjukkan bahwa pengguna dapat menghubungi layanan bantuan tanpa memiliki akses ke logika internal CS.</div>
              </div>
              <Link href="/user/tickets/new">
                <Button>Buat tiket</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            {q.isLoading ? (
              <div className="text-sm text-slate-500">Memuat tiket...</div>
            ) : q.isError ? (
              <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Failed to load tickets")}</div>
            ) : (
              <div className="space-y-3">
                {(q.data ?? []).map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Link href={`/user/tickets/${t.id}`} className="text-sm font-semibold text-slate-950 hover:underline">
                        Ticket #{t.id}
                      </Link>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/user/tickets/${t.id}`}>
                        <Button variant="secondary">Buka</Button>
                      </Link>
                      <Button
                        variant="danger"
                        disabled={close.isPending || t.status !== "RESOLVED"}
                        onClick={async () => {
                          try {
                            await close.mutateAsync(t.id);
                            toast({ kind: "success", title: "Ticket closed", detail: `#${t.id}` });
                          } catch (e: unknown) {
                            toast({ kind: "error", title: "Close failed", detail: getErrorMessage(e, "Close failed") });
                          }
                        }}
                      >
                        Tutup
                      </Button>
                    </div>
                  </div>
                ))}
                {(q.data ?? []).length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border bg-slate-50 p-6 text-sm text-slate-500">
                    Belum ada tiket bantuan.
                  </div>
                ) : null}
                <div className="mt-3 text-xs text-slate-500">
                  Tiket dapat ditutup setelah status berubah menjadi RESOLVED.
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
