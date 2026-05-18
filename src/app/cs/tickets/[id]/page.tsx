"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { ChatPanel } from "@/components/chat/chat-panel";
import { JitPanel } from "@/components/jit/jit-panel";
import { useCsTicket, useMessages, useTicketUserProfile, useUpdateTicketStatus } from "@/services/queries";
import { useJitStore } from "@/store/jit";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

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
  const [lpStates, setLpStates] = useState<Array<"idle" | "checking" | "passed">>(["idle", "idle", "idle"]);
  const currentTicket = ticketQ.data;
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
  const profileSections = useMemo(
    () => [
      {
        title: "Identitas terbatas",
        items: [
          { label: "Nama", value: String(kyc.full_name ?? "-") },
          { label: "NIK", value: String(kyc.nik ?? "-") },
          { label: "Profil lahir", value: String(kyc.birth_profile ?? "-") },
        ],
      },
      {
        title: "Profil akun",
        items: [
          { label: "Alamat", value: String(kyc.address ?? "-"), wide: true },
          { label: "Pekerjaan", value: String(kyc.occupation ?? "-" ) },
          { label: "Pendapatan", value: String(kyc.monthly_income_range ?? "-") },
        ],
      },
      {
        title: "Sinyal risiko",
        items: [
          { label: "Perangkat terakhir", value: String(kyc.recent_device ?? "-") },
          { label: "Bank terkait", value: String(kyc.linked_bank ?? "-") },
          { label: "Risk score", value: String(kyc.risk_score ?? "-") },
        ],
      },
    ],
    [kyc],
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!valid || !currentTicket) return;
      const steps: Array<"idle" | "checking" | "passed"> = ["idle", "idle", "idle"];
      for (let i = 0; i < steps.length; i++) {
        if (cancelled) return;
        steps[i] = "checking";
        setLpStates([...steps]);
        await new Promise((resolve) => window.setTimeout(resolve, 320));
        if (cancelled) return;
        steps[i] = "passed";
        setLpStates([...steps]);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [valid, currentTicket]);

  return (
    <div>
      <Topbar title={valid ? `Ticket #${ticketId}` : "Tiket"} subtitle={valid ? "Kelola percakapan, pembaruan status, dan demonstrasi kontrol akses internal" : "ID tiket tidak valid"} />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Panel tiket</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Pembaruan status</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="mb-3 flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status saat ini</div>
              <StatusBadge status={ticketQ.data?.status ?? "CLAIMED"} />
            </div>
            {ticketQ.isError ? <div className="mb-3 text-sm text-rose-700">{getErrorMessage(ticketQ.error, "Failed to load ticket")}</div> : null}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Lanjutkan proses</div>
              <div className="mt-2">
                <Select
                  value=""
                  disabled={upd.isPending || nextStatuses.length === 0 || ticketQ.isLoading || ticketQ.isError}
                  onChange={async (e) => {
                    const status = e.target.value;
                    if (!status) return;
                    try {
                      await upd.mutateAsync({ ticketId, status });
                      await ticketQ.refetch();
                      if (status === "CLOSED") clearTicketJit(ticketId);
                       toast({ kind: "success", title: "Status berhasil diperbarui", detail: `Status terbaru: ${status}` });
                     } catch (err: unknown) {
                       toast({ kind: "error", title: "Pembaruan status gagal", detail: getErrorMessage(err, "Pembaruan status gagal") });
                     }
                  }}
                >
                  <option value="" disabled>
                    {nextStatuses.length > 0 ? "Pilih status berikutnya" : "Tidak ada transisi lanjutan"}
                  </option>
                  {nextStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mt-3 text-xs text-slate-500">Urutan layanan: CLAIMED -&gt; IN_PROGRESS -&gt; RESOLVED -&gt; CLOSED.</div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link href="/cs/my-tickets">
                <Button variant="secondary">Kembali</Button>
              </Link>
            </div>

            <div className="mt-4 rounded-3xl border border-blue-100 bg-blue-50/80 p-5">
            <div className="text-sm font-semibold text-slate-950">Di mana Least Privilege mulai bekerja?</div>
            <div className="mt-2 space-y-3">
              {[
                  "Sistem tidak hanya memverifikasi role Customer Service, tetapi juga memastikan bahwa tiket ini memang ditugaskan kepada akun CS yang sedang login.",
                  "Data profil dan KYC yang tampil pada halaman ini hanya berasal dari pengguna yang terikat pada tiket aktif ini, sehingga ruang lingkup akses dipersempit secara kontekstual.",
                  "Karena itu, halaman kerja CS tidak menyediakan pencarian global ke nasabah lain. Inilah perbedaan utama antara Least Privilege dan RBAC dasar yang hanya berhenti pada level role.",
                ].map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm transition-all duration-300">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                        lpStates[index] === "checking"
                          ? "scale-110 bg-amber-100 text-amber-700 animate-pulse"
                          : lpStates[index] === "passed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {lpStates[index] === "passed" ? "OK" : index + 1}
                    </div>
                    <div className="text-sm text-slate-600">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {valid && msgs.isError ? (
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">Percakapan belum dapat dimuat</div>
                <div className="mt-1 text-sm text-slate-500">{getErrorMessage(msgs.error, "Percakapan belum dapat dimuat")}</div>
              </CardHeader>
            </Card>
          ) : null}
          {valid && !msgs.isError ? <ChatPanel ticketId={ticketId} initial={msgs.data ?? []} role="cs" /> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Profil pengguna</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Informasi akun terkait</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold">
                      {profileLocked ? "TERKUNCI" : "TERBUKA TERBATAS"}
                    </div>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        try {
                          await profile.refetch();
                          toast({ kind: "success", title: "Panel data diperbarui" });
                        } catch (error) {
                          toast({ kind: "error", title: "Pembaruan panel gagal", detail: getErrorMessage(error, "Pembaruan panel gagal") });
                        }
                      }}
                      disabled={profile.isFetching}
                    >
                      {profile.isFetching ? "Memuat ulang..." : "Muat ulang"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-4">
                {profile.isLoading ? (
                  <div className="text-sm text-slate-500">Memuat data pengguna...</div>
                ) : profile.isError ? (
                  <div className="text-sm text-rose-700">{getErrorMessage(profile.error, "Data pengguna belum dapat dimuat")}</div>
                ) : (
                  <div className="space-y-3">
                    {profileLocked ? (
                      <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5">
                        <div className="text-sm font-semibold text-slate-950">Data pengguna masih dikunci</div>
                        <div className="mt-2 text-sm leading-7 text-slate-600">{profile.data?.policyNote ?? "Customer Service harus lebih dulu mengajukan akses sementara agar backend dapat mengevaluasi apakah data ini layak dibuka."}</div>
                        <div className="mt-4 grid gap-3">
                          {[
                            "Nomor telepon disembunyikan sampai akses sementara disetujui.",
                            "Data KYC lanjutan tidak ditampilkan pada kondisi awal.",
                            "Jika izin diberikan, sistem hanya membuka sebagian data dengan masking tambahan.",
                          ].map((item) => (
                            <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">{item}</div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Nomor telepon</div>
                            <div className="mt-1 text-sm font-semibold">{profile.data?.phone ?? "-"}</div>
                          </div>
                          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Saldo terikat akun</div>
                            <div className="mt-1 text-sm font-semibold">Rp {Number(profile.data?.balance ?? 0).toLocaleString("id-ID")}</div>
                          </div>
                        </div>
                        {profileSections.map((section) => (
                          <div key={section.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{section.title}</div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              {section.items.map((item) => (
                                <div key={`${section.title}-${item.label}`} className={`rounded-2xl bg-white p-3 ${item.wide ? "md:col-span-2" : ""}`}>
                                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</div>
                                  <div className="mt-1 text-sm font-semibold text-slate-900">{item.value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="text-xs text-slate-500">Akses sementara telah disetujui, namun sistem tetap mempertahankan masking pada elemen identitas yang paling sensitif.</div>
                      </>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {valid ? <JitPanel ticketId={ticketId} /> : null}
          </div>

          {!valid ? (
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">Tiket tidak valid</div>
                <div className="mt-1 text-sm text-slate-500">Periksa kembali tautan tiket yang ingin dibuka.</div>
              </CardHeader>
              <CardBody className="pt-4">
                <Link href="/cs/my-tickets">
                  <Button variant="secondary">Kembali</Button>
                </Link>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
