"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreateTicket } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

export default function NewTicketPage() {
  const router = useRouter();
  const toast = useToastStore((s) => s.push);
  const m = useCreateTicket();

  return (
    <div>
      <Topbar title="Buat Tiket Bantuan" subtitle="Mulai percakapan dengan customer support DompetKu" />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Form bantuan</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Buat tiket baru</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold">Buat tiket bantuan sekali klik</div>
              <div className="mt-1 text-sm text-slate-500">
                Sistem akan membuat tiket baru dan menyiapkan ruang chat untuk percakapan dengan tim bantuan. Bagian ini hanya berfungsi sebagai pintu masuk menuju skenario penelitian.
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  disabled={m.isPending}
                  onClick={async () => {
                    try {
                      const t = await m.mutateAsync();
                      toast({ kind: "success", title: "Ticket created", detail: `#${t.id}` });
                      router.replace(`/user/tickets/${t.id}`);
                    } catch (e: unknown) {
                      toast({ kind: "error", title: "Create failed", detail: getErrorMessage(e, "Create failed") });
                    }
                  }}
                >
                  {m.isPending ? "Membuat..." : "Buat tiket"}
                </Button>
                <Link href="/user/tickets">
                  <Button variant="secondary">Kembali</Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Catatan</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Tentang tiket bantuan</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-500">
              Jika layanan backend sedang tidak tersedia, pembuatan tiket akan gagal dan pesan error akan ditampilkan secara jelas di layar.
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
