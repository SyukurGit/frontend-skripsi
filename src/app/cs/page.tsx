"use client";

import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { DemoScriptCard } from "@/components/demo/demo-script-card";
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
      <Topbar title="Dashboard Petugas" subtitle="Ringkasan antrian masuk dan tiket yang sedang ditangani" />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,#0f172a,#1d4ed8_58%,#335cff)] text-white shadow-[0_24px_70px_rgba(37,99,235,0.18)]">
          <CardBody className="p-7 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/80">Customer support</div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Kelola bantuan pengguna DompetKu dari satu workspace yang rapi.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50/90 sm:text-base">
              Fokus pada antrian masuk, lanjutkan tiket yang sedang ditangani, dan bantu pengguna tanpa bahasa teknis yang berlebihan di layar kerja Anda.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/cs/my-tickets">
                <Button className="h-12 bg-white text-slate-950 shadow-none hover:bg-slate-100">Lihat tiket saya</Button>
              </Link>
              <div className="inline-flex h-12 items-center rounded-2xl border border-white/18 bg-white/10 px-4 text-sm font-medium text-blue-50">
                Tiket aktif: {activeCount}/2
              </div>
            </div>
          </CardBody>
        </Card>

        <DemoScriptCard
          title="Mode operasional"
          subtitle="Panel ini membantu Anda menjelaskan titik masuk demonstrasi dari sisi Customer Service."
          steps={[
            "Tunjukkan bahwa Customer Service hanya melihat antrian yang relevan untuk operasional tiket.",
            "Lanjutkan dengan claim tiket agar konteks penugasan terbentuk dan pembatasan lingkup mulai aktif.",
            "Masuk ke detail tiket untuk memperlihatkan bagaimana Least Privilege dan Just-In-Time bekerja bersama.",
          ]}
        />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Antrian masuk" value={openItems.length} hint="Tiket baru yang siap diambil oleh petugas." />
        <StatCard label="Sedang ditangani" value={activeCount} hint="Tiket aktif yang masih berada dalam penanganan Anda." />
        <StatCard label="Siap ditutup" value={resolvedCount} hint="Tiket yang sudah selesai ditangani dan siap ditutup." />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Daftar tiket</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Antrian masuk</div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{openItems.length} tiket</div>
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            {open.isLoading ? <div className="text-sm text-slate-500">Memuat antrian...</div> : null}
            {open.isError ? <div className="text-sm text-rose-700">{getErrorMessage(open.error, "Failed to load incoming queue")}</div> : null}
            {!open.isLoading && !open.isError ? (
              <div className="space-y-3">
                {openItems.map((ticket) => (
                  <div key={ticket.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-slate-950">Ticket #{ticket.id}</div>
                        <StatusBadge status={ticket.status} />
                      </div>
                        <div className="mt-2 text-sm leading-6 text-slate-500">Ambil tiket ini untuk membentuk konteks penugasan sebelum data dan tindakan sensitif diuji pada halaman detail.</div>
                    </div>
                    <Button
                      variant="secondary"
                      className="h-11 lg:min-w-[140px]"
                      disabled={atLimit || claim.isPending}
                      onClick={async () => {
                        try {
                          await claim.mutateAsync(ticket.id);
                          toast({ kind: "success", title: "Ticket claimed", detail: `#${ticket.id}` });
                        } catch (error) {
                          toast({ kind: "error", title: "Claim failed", detail: getErrorMessage(error, "Claim failed") });
                        }
                      }}
                    >
                      Ambil tiket
                    </Button>
                  </div>
                ))}
                {openItems.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Tidak ada tiket baru pada antrian masuk.</div> : null}
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Sedang ditangani</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Tiket aktif Anda</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="space-y-3">
              {assignedItems.slice(0, 4).map((ticket) => (
                <Link key={ticket.id} href={`/cs/tickets/${ticket.id}`} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4 hover:border-blue-200 hover:bg-blue-50/40">
                  <div>
                    <div className="text-base font-semibold text-slate-950">Ticket #{ticket.id}</div>
                      <div className="mt-1 text-sm text-slate-500">Buka detail untuk memperlihatkan pembaruan status, pembatasan data, dan mekanisme JIT.</div>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </Link>
              ))}
              {assignedItems.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Belum ada tiket yang sedang Anda tangani.</div> : null}
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
