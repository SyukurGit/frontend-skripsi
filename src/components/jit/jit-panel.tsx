"use client";

import * as React from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, Input } from "@/components/ui/input";
import { useRequestJit, useSensitiveAction } from "@/services/queries";
import { useJitStore, type JitFeature } from "@/store/jit";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { formatDurationMs } from "@/utils/format";
import { useCountdown } from "@/hooks/use-countdown";

type StepState = "idle" | "checking" | "passed" | "failed";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const features: { key: JitFeature; label: string }[] = [
  { key: "RESET_PASSWORD", label: "Reset Password" },
  { key: "UNBLOCK_ACCOUNT", label: "Unblock Account" },
  { key: "CHANGE_EMAIL", label: "Change Email" },
  { key: "RESET_PIN", label: "Reset PIN" },
  { key: "VIEW_KYC", label: "Open Full KYC" },
];

export function JitPanel({ ticketId }: { ticketId: number }) {
  const toast = useToastStore((s) => s.push);
  const req = useRequestJit(ticketId);
  const set = useJitStore((s) => s.set);
  const isActive = useJitStore((s) => s.isActive);
  const clear = useJitStore((s) => s.clear);

  const [feature, setFeature] = React.useState<JitFeature>("RESET_PASSWORD");
  const [lastDecision, setLastDecision] = React.useState<"idle" | "granted" | "rejected">("idle");
  const [decisionMessage, setDecisionMessage] = React.useState<string>("");
  const [stepStates, setStepStates] = React.useState<StepState[]>(["idle", "idle", "idle", "idle", "idle"]);

  const session = useJitStore((s) => s.get(ticketId, feature));

  const targetEpochMs = session ? new Date(session.expiredAt).getTime() : 0;
  const countdown = useCountdown(targetEpochMs);

  const active = isActive(ticketId, feature);

  React.useEffect(() => {
    if (!session) return;
    const exp = new Date(session.expiredAt).getTime();
    const ms = Math.max(0, exp - Date.now());
    const t = window.setTimeout(() => clear(ticketId, feature), ms + 250);
    return () => window.clearTimeout(t);
  }, [session, ticketId, feature, clear]);

  // Forms for sensitive actions
  const resetPwd = useSensitiveAction(ticketId, "reset-password");
  const unblock = useSensitiveAction(ticketId, "unblock-account");
  const changeEmail = useSensitiveAction(ticketId, "change-email");
  const resetPin = useSensitiveAction(ticketId, "reset-pin");
  const [newPassword, setNewPassword] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPin, setNewPin] = React.useState("");

  async function request() {
    setLastDecision("idle");
    setDecisionMessage("");
    setStepStates(["checking", "idle", "idle", "idle", "idle"]);
    await wait(380);
    setStepStates(["passed", "checking", "idle", "idle", "idle"]);
    await wait(380);
    setStepStates(["passed", "passed", "checking", "idle", "idle"]);
    await wait(420);
    try {
      const res = await req.mutateAsync(feature);
      set({ ticketId, feature, expiredAt: res.expired_at });
      setLastDecision("granted");
      setDecisionMessage(`Sesi akses sementara berhasil dibentuk untuk fitur ${feature} sampai ${new Date(res.expired_at).toLocaleTimeString()}.`);
      setStepStates(["passed", "passed", "passed", "checking", "idle"]);
      await wait(320);
      setStepStates(["passed", "passed", "passed", "passed", "checking"]);
      await wait(320);
      setStepStates(["passed", "passed", "passed", "passed", "passed"]);
      toast({ kind: "success", title: "Akses sementara aktif", detail: `${feature} aktif sampai ${new Date(res.expired_at).toLocaleTimeString()}` });
    } catch (e: unknown) {
      setLastDecision("rejected");
      setDecisionMessage(getErrorMessage(e, "Permintaan akses sementara ditolak karena konteks tiket atau syarat akses belum terpenuhi."));
      setStepStates((prev) => {
        const next = [...prev];
        const failedIndex = next.findIndex((item) => item === "checking");
        if (failedIndex >= 0) next[failedIndex] = "failed";
        return next;
      });
      toast({ kind: "error", title: "Permintaan JIT ditolak", detail: getErrorMessage(e, "Permintaan JIT ditolak") });
    }
  }

  const explanationSteps = [
    { label: "Sistem memverifikasi bahwa tiket ini benar-benar ditugaskan kepada CS yang sedang login", hint: "Pada tahap ini, pembatasan akses sudah bergerak melampaui RBAC dasar karena backend juga menilai konteks penugasan." },
    { label: "Sistem memeriksa apakah status tiket masih berada dalam kondisi aktif untuk penanganan", hint: "Permintaan akses tidak dapat diproses jika tiket sudah tidak relevan secara operasional." },
    { label: "Sistem memvalidasi bahwa fitur sensitif yang diminta sesuai dengan daftar kontrol yang diizinkan", hint: `Permintaan yang sedang diuji pada sesi ini adalah ${feature}.` },
    { label: "Jika semua syarat lolos, backend membentuk sesi Just-In-Time sementara", hint: active ? `Sesi saat ini sedang aktif dengan sisa waktu ${formatDurationMs(countdown)}.` : "Sesi ini bersifat sementara dan tidak menambah hak akses permanen pada akun CS." },
    { label: "Ketika waktu habis atau tiket ditutup, sesi akan dicabut secara otomatis oleh backend", hint: "Inilah implementasi pembatasan durasi akses yang menjadi inti mekanisme JIT." },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Akses sementara</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Tindakan lanjutan</div>
            <div className="mt-2 text-sm text-slate-500">Ajukan akses sementara hanya ketika penanganan tiket memang membutuhkan tindakan sensitif pada akun pengguna.</div>
          </div>
          <div className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold">
            {active ? `AKTIF ${formatDurationMs(countdown)}` : "TIDAK AKTIF"}
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pilih tindakan</label>
            <div className="mt-2">
              <Select value={feature} onChange={(e) => setFeature(e.target.value as JitFeature)}>
                {features.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={request} disabled={req.isPending}>
              {req.isPending ? "Memproses permintaan..." : "Ajukan akses sementara"}
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50/80 p-5">
            <div className="text-sm font-semibold text-slate-950">Urutan validasi backend sebelum akses diberikan</div>
            <div className="mt-1 text-sm text-slate-500">Panel ini disusun untuk keperluan demonstrasi, agar proses keputusan backend dapat dipahami langkah demi langkah secara visual.</div>
          <div className="mt-4 space-y-3">
            {explanationSteps.map((step, index) => {
              const state = stepStates[index];
              return (
              <div key={step.label} className="flex gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div
                  className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    state === "checking"
                      ? "scale-110 bg-amber-100 text-amber-700 animate-pulse"
                      : state === "passed"
                        ? "bg-emerald-100 text-emerald-700"
                        : state === "failed"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {state === "passed" ? "OK" : state === "failed" ? "X" : index + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-950">{step.label}</div>
                  <div className="mt-1 text-sm text-slate-500">{step.hint}</div>
                </div>
              </div>
              );
            })}
          </div>
          {lastDecision === "rejected" ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 transition-all duration-300">Permintaan JIT ditolak. {decisionMessage}</div> : null}
          {lastDecision === "granted" ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 transition-all duration-300">Permintaan JIT disetujui. {decisionMessage}</div> : null}
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold">Eksekusi fitur sensitif</div>
            <div className="mt-1 text-sm text-slate-500">Seluruh tindakan di bawah ini tetap memerlukan sesi akses sementara yang masih aktif.</div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reset password</div>
                <div className="mt-2 flex gap-2">
                  <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <Button
                    variant="secondary"
                    disabled={!isActive(ticketId, "RESET_PASSWORD") || resetPwd.isPending || newPassword.trim().length < 8}
                    onClick={async () => {
                      try {
                        await resetPwd.mutateAsync({ new_password: newPassword });
                        setNewPassword("");
                        toast({ kind: "success", title: "Password berhasil direset" });
                      } catch (error) {
                        toast({ kind: "error", title: "Reset password gagal", detail: getErrorMessage(error, "Reset password gagal") });
                      }
                    }}
                  >
                    Jalankan
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Buka blokir akun</div>
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    disabled={!isActive(ticketId, "UNBLOCK_ACCOUNT") || unblock.isPending}
                    onClick={async () => {
                      try {
                        await unblock.mutateAsync({});
                        toast({ kind: "success", title: "Akun berhasil dibuka blokirnya" });
                      } catch (error) {
                        toast({ kind: "error", title: "Buka blokir gagal", detail: getErrorMessage(error, "Buka blokir gagal") });
                      }
                    }}
                  >
                    Buka blokir
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ubah email</div>
                <div className="mt-2 flex gap-2">
                  <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  <Button
                    variant="secondary"
                    disabled={!isActive(ticketId, "CHANGE_EMAIL") || changeEmail.isPending || newEmail.trim() === ""}
                    onClick={async () => {
                      try {
                        await changeEmail.mutateAsync({ new_email: newEmail });
                        setNewEmail("");
                        toast({ kind: "success", title: "Email berhasil diperbarui" });
                      } catch (error) {
                        toast({ kind: "error", title: "Perubahan email gagal", detail: getErrorMessage(error, "Perubahan email gagal") });
                      }
                    }}
                  >
                    Jalankan
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reset PIN</div>
                <div className="mt-2 flex gap-2">
                  <Input value={newPin} onChange={(e) => setNewPin(e.target.value)} />
                  <Button
                    variant="secondary"
                    disabled={!isActive(ticketId, "RESET_PIN") || resetPin.isPending || newPin.trim().length < 4}
                    onClick={async () => {
                      try {
                        await resetPin.mutateAsync({ new_pin: newPin });
                        setNewPin("");
                        toast({ kind: "success", title: "PIN berhasil direset" });
                      } catch (error) {
                        toast({ kind: "error", title: "Reset PIN gagal", detail: getErrorMessage(error, "Reset PIN gagal") });
                      }
                    }}
                  >
                    Jalankan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
