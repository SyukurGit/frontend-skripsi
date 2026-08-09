"use client";

import * as React from "react";
import {
  Check,
  Clock3,
  Eye,
  Hash,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Unlock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Pill } from "@/components/ui/page";
import { ticketStatusLabel } from "@/components/ui/badge";
import { useCountdown } from "@/hooks/use-countdown";
import { useRequestJit, useSensitiveAction } from "@/services/queries";
import { useJitStore, type JitFeature } from "@/store/jit";
import { useToastStore } from "@/store/toast";
import type { TicketStatus } from "@/types/api";
import { getErrorMessage } from "@/utils/api-error";
import { formatDurationMs } from "@/utils/format";
import { cn } from "@/utils/cn";

const features: {
  key: JitFeature;
  label: string;
  description: string;
  icon: typeof Eye;
}[] = [
  { key: "VIEW_KYC", label: "Lihat data KYC", description: "Membuka sebagian data profil yang relevan dan tetap dimasking.", icon: Eye },
  { key: "RESET_PASSWORD", label: "Reset password", description: "Mengganti password pengguna pada konteks ticket.", icon: KeyRound },
  { key: "UNBLOCK_ACCOUNT", label: "Buka blokir", description: "Mengaktifkan kembali akun pengguna yang terblokir.", icon: Unlock },
  { key: "CHANGE_EMAIL", label: "Ubah email", description: "Mengubah email akun pengguna.", icon: Mail },
  { key: "RESET_PIN", label: "Reset PIN", description: "Mengganti PIN transaksi pengguna.", icon: Hash },
];

export function JitPanel({ ticketId, ticketStatus }: { ticketId: number; ticketStatus?: TicketStatus }) {
  const toast = useToastStore((state) => state.push);
  const requestJit = useRequestJit(ticketId);
  const setSession = useJitStore((state) => state.set);
  const isActive = useJitStore((state) => state.isActive);
  const clear = useJitStore((state) => state.clear);
  const [feature, setFeature] = React.useState<JitFeature>("VIEW_KYC");
  const [decision, setDecision] = React.useState<{ ok: boolean; message: string } | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPin, setNewPin] = React.useState("");

  const selected = features.find((item) => item.key === feature) ?? features[0];
  const SelectedIcon = selected.icon;
  const session = useJitStore((state) => state.get(ticketId, feature));
  const countdown = useCountdown(session ? new Date(session.expiredAt).getTime() : 0);
  const active = isActive(ticketId, feature);
  const canRequestJit = ticketStatus === "IN_PROGRESS";
  const resetPassword = useSensitiveAction(ticketId, "reset-password");
  const unblock = useSensitiveAction(ticketId, "unblock-account");
  const changeEmail = useSensitiveAction(ticketId, "change-email");
  const resetPin = useSensitiveAction(ticketId, "reset-pin");

  React.useEffect(() => {
    if (!session) return;
    const delay = Math.max(0, new Date(session.expiredAt).getTime() - Date.now());
    const timer = window.setTimeout(() => clear(ticketId, feature), delay + 250);
    return () => window.clearTimeout(timer);
  }, [session, ticketId, feature, clear]);

  async function request() {
    if (!canRequestJit) return;
    setDecision(null);
    try {
      const response = await requestJit.mutateAsync(feature);
      setSession({ ticketId, feature, expiredAt: response.expired_at });
      setDecision({ ok: true, message: "Backend menerbitkan session setelah seluruh validasi konteks terpenuhi." });
      toast({ kind: "success", title: "Session JIT diterbitkan", detail: `${selected.label} aktif sementara.` });
    } catch (error) {
      const message = getErrorMessage(error, "Permintaan session JIT ditolak");
      setDecision({ ok: false, message });
      toast({ kind: "error", title: "Session JIT tidak diterbitkan", detail: message });
    }
  }

  async function runSensitiveAction() {
    try {
      if (feature === "RESET_PASSWORD") {
        await resetPassword.mutateAsync({ new_password: newPassword });
        setNewPassword("");
      } else if (feature === "UNBLOCK_ACCOUNT") {
        await unblock.mutateAsync({});
      } else if (feature === "CHANGE_EMAIL") {
        await changeEmail.mutateAsync({ new_email: newEmail });
        setNewEmail("");
      } else if (feature === "RESET_PIN") {
        await resetPin.mutateAsync({ new_pin: newPin });
        setNewPin("");
      }
      clear(ticketId, feature);
      setDecision({ ok: true, message: "Aksi berhasil dan session untuk feature ini telah dikonsumsi." });
      toast({ kind: "success", title: "Aksi sensitif berhasil", detail: `${selected.label}; session telah dikonsumsi.` });
    } catch (error) {
      toast({ kind: "error", title: "Aksi sensitif gagal", detail: getErrorMessage(error, "Aksi sensitif gagal") });
    }
  }

  const pending = resetPassword.isPending || unblock.isPending || changeEmail.isPending || resetPin.isPending;
  const inputValid =
    feature === "RESET_PASSWORD"
      ? newPassword.trim().length >= 8
      : feature === "CHANGE_EMAIL"
        ? newEmail.trim().length > 0
        : feature === "RESET_PIN"
          ? /^\d{4,}$/.test(newPin.trim())
          : true;

  return (
    <section className="overflow-hidden rounded-lg border border-[#dfe3e8] bg-white">
      <div className="border-b border-[#e9ecf0] px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#252932]">
              <LockKeyhole className="h-4 w-4 text-[var(--brand)]" />
              Just-In-Time Access
            </div>
            <p className="mt-1 text-xs leading-5 text-[#7b8492]">Session maksimal 15 menit, berlaku untuk satu feature, dan dikonsumsi setelah digunakan.</p>
          </div>
          <Pill tone={active ? "success" : canRequestJit ? "neutral" : "warning"}>
            {active ? formatDurationMs(countdown) : canRequestJit ? "Siap" : ticketStatusLabel[ticketStatus ?? "CLAIMED"]}
          </Pill>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <div>
          <label className="text-xs font-semibold text-[#596170]">Feature sensitif</label>
          <Select
            value={feature}
            onChange={(event) => {
              setFeature(event.target.value as JitFeature);
              setDecision(null);
            }}
            className="mt-2"
          >
            {features.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </Select>
          <p className="mt-2 text-xs leading-5 text-[#7b8492]">{selected.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-[#dfe3e8] bg-[#dfe3e8]">
          <ValidationCell label="Assignment" valid />
          <ValidationCell label="Status" valid={canRequestJit} />
          <ValidationCell label="Feature" valid />
        </div>

        <Button onClick={() => void request()} disabled={!canRequestJit || requestJit.isPending || active} className="w-full">
          {requestJit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {active ? "Session sedang aktif" : canRequestJit ? "Minta session JIT" : `Butuh status ${ticketStatusLabel.IN_PROGRESS}`}
        </Button>

        {decision ? (
          <div className={cn("flex gap-2 border-l-2 px-3 py-2.5 text-xs leading-5", decision.ok ? "border-[#3a8a63] bg-[#eef7f2] text-[#236847]" : "border-[#c83243] bg-[#fff1f3] text-[#a92637]")}>
            {decision.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{decision.message}</span>
          </div>
        ) : null}

        <div className="border-t border-[#e9ecf0] pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[#252932]">Gunakan feature</div>
              <div className="mt-0.5 text-xs text-[#7b8492]">{selected.label}</div>
            </div>
            <Pill tone={active ? "success" : "neutral"}>{active ? "Session aktif" : "Terkunci"}</Pill>
          </div>

          {feature === "VIEW_KYC" ? (
            <div className="border border-[#dfe3e8] bg-[#f8fafc] p-3 text-xs leading-5 text-[#667085]">
              Setelah session aktif, gunakan tombol muat ulang pada profil pengguna. Backend akan mengonsumsi session ketika data diakses.
            </div>
          ) : null}
          {feature === "RESET_PASSWORD" ? (
            <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Password baru, minimal 8 karakter" />
          ) : null}
          {feature === "CHANGE_EMAIL" ? (
            <Input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} placeholder="email-baru@example.com" />
          ) : null}
          {feature === "RESET_PIN" ? (
            <Input inputMode="numeric" value={newPin} onChange={(event) => setNewPin(event.target.value.replace(/\D/g, ""))} placeholder="PIN baru, minimal 4 digit" />
          ) : null}
          {feature === "UNBLOCK_ACCOUNT" ? (
            <div className="border border-[#dfe3e8] bg-[#f8fafc] p-3 text-xs leading-5 text-[#667085]">Tidak ada data tambahan yang diperlukan untuk membuka blokir akun.</div>
          ) : null}

          {feature !== "VIEW_KYC" ? (
            <Button variant="secondary" onClick={() => void runSensitiveAction()} disabled={!active || !inputValid || pending} className="mt-3 w-full">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectedIcon className="h-4 w-4" />}
              Jalankan {selected.label.toLowerCase()}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ValidationCell({ label, valid }: { label: string; valid: boolean }) {
  return (
    <div className="bg-[#f8fafc] px-2 py-2.5 text-center">
      <div className={cn("mx-auto flex h-5 w-5 items-center justify-center rounded-full", valid ? "bg-[#edf4ff] text-[#1769e0]" : "bg-[#fff8e9] text-[#a85d00]")}>
        {valid ? <Check className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
      </div>
      <div className="mt-1 text-[10px] font-medium text-[#667085]">{label}</div>
    </div>
  );
}
