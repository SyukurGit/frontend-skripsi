"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, MessageCirclePlus, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { DataPanel, PageHeader, Pill } from "@/components/ui/page";
import { useCreateTicket } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

export default function NewTicketPage() {
  const router = useRouter();
  const toast = useToastStore((s) => s.push);
  const createTicket = useCreateTicket();

  return (
    <div>
      <Topbar title="Buat Ticket" subtitle="Mulai ruang bantuan yang terikat pada akun pengguna" />
      <PageHeader
        eyebrow="Support intake"
        title="Buka ticket bantuan baru"
        description="Prototype ini sengaja memakai satu tombol agar penguji langsung masuk ke skenario utama: assignment CS, perubahan status ticket, JIT access, dan audit."
        meta={<Pill tone="info">Backend membuat ruang chat otomatis</Pill>}
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        <DataPanel title="Konfirmasi pembuatan" description="Setelah ticket dibuat, halaman akan berpindah ke chat pengguna.">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <MessageCirclePlus className="h-8 w-8 text-emerald-700" />
            <div className="mt-4 text-xl font-semibold text-slate-950">Ticket akan dibuat untuk akun yang sedang login</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              Tidak ada data tambahan yang diminta dari pengguna pada prototype ini. Seluruh pembatasan akses diuji setelah ticket masuk ke antrian Customer Service.
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                disabled={createTicket.isPending}
                onClick={async () => {
                  try {
                    const ticket = await createTicket.mutateAsync();
                    toast({ kind: "success", title: "Ticket dibuat", detail: `#${ticket.id}` });
                    router.replace(`/user/tickets/${ticket.id}`);
                  } catch (e: unknown) {
                    toast({ kind: "error", title: "Gagal membuat ticket", detail: getErrorMessage(e, "Create failed") });
                  }
                }}
              >
                <MessageCirclePlus className="h-4 w-4" />
                {createTicket.isPending ? "Membuat..." : "Buat ticket"}
              </Button>
              <Link href="/user/tickets">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </DataPanel>

        <DataPanel title="Yang diuji setelah ticket dibuat" description="Urutan ini menjadi bahan demonstrasi frontend.">
          <div className="space-y-3">
            {[
              "Ticket masuk ke queue tanpa membuka data internal apa pun.",
              "CS harus claim ticket sebelum dapat melihat ruang kerja.",
              "JIT hanya dapat diajukan saat ticket sudah IN_PROGRESS.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <div className="text-sm leading-6 text-slate-600">{item}</div>
              </div>
            ))}
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <ShieldCheck className="h-5 w-5 text-sky-700" />
              <div className="mt-2 text-sm font-semibold text-slate-950">Audit tetap terbentuk di backend</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">Admin dapat melihat lifecycle ticket dan aktivitas sensitif pada halaman observability.</div>
            </div>
          </div>
        </DataPanel>
      </section>
    </div>
  );
}
