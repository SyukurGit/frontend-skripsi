"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCirclePlus,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useCreateTicket } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

const nextSteps = [
  {
    icon: MessageCirclePlus,
    title: "Tiket masuk ke antrian",
    description: "Ruang percakapan dibuat tanpa membuka data internal pengguna.",
  },
  {
    icon: UserRoundCheck,
    title: "CS mengambil tiket",
    description: "Penugasan membentuk batas Least Privilege untuk petugas tersebut.",
  },
  {
    icon: ShieldCheck,
    title: "JIT divalidasi backend",
    description: "Fitur sensitif hanya aktif sementara ketika seluruh syarat terpenuhi.",
  },
];

export default function NewTicketPage() {
  const router = useRouter();
  const toast = useToastStore((state) => state.push);
  const createTicket = useCreateTicket();

  async function handleCreateTicket() {
    try {
      const ticket = await createTicket.mutateAsync();
      toast({ kind: "success", title: "Tiket dibuat", detail: `#${ticket.id}` });
      router.replace(`/user/tickets/${ticket.id}`);
    } catch (error: unknown) {
      toast({
        kind: "error",
        title: "Gagal membuat tiket",
        detail: getErrorMessage(error, "Gagal membuat tiket"),
      });
    }
  }

  return (
    <div>
      <Topbar title="Buat Tiket" subtitle="Mulai percakapan bantuan pengguna" />

      <section className="mb-5 py-2">
        <Link
          href="/user/tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar tiket
        </Link>
        <div className="mt-5 text-xs font-semibold uppercase text-indigo-700">
          Langkah 1 dari 2
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
          Buka ruang bantuan
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Tiket dibuat untuk akun yang sedang login. Setelah itu, jelaskan kendala Anda langsung
          di ruang percakapan.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden">
          <div className="border-b border-indigo-100 bg-indigo-50 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
              <ShieldCheck className="h-4 w-4" />
              Tiket menjadi konteks kontrol akses
            </div>
          </div>
          <CardBody className="pt-6 sm:pt-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
              <MessageCirclePlus className="h-6 w-6" />
            </span>
            <h2 className="mt-5 max-w-xl text-xl font-semibold text-slate-950 sm:text-2xl">
              Siap membuat tiket baru?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Tidak ada formulir data pribadi pada tahap ini. Backend akan membuat tiket dan ruang
              chat, lalu mengarahkan Anda ke percakapan untuk menyampaikan kebutuhan bantuan.
            </p>

            <div className="mt-5 flex items-start gap-3 border-y border-slate-100 py-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  CS belum memperoleh akses saat tiket dibuat
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-500">
                  Petugas harus mengambil tiket terlebih dahulu. Aksi sensitif tetap memerlukan
                  sesi JIT yang valid.
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={createTicket.isPending}
                onClick={handleCreateTicket}
              >
                <MessageCirclePlus className="h-4 w-4" />
                {createTicket.isPending ? "Membuat tiket..." : "Buat tiket dan lanjutkan"}
              </Button>
              <Link
                href="/user/tickets"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Batal
              </Link>
            </div>
          </CardBody>
        </Card>

        <aside className="lg:border-l lg:border-slate-200 lg:pl-6">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Sesudah tiket dibuat
          </div>
          <h2 className="mt-3 text-lg font-semibold text-slate-950">
            Alur yang akan terlihat
          </h2>
          <ol className="mt-5 space-y-5">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">
                      0{index + 1}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-950">{step.title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">
                      {step.description}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <Link
            href="/user/history"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
          >
            Lihat contoh alur aktivitas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>
    </div>
  );
}
