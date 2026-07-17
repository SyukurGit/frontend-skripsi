"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LockKeyhole, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { JitPanel } from "@/components/jit/jit-panel";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { DataPanel, EmptyState, KeyValue, PageHeader, Pill } from "@/components/ui/page";
import { useCsTicket, useMessages, useTicketUserProfile, useUpdateTicketStatus } from "@/services/queries";
import { useJitStore } from "@/store/jit";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { formatMoneyIDR } from "@/utils/format";

export default function CsTicketDetailPage() {
  const toast = useToastStore((s) => s.push);
  const params = useParams<{ id: string }>();
  const rawId = Number(params.id);
  const valid = Number.isFinite(rawId) && rawId > 0;
  const ticketId = valid ? rawId : 0;

  const ticketQ = useCsTicket(ticketId);
  const msgs = useMessages(ticketId, "cs");
  const profile = useTicketUserProfile(ticketId);
  const updateStatus = useUpdateTicketStatus();
  const clearTicketJit = useJitStore((s) => s.clearTicket);

  const nextStatuses =
    ticketQ.data?.status === "CLAIMED"
      ? ["IN_PROGRESS"]
      : ticketQ.data?.status === "IN_PROGRESS"
        ? ["RESOLVED"]
        : ticketQ.data?.status === "RESOLVED"
          ? ["CLOSED"]
          : [];

  const kyc = useMemo(() => {
    const data = profile.data?.kycData;
    if (typeof data === "object" && data !== null) return data as Record<string, unknown>;
    return {};
  }, [profile.data]);

  const profileLocked = profile.data?.exposureState !== "PARTIAL_AFTER_JIT";

  if (!valid) {
    return (
      <div>
        <Topbar title="Ticket" subtitle="ID ticket tidak valid" />
        <EmptyState
          title="Ticket tidak ditemukan"
          description="Kembali ke daftar assignment untuk memilih ticket yang valid."
          action={
            <Link href="/cs/my-tickets">
              <Button variant="secondary">Kembali</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Topbar title={`Ticket #${ticketId}`} subtitle="Workspace CS dengan status, chat, profil, dan JIT" />
      <PageHeader
        eyebrow="Operational workspace"
        title={`Penanganan ticket #${ticketId}`}
        description="Alur kerja ini memperlihatkan bagaimana RBAC, assignment ticket, status IN_PROGRESS, dan JIT saling membatasi akses CS."
        actions={
          <Link href="/cs/my-tickets">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Assignment
            </Button>
          </Link>
        }
        meta={
          <>
            <StatusBadge status={ticketQ.data?.status ?? "CLAIMED"} />
            <Pill tone={profileLocked ? "warning" : "success"}>{profileLocked ? "Profil terkunci" : "Profil terbuka via JIT"}</Pill>
          </>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[0.42fr_1fr]">
        <div className="space-y-5">
          <DataPanel title="Lifecycle ticket" description="Status menentukan kapan JIT dapat diuji.">
            <div className="space-y-3">
              <KeyValue label="Ticket" value={`#${ticketId}`} />
              <KeyValue label="Status saat ini" value={ticketQ.data?.status ?? "Memuat"} />
              <KeyValue label="User ID" value={ticketQ.data?.userId ?? "-"} />
              {ticketQ.isError ? <div className="text-sm text-rose-700">{getErrorMessage(ticketQ.error, "Gagal memuat ticket")}</div> : null}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className="text-xs font-semibold uppercase text-slate-500">Transisi status</label>
                <Select
                  value=""
                  disabled={updateStatus.isPending || nextStatuses.length === 0 || ticketQ.isLoading}
                  onChange={async (e) => {
                    const status = e.target.value;
                    if (!status) return;
                    try {
                      await updateStatus.mutateAsync({ ticketId, status });
                      await ticketQ.refetch();
                      if (status === "CLOSED") clearTicketJit(ticketId);
                      toast({ kind: "success", title: "Status diperbarui", detail: status });
                    } catch (err) {
                      toast({ kind: "error", title: "Gagal memperbarui status", detail: getErrorMessage(err, "Update status gagal") });
                    }
                  }}
                  className="mt-2"
                >
                  <option value="" disabled>
                    {nextStatuses.length > 0 ? "Pilih status berikutnya" : "Tidak ada transisi"}
                  </option>
                  {nextStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
                <div className="mt-2 text-xs leading-5 text-slate-500">JIT hanya disetujui backend ketika status ticket IN_PROGRESS.</div>
              </div>
            </div>
          </DataPanel>

          <DataPanel title="Profil pengguna" description="Data sensitif tetap terkunci sampai ada sesi JIT yang valid.">
            {profile.isLoading ? <div className="text-sm text-slate-500">Memuat profil...</div> : null}
            {profile.isError ? <div className="text-sm text-rose-700">{getErrorMessage(profile.error, "Gagal memuat profil")}</div> : null}
            {!profile.isLoading && !profile.isError ? (
              <div className="space-y-3">
                {profileLocked ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <LockKeyhole className="h-5 w-5 text-amber-700" />
                    <div className="mt-2 font-semibold text-slate-950">Profil masih terkunci</div>
                    <div className="mt-1 text-sm leading-6 text-amber-900">
                      Request JIT untuk VIEW_KYC atau fitur sensitif lain setelah status IN_PROGRESS.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <KeyValue label="Nomor telepon" value={profile.data?.phone ?? "-"} />
                    <KeyValue label="Saldo" value={formatMoneyIDR(Number(profile.data?.balance ?? 0))} />
                    {Object.entries(kyc).slice(0, 4).map(([key, value]) => (
                      <KeyValue key={key} label={String(key).replace(/_/g, " ")} value={String(value ?? "-")} />
                    ))}
                  </div>
                )}
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={async () => {
                    try {
                      await profile.refetch();
                      toast({ kind: "success", title: "Profil diperbarui" });
                    } catch (error) {
                      toast({ kind: "error", title: "Refresh gagal", detail: getErrorMessage(error, "Refresh gagal") });
                    }
                  }}
                  disabled={profile.isFetching}
                >
                  <RefreshCw className="h-4 w-4" />
                  {profile.isFetching ? "Memuat ulang..." : "Refresh profil"}
                </Button>
              </div>
            ) : null}
          </DataPanel>
        </div>

        <div className="space-y-5">
          {msgs.isError ? (
            <DataPanel title="Percakapan gagal dimuat" description={getErrorMessage(msgs.error, "Gagal memuat pesan")}>
              <Link href="/cs/my-tickets">
                <Button variant="secondary">Kembali</Button>
              </Link>
            </DataPanel>
          ) : (
            <ChatPanel ticketId={ticketId} initial={msgs.data ?? []} role="cs" />
          )}

          <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            <DataPanel title="Kontrol akses" description="Ringkasan syarat yang sedang berlaku.">
              <div className="space-y-3">
                {[
                  { icon: UserRound, title: "CS terverifikasi", desc: "RBAC memberi akses ke area CS." },
                  { icon: ShieldCheck, title: "Ticket assigned", desc: "Backend membatasi data sesuai ticket ini." },
                  { icon: LockKeyhole, title: "JIT sementara", desc: "Aksi sensitif harus punya sesi aktif." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <Icon className="h-5 w-5 text-emerald-700" />
                      <div className="mt-2 font-semibold text-slate-950">{item.title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </DataPanel>
            <JitPanel ticketId={ticketId} ticketStatus={ticketQ.data?.status} />
          </div>
        </div>
      </section>
    </div>
  );
}
