"use client";

import * as React from "react";
import { CheckCircle2, Eye, Hash, KeyRound, Loader2, Mail, ShieldCheck, TimerReset, Unlock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Pill } from "@/components/ui/page";
import { useCountdown } from "@/hooks/use-countdown";
import { useRequestJit, useSensitiveAction } from "@/services/queries";
import { useJitStore, type JitFeature } from "@/store/jit";
import { useToastStore } from "@/store/toast";
import type { TicketStatus } from "@/types/api";
import { getErrorMessage } from "@/utils/api-error";
import { formatDurationMs } from "@/utils/format";

type StepState = "idle" | "checking" | "passed" | "failed";

const features: { key: JitFeature; label: string; desc: string }[] = [
  { key: "VIEW_KYC", label: "Buka KYC", desc: "Membuka profil detail pengguna secara sementara." },
  { key: "RESET_PASSWORD", label: "Reset password", desc: "Mengganti password pengguna pada konteks ticket." },
  { key: "UNBLOCK_ACCOUNT", label: "Buka blokir", desc: "Mengaktifkan kembali akun yang terblokir." },
  { key: "CHANGE_EMAIL", label: "Ubah email", desc: "Mengubah email akun pengguna." },
  { key: "RESET_PIN", label: "Reset PIN", desc: "Mengganti PIN transaksi pengguna." },
];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function JitPanel({ ticketId, ticketStatus }: { ticketId: number; ticketStatus?: TicketStatus }) {
  const toast = useToastStore((s) => s.push);
  const requestJit = useRequestJit(ticketId);
  const setSession = useJitStore((s) => s.set);
  const isActive = useJitStore((s) => s.isActive);
  const clear = useJitStore((s) => s.clear);

  const [feature, setFeature] = React.useState<JitFeature>("VIEW_KYC");
  const [decision, setDecision] = React.useState<"idle" | "granted" | "rejected">("idle");
  const [decisionMessage, setDecisionMessage] = React.useState("");
  const [stepStates, setStepStates] = React.useState<StepState[]>(["idle", "idle", "idle"]);
  const [newPassword, setNewPassword] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPin, setNewPin] = React.useState("");

  const session = useJitStore((s) => s.get(ticketId, feature));
  const targetEpochMs = session ? new Date(session.expiredAt).getTime() : 0;
  const countdown = useCountdown(targetEpochMs);
  const active = isActive(ticketId, feature);
  const canRequestJit = ticketStatus === "IN_PROGRESS";
  const selectedFeature = features.find((item) => item.key === feature) ?? features[0];

  const resetPwd = useSensitiveAction(ticketId, "reset-password");
  const unblock = useSensitiveAction(ticketId, "unblock-account");
  const changeEmail = useSensitiveAction(ticketId, "change-email");
  const resetPin = useSensitiveAction(ticketId, "reset-pin");

  React.useEffect(() => {
    if (!session) return;
    const exp = new Date(session.expiredAt).getTime();
    const ms = Math.max(0, exp - Date.now());
    const t = window.setTimeout(() => clear(ticketId, feature), ms + 250);
    return () => window.clearTimeout(t);
  }, [session, ticketId, feature, clear]);

  async function request() {
    if (!canRequestJit) {
      setDecision("rejected");
      setDecisionMessage("Backend menolak karena status ticket belum IN_PROGRESS.");
      setStepStates(["passed", "failed", "idle"]);
      toast({ kind: "error", title: "JIT ditolak", detail: "Ubah status ticket ke IN_PROGRESS terlebih dahulu." });
      return;
    }

    setDecision("idle");
    setDecisionMessage("");
    setStepStates(["checking", "idle", "idle"]);
    await wait(260);
    setStepStates(["passed", "checking", "idle"]);
    await wait(260);
    setStepStates(["passed", "passed", "checking"]);

    try {
      const res = await requestJit.mutateAsync(feature);
      setSession({ ticketId, feature, expiredAt: res.expired_at });
      setDecision("granted");
      setDecisionMessage(`Sesi aktif sampai ${new Date(res.expired_at).toLocaleTimeString("id-ID")}.`);
      setStepStates(["passed", "passed", "passed"]);
      toast({ kind: "success", title: "JIT aktif", detail: `${selectedFeature.label} aktif sementara.` });
    } catch (e: unknown) {
      setDecision("rejected");
      setDecisionMessage(getErrorMessage(e, "Permintaan akses sementara ditolak."));
      setStepStates(["passed", "passed", "failed"]);
      toast({ kind: "error", title: "JIT ditolak", detail: getErrorMessage(e, "Permintaan JIT ditolak") });
    }
  }

  async function runSensitiveAction(kind: JitFeature) {
    try {
      if (kind === "RESET_PASSWORD") {
        await resetPwd.mutateAsync({ new_password: newPassword });
        setNewPassword("");
      }
      if (kind === "UNBLOCK_ACCOUNT") {
        await unblock.mutateAsync({});
      }
      if (kind === "CHANGE_EMAIL") {
        await changeEmail.mutateAsync({ new_email: newEmail });
        setNewEmail("");
      }
      if (kind === "RESET_PIN") {
        await resetPin.mutateAsync({ new_pin: newPin });
        setNewPin("");
      }
      clear(ticketId, kind);
      toast({ kind: "success", title: "Aksi sensitif berhasil", detail: kind });
    } catch (error) {
      toast({ kind: "error", title: "Aksi sensitif gagal", detail: getErrorMessage(error, "Aksi sensitif gagal") });
    }
  }

  const steps = [
    { label: "Assignment valid", desc: "Ticket harus terikat ke CS yang sedang login." },
    { label: "Status IN_PROGRESS", desc: "Backend menolak JIT di luar status penanganan." },
    { label: "Fitur diizinkan", desc: "Akses diberikan hanya untuk fitur yang diminta." },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-950">Just-In-Time access</div>
            <div className="mt-1 text-sm leading-6 text-slate-500">Akses sensitif sementara berdasarkan ticket, status, dan fitur.</div>
          </div>
          <Pill tone={active ? "success" : canRequestJit ? "neutral" : "warning"}>
            {active ? `Aktif ${formatDurationMs(countdown)}` : canRequestJit ? "Siap diajukan" : "Butuh IN_PROGRESS"}
          </Pill>
        </div>
      </div>
      <CardBody className="pt-5">
        <div className="grid gap-3">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Fitur sensitif</label>
            <Select value={feature} onChange={(e) => setFeature(e.target.value as JitFeature)} className="mt-2">
              {features.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </Select>
            <div className="mt-2 text-sm leading-6 text-slate-500">{selectedFeature.desc}</div>
          </div>
          <Button onClick={request} disabled={requestJit.isPending || !canRequestJit}>
            {requestJit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {requestJit.isPending ? "Memvalidasi..." : canRequestJit ? "Ajukan JIT" : "Ubah ke IN_PROGRESS"}
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {steps.map((step, index) => {
            const state = stepStates[index];
            return (
              <div key={step.label} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mt-0.5">
                  {state === "checking" ? <Loader2 className="h-5 w-5 animate-spin text-amber-600" /> : null}
                  {state === "passed" ? <CheckCircle2 className="h-5 w-5 text-emerald-700" /> : null}
                  {state === "failed" ? <XCircle className="h-5 w-5 text-rose-700" /> : null}
                  {state === "idle" ? <TimerReset className="h-5 w-5 text-slate-400" /> : null}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-950">{step.label}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {decision !== "idle" ? (
          <div className={`mt-4 rounded-lg border p-4 text-sm leading-6 ${decision === "granted" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"}`}>
            {decision === "granted" ? "Permintaan disetujui. " : "Permintaan ditolak. "}
            {decisionMessage}
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          <div className="text-sm font-semibold text-slate-950">Eksekusi fitur sensitif</div>
          <ActionRow
            icon={<Eye className="h-5 w-5" />}
            title="Buka KYC"
            desc="Request JIT VIEW_KYC lalu refresh profil di panel kiri."
            active={isActive(ticketId, "VIEW_KYC")}
          />
          <ActionRow
            icon={<KeyRound className="h-5 w-5" />}
            title="Reset password"
            desc="Minimal 8 karakter."
            active={isActive(ticketId, "RESET_PASSWORD")}
            input={<Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password baru" />}
            action={
              <Button size="sm" variant="secondary" disabled={!isActive(ticketId, "RESET_PASSWORD") || resetPwd.isPending || newPassword.trim().length < 8} onClick={() => void runSensitiveAction("RESET_PASSWORD")}>
                Jalankan
              </Button>
            }
          />
          <ActionRow
            icon={<Unlock className="h-5 w-5" />}
            title="Buka blokir"
            desc="Membutuhkan sesi UNBLOCK_ACCOUNT aktif."
            active={isActive(ticketId, "UNBLOCK_ACCOUNT")}
            action={
              <Button size="sm" variant="secondary" disabled={!isActive(ticketId, "UNBLOCK_ACCOUNT") || unblock.isPending} onClick={() => void runSensitiveAction("UNBLOCK_ACCOUNT")}>
                Jalankan
              </Button>
            }
          />
          <ActionRow
            icon={<Mail className="h-5 w-5" />}
            title="Ubah email"
            desc="Email baru dikirim ke backend."
            active={isActive(ticketId, "CHANGE_EMAIL")}
            input={<Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email-baru@example.com" />}
            action={
              <Button size="sm" variant="secondary" disabled={!isActive(ticketId, "CHANGE_EMAIL") || changeEmail.isPending || newEmail.trim() === ""} onClick={() => void runSensitiveAction("CHANGE_EMAIL")}>
                Jalankan
              </Button>
            }
          />
          <ActionRow
            icon={<Hash className="h-5 w-5" />}
            title="Reset PIN"
            desc="Minimal 4 digit."
            active={isActive(ticketId, "RESET_PIN")}
            input={<Input value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="PIN baru" />}
            action={
              <Button size="sm" variant="secondary" disabled={!isActive(ticketId, "RESET_PIN") || resetPin.isPending || newPin.trim().length < 4} onClick={() => void runSensitiveAction("RESET_PIN")}>
                Jalankan
              </Button>
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}

function ActionRow({
  icon,
  title,
  desc,
  active,
  input,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  active: boolean;
  input?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className={active ? "text-emerald-700" : "text-slate-400"}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-semibold text-slate-950">{title}</div>
            <Pill tone={active ? "success" : "neutral"}>{active ? "Aktif" : "Terkunci"}</Pill>
          </div>
          <div className="mt-1 text-sm leading-6 text-slate-500">{desc}</div>
          {input || action ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {input}
              {action}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
