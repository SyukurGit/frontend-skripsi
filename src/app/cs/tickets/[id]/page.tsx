"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { Topbar } from "@/components/shell/topbar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { JitPanel } from "@/components/jit/jit-panel";
import { useCsTicket, useMessages, useTicketUserProfile, useUpdateTicketStatus } from "@/services/queries";
import { useJitStore } from "@/store/jit";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { useMemo } from "react";

export default function CsTicketDetailPage() {
  const toast = useToastStore((s) => s.push);
  const params = useParams<{ id: string }>();
  const rawId = Number(params.id);
  const valid = Number.isFinite(rawId) && rawId > 0;
  const ticketId = valid ? rawId : 0;

  const ticketQ = useCsTicket(ticketId);
  const msgs = useMessages(ticketId, "cs");
  const profile = useTicketUserProfile(ticketId);
  const upd = useUpdateTicketStatus();
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
    const d = profile.data?.kycData;
    if (typeof d === "object" && d !== null) return d as Record<string, unknown>;
    return {};
  }, [profile.data]);

  const profileLocked = profile.data?.exposureState !== "PARTIAL_AFTER_JIT";

  if (!valid) {
    return (
      <div>
        <Topbar title="Tiket" subtitle="ID tiket tidak valid" />
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Tiket tidak ditemukan</div>
          </CardHeader>
          <CardBody className="pt-4">
            <Link href="/cs/my-tickets">
              <Button variant="secondary">Kembali ke daftar</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Topbar title={`Ticket #${ticketId}`} subtitle="Kelola percakapan dan status tiket" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Status Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tiket</div>
            <div className="mt-2 text-xl font-bold text-slate-950">Status & Aksi</div>
          </CardHeader>
          <CardBody className="space-y-4 pt-4">
            {/* Current Status */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-600">Status saat ini</div>
              <StatusBadge status={ticketQ.data?.status ?? "CLAIMED"} />
            </div>

            {/* Status Update */}
            {ticketQ.isError ? (
              <div className="text-sm text-red-600">{getErrorMessage(ticketQ.error, "Gagal memuat tiket")}</div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-semibold text-slate-700">Lanjutkan ke status</label>
                <Select
                  value=""
                  disabled={upd.isPending || nextStatuses.length === 0 || ticketQ.isLoading}
                  onChange={async (e) => {
                    const status = e.target.value;
                    if (!status) return;
                    try {
                      await upd.mutateAsync({ ticketId, status });
                      await ticketQ.refetch();
                      if (status === "CLOSED") clearTicketJit(ticketId);
                      toast({ kind: "success", title: "Status diperbarui", detail: status });
                    } catch (err) {
                      toast({ kind: "error", title: "Gagal", detail: getErrorMessage(err, "Update status gagal") });
                    }
                  }}
                  className="mt-2"
                >
                  <option value="" disabled>
                    {nextStatuses.length > 0 ? "Pilih status berikutnya" : "Tiket tertutup"}
                  </option>
                  {nextStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Back Button */}
            <Link href="/cs/my-tickets" className="block">
              <Button variant="secondary" className="w-full">Kembali</Button>
            </Link>
          </CardBody>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat */}
          {valid && msgs.isError ? (
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold text-slate-950">Percakapan gagal dimuat</div>
              </CardHeader>
            </Card>
          ) : valid && !msgs.isError ? (
            <ChatPanel ticketId={ticketId} initial={msgs.data ?? []} role="cs" />
          ) : null}

          {/* Profile & JIT */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* User Profile */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Profil</div>
                    <div className="mt-2 text-lg font-bold text-slate-950">Informasi pengguna</div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${profileLocked ? 'border border-amber-200 bg-amber-50 text-amber-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                    {profileLocked ? "TERKUNCI" : "TERBUKA"}
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 pt-4">
                {profile.isLoading ? (
                  <div className="text-sm text-slate-500">Memuat data...</div>
                ) : profile.isError ? (
                  <div className="text-sm text-red-600">{getErrorMessage(profile.error, "Gagal memuat")}</div>
                ) : profileLocked ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="text-sm font-semibold text-amber-900">Data pengguna terkunci</div>
                    <p className="mt-1 text-xs text-amber-800">Gunakan JIT untuk membuka akses data sensitif.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-semibold uppercase text-slate-500">Nomor telepon</div>
                      <div className="mt-1 font-semibold text-slate-900">{profile.data?.phone ?? "-"}</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-semibold uppercase text-slate-500">Saldo</div>
                      <div className="mt-1 font-semibold text-slate-900">Rp {Number(profile.data?.balance ?? 0).toLocaleString("id-ID")}</div>
                    </div>
                    {Object.entries(kyc).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs font-semibold uppercase text-slate-500">{String(key).replace(/_/g, " ")}</div>
                        <div className="mt-1 text-sm text-slate-900">{String(value ?? "-")}</div>
                      </div>
                    ))}
                  </div>
                )}
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={async () => {
                    try {
                      await profile.refetch();
                      toast({ kind: "success", title: "Data diperbarui" });
                    } catch (error) {
                      toast({ kind: "error", title: "Gagal", detail: getErrorMessage(error, "Refresh gagal") });
                    }
                  }}
                  disabled={profile.isFetching}
                >
                  {profile.isFetching ? "Memuat ulang..." : "Perbarui"}
                </Button>
              </CardBody>
            </Card>

            {/* JIT Panel */}
            {valid ? <JitPanel ticketId={ticketId} ticketStatus={ticketQ.data?.status} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
