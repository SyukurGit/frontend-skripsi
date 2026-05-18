"use client";

import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCsMyTickets } from "@/services/queries";
import { getErrorMessage } from "@/utils/api-error";

export default function CsMyTicketsPage() {
  const q = useCsMyTickets();
  const items = q.data ?? [];

  return (
    <div>
      <Topbar title="Tiket Saya" subtitle="Daftar tiket yang sedang Anda tangani" />

      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Sedang ditangani</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Tiket aktif dalam penugasan Anda</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">Daftar ini hanya memuat tiket yang memang sudah terikat ke akun CS yang sedang login.</div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            {q.isLoading ? <div className="text-sm text-slate-500">Memuat tiket...</div> : null}
            {q.isError ? <div className="text-sm text-rose-700">{getErrorMessage(q.error, "Failed to load assigned tickets")}</div> : null}
            {!q.isLoading && !q.isError ? (
            <div className="space-y-3">
              {items.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-base font-semibold text-slate-950">Ticket #{t.id}</div>
                      <div className="mt-1 text-sm text-slate-500">Buka tiket untuk melanjutkan percakapan dan pembaruan status.</div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                  <Link href={`/cs/tickets/${t.id}`}>
                    <Button variant="secondary">Buka</Button>
                  </Link>
                </div>
              ))}
              {items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Belum ada tiket aktif.
                </div>
              ) : null}
            </div>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
