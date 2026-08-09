"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowLeft, ArrowRight, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { JitPanel } from "@/components/jit/jit-panel";
import { Button } from "@/components/ui/button";
import { StatusBadge, ticketStatusLabel } from "@/components/ui/badge";
import { DataPanel, EmptyState, KeyValue, Pill } from "@/components/ui/page";
import { useCsTicket, useMessages, useTicketUserProfile, useUpdateTicketStatus } from "@/services/queries";
import { useJitStore } from "@/store/jit";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { formatMoneyIDR } from "@/utils/format";
import type { TicketStatus } from "@/types/api";

export default function CsTicketDetailPage() {
  const toast = useToastStore((s) => s.push);
  const params = useParams<{ id: string }>();
  const rawId = Number(params.id);
  const valid = Number.isFinite(rawId) && rawId > 0;
  const ticketId = valid ? rawId : 0;

  const ticketQ = useCsTicket(ticketId);
  const scopedTicketId = ticketQ.data ? ticketId : 0;
  const msgs = useMessages(scopedTicketId, "cs");
  const profile = useTicketUserProfile(scopedTicketId);
  const updateStatus = useUpdateTicketStatus();
  const clearTicketJit = useJitStore((s) => s.clearTicket);
  const clearJit = useJitStore((s) => s.clear);

  const nextStatus: TicketStatus | null =
    ticketQ.data?.status === "CLAIMED"
      ? "IN_PROGRESS"
      : ticketQ.data?.status === "IN_PROGRESS"
        ? "RESOLVED"
        : ticketQ.data?.status === "RESOLVED"
          ? "CLOSED"
          : null;

  const nextStatusAction =
    nextStatus === "IN_PROGRESS"
      ? "Mulai penanganan"
      : nextStatus === "RESOLVED"
        ? "Tandai siap ditutup"
        : nextStatus === "CLOSED"
          ? "Tutup tiket"
          : "Siklus tiket selesai";

  const kyc = useMemo(() => {
    const data = profile.data?.kycData;
    if (typeof data === "object" && data !== null) return data as Record<string, unknown>;
    return {};
  }, [profile.data]);

  const profileLocked = profile.data?.exposureState !== "PARTIAL_AFTER_JIT";

  async function advanceTicketStatus() {
    if (!nextStatus) return;

    try {
      await updateStatus.mutateAsync({ ticketId, status: nextStatus });
      await ticketQ.refetch();
      if (nextStatus === "CLOSED") clearTicketJit(ticketId);
      toast({ kind: "success", title: "Status diperbarui", detail: ticketStatusLabel[nextStatus] });
    } catch (error) {
      toast({ kind: "error", title: "Gagal memperbarui status", detail: getErrorMessage(error, "Update status gagal") });
    }
  }

  async function refreshProfile() {
    try {
      await profile.refetch();
      clearJit(ticketId, "VIEW_KYC");
      toast({ kind: "success", title: "Profil diperbarui" });
    } catch (error) {
      toast({ kind: "error", title: "Muat ulang gagal", detail: getErrorMessage(error, "Muat ulang gagal") });
    }
  }

  if (!valid) {
    return (
      <div>
        <Topbar title="Tiket" subtitle="ID tiket tidak valid" />
        <EmptyState
          title="Tiket tidak ditemukan"
          description="Kembali ke daftar penugasan untuk memilih tiket yang valid."
          action={
            <Button asChild variant="secondary">
              <Link href="/cs/my-tickets">Kembali</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Topbar title={`Tiket #${ticketId}`} subtitle="Ruang kerja Customer Support" />
      <section className="mb-4 flex flex-col gap-3 border-b border-[#dfe3e8] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-[var(--brand)]">Assignment ticket</div>
          <h2 className="mt-1 text-2xl font-semibold text-[#171a21]">Penanganan ticket #{ticketId}</h2>
          <p className="mt-1 hidden max-w-2xl text-sm leading-6 text-[#667085] sm:block">
            Percakapan, profil terbatas, dan session JIT berada dalam satu konteks assignment Customer Support.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ticketQ.data ? (
              <>
                <StatusBadge status={ticketQ.data.status} />
                <Pill tone={profileLocked ? "warning" : "success"}>{profileLocked ? "Data sensitif terkunci" : "Profil terbuka terbatas"}</Pill>
              </>
            ) : (
              <Pill tone={ticketQ.isError ? "danger" : "neutral"}>{ticketQ.isError ? "Ticket tidak tersedia" : "Memuat ticket"}</Pill>
            )}
          </div>
        </div>
        <div className="shrink-0">
          <Button asChild variant="secondary">
            <Link href="/cs/my-tickets">
              <ArrowLeft className="h-4 w-4" />
              Assignment saya
            </Link>
          </Button>
        </div>
      </section>

      {ticketQ.isLoading ? (
        <DataPanel title="Memuat ruang kerja" description="Memeriksa assignment dan status tiket.">
          <div className="text-sm text-slate-500">Menyiapkan detail tiket...</div>
        </DataPanel>
      ) : null}

      {ticketQ.isError ? (
        <DataPanel title="Tiket tidak dapat dibuka" description={getErrorMessage(ticketQ.error, "Tiket tidak tersedia pada assignment Anda.")}>
          <Button asChild variant="secondary">
            <Link href="/cs/my-tickets">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke assignment
            </Link>
          </Button>
        </DataPanel>
      ) : null}

      {ticketQ.data ? (
        <>
          <Tabs.Root defaultValue="chat">
            <Tabs.List className="mb-4 grid grid-cols-3 gap-1 rounded-md border border-[#dfe3e8] bg-white p-1 xl:hidden" aria-label="Bagian ruang kerja ticket">
              {[
                ["chat", "Percakapan"],
                ["context", "Konteks"],
                ["access", "Akses JIT"],
              ].map(([value, label]) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className="h-9 rounded px-2 text-xs font-semibold text-[#667085] data-[state=active]:bg-[#edf4ff] data-[state=active]:text-[#1356b8]"
                >
                  {label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <section className="grid items-start gap-5 xl:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.35fr)_minmax(300px,0.87fr)]">
              <Tabs.Content
                value="chat"
                forceMount
                className="min-w-0 data-[state=inactive]:hidden xl:col-start-2 xl:row-start-1 xl:data-[state=inactive]:block"
              >
              {msgs.isLoading ? (
                <DataPanel title="Memuat percakapan" description="Mengambil pesan dalam konteks tiket ini.">
                  <div className="text-sm text-slate-500">Menyiapkan ruang chat...</div>
                </DataPanel>
              ) : msgs.isError ? (
                <DataPanel title="Percakapan gagal dimuat" description={getErrorMessage(msgs.error, "Gagal memuat pesan")}>
                  <Button asChild variant="secondary">
                    <Link href="/cs/my-tickets">Kembali ke assignment</Link>
                  </Button>
                </DataPanel>
              ) : (
                <ChatPanel ticketId={ticketId} initial={msgs.data ?? []} role="cs" />
              )}
              </Tabs.Content>

              <Tabs.Content
                value="access"
                forceMount
                className="min-w-0 data-[state=inactive]:hidden xl:col-start-3 xl:row-start-1 xl:data-[state=inactive]:block"
              >
                <JitPanel ticketId={ticketId} ticketStatus={ticketQ.data.status} />
              </Tabs.Content>

              <Tabs.Content
                value="context"
                forceMount
                className="min-w-0 space-y-5 data-[state=inactive]:hidden xl:col-start-1 xl:row-start-1 xl:data-[state=inactive]:block"
              >
                <DataPanel title="Kendali ticket" description="Status menentukan langkah kerja berikutnya.">
                  <div className="grid grid-cols-2 gap-3">
                    <KeyValue label="Ticket" value={`#${ticketId}`} />
                    <KeyValue label="Pengguna" value={`#${ticketQ.data.userId}`} />
                    <div className="col-span-2">
                      <KeyValue label="Status saat ini" value={ticketStatusLabel[ticketQ.data.status]} />
                    </div>
                    <div className="col-span-2 border-t border-[#e9ecf0] pt-3">
                      <div className="text-xs font-medium text-[#7b8492]">Tindakan berikutnya</div>
                      {nextStatus ? (
                        <Button className="mt-2 w-full" size="sm" onClick={() => void advanceTicketStatus()} disabled={updateStatus.isPending}>
                          {updateStatus.isPending ? "Memperbarui..." : nextStatusAction}
                          {!updateStatus.isPending ? <ArrowRight className="h-4 w-4" /> : null}
                        </Button>
                      ) : (
                        <div className="mt-2 text-sm font-semibold text-[#596170]">Siklus ticket selesai</div>
                      )}
                    </div>
                  </div>
                </DataPanel>

                <DataPanel
                  title="Profil pengguna"
                  description={profileLocked ? "Data sensitif tetap terkunci sebelum session JIT valid." : "Data dibuka secara terbatas setelah session JIT digunakan."}
                  actions={
                    <Pill tone={profileLocked ? "warning" : "success"}>
                      {profileLocked ? "Terkunci" : "Terbuka terbatas"}
                    </Pill>
                  }
                >
                  {profile.isLoading ? <div className="text-sm text-slate-500">Memuat profil...</div> : null}
                  {profile.isError ? (
                    <div className="space-y-3">
                      <div className="text-sm text-rose-700">{getErrorMessage(profile.error, "Gagal memuat profil")}</div>
                      <Button variant="secondary" className="w-full" onClick={() => void refreshProfile()} disabled={profile.isFetching}>
                        <RefreshCw className="h-4 w-4" />
                        Coba lagi
                      </Button>
                    </div>
                  ) : null}
                  {!profile.isLoading && !profile.isError ? (
                    <div className="space-y-3">
                      {profileLocked ? (
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                          <LockKeyhole className="h-5 w-5 text-amber-700" />
                          <div className="mt-2 font-semibold text-slate-950">Data sensitif belum tersedia</div>
                          <div className="mt-1 text-sm leading-6 text-amber-900">
                            Ubah ticket ke Sedang diproses, lalu minta session JIT untuk feature yang diperlukan.
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#236847]">
                            <ShieldCheck className="h-4 w-4" />
                            Akses profil tercatat
                          </div>
                          <KeyValue label="Nomor telepon" value={profile.data?.phone ?? "-"} />
                          <KeyValue label="Saldo" value={formatMoneyIDR(Number(profile.data?.balance ?? 0))} />
                          {Object.entries(kyc).slice(0, 4).map(([key, value]) => (
                            <KeyValue key={key} label={String(key).replace(/_/g, " ")} value={String(value ?? "-")} />
                          ))}
                        </div>
                      )}
                      <Button variant="secondary" className="w-full" onClick={() => void refreshProfile()} disabled={profile.isFetching}>
                        <RefreshCw className="h-4 w-4" />
                        {profile.isFetching ? "Membuka data..." : "Gunakan session untuk buka profil"}
                      </Button>
                    </div>
                  ) : null}
                </DataPanel>
              </Tabs.Content>
            </section>
          </Tabs.Root>
        </>
      ) : null}
    </div>
  );
}
