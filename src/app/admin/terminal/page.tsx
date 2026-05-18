"use client";

import * as React from "react";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { useAdminTerminalLogs, useAdminTerminalTickets } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { getErrorMessage } from "@/utils/api-error";
import { connectWithRetry, wsUrl } from "@/lib/ws";
import { format } from "date-fns";
import type { TerminalLogEntry } from "@/types/api";

function logCategory(message: string) {
  if (message.includes("jit")) return { label: "JIT", cls: "bg-violet-500/15 text-violet-200 border-violet-400/30" };
  if (message.includes("chat message")) return { label: "CHAT", cls: "bg-sky-500/15 text-sky-200 border-sky-400/30" };
  if (message.includes("status")) return { label: "STATUS", cls: "bg-amber-500/15 text-amber-200 border-amber-400/30" };
  if (message.includes("sensitive")) return { label: "SENSITIVE", cls: "bg-rose-500/15 text-rose-200 border-rose-400/30" };
  return { label: "FLOW", cls: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30" };
}

function highlightBooleans(message: string) {
  return message.split(/(true|false)/g).map((part, index) => {
    if (part === "true") {
      return (
        <span key={index} className="font-semibold text-emerald-300">
          true
        </span>
      );
    }
    if (part === "false") {
      return (
        <span key={index} className="font-semibold text-rose-300">
          false
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function mergeTerminalLogs(base: TerminalLogEntry[], live: TerminalLogEntry[]) {
  const seen = new Set<string>();
  const merged: TerminalLogEntry[] = [];

  for (const entry of [...base, ...live]) {
    const key = entry.sequence > 0 ? `${entry.ticket_id}|${entry.sequence}` : `${entry.ticket_id}|${entry.timestamp}|${entry.level}|${entry.source}|${entry.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(entry);
  }

  return merged.sort((a, b) => {
    if (a.sequence > 0 && b.sequence > 0) return b.sequence - a.sequence;
    const timeDiff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (timeDiff !== 0) return timeDiff;
    return terminalPriority(b) - terminalPriority(a);
  });
}

function terminalPriority(entry: TerminalLogEntry) {
  const message = entry.message.toLowerCase();
  if (message.includes("jit request approved") || message.includes("jit request denied")) return 90;
  if (message.includes("validation summary")) return 80;
  const stepMatch = message.match(/validation step (\d+)/);
  if (stepMatch) {
    return Number(stepMatch[1]) * 10;
  }
  if (message.includes("jit request received")) return 5;
  return 0;
}

export default function AdminTerminalPage() {
  const token = useAuthStore((s) => s.token);
  const tickets = useAdminTerminalTickets();
  const rows = tickets.data ?? [];
  const [selectedTicketId, setSelectedTicketId] = React.useState<number | null>(null);
  const effectiveTicketId = selectedTicketId ?? rows[0]?.ticket_id ?? 0;
  const logs = useAdminTerminalLogs(effectiveTicketId);
  const [liveLogMap, setLiveLogMap] = React.useState<Record<number, TerminalLogEntry[]>>({});
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    if (!token || !effectiveTicketId) return;
    const conn = connectWithRetry({
      url: wsUrl(`/ws/admin/terminal/${effectiveTicketId}?token=${encodeURIComponent(token)}`),
      onOpen: () => setConnected(true),
      onClose: () => setConnected(false),
      onError: () => setConnected(false),
      onMessage: (ev) => {
        try {
          const parsed = JSON.parse(String(ev.data)) as { event?: string; payload?: unknown };
          if (parsed.event !== "terminal_log") return;
          const payload = parsed.payload as TerminalLogEntry;
          setLiveLogMap((prev) => {
            const current = prev[effectiveTicketId] ?? [];
            const key = payload.sequence > 0 ? `${payload.ticket_id}|${payload.sequence}` : `${payload.ticket_id}|${payload.timestamp}|${payload.level}|${payload.source}|${payload.message}`;
            const exists = current.some((entry) => (entry.sequence > 0 ? `${entry.ticket_id}|${entry.sequence}` : `${entry.ticket_id}|${entry.timestamp}|${entry.level}|${entry.source}|${entry.message}`) === key);
            const next = exists ? current : [...current, payload].slice(-200);
            return { ...prev, [effectiveTicketId]: next };
          });
        } catch {
          // ignore malformed log packet in UI
        }
      },
    });
    return () => conn.close();
  }, [token, effectiveTicketId]);

  const displayedLogs = React.useMemo(() => {
    const base = logs.data ?? [];
    const live = liveLogMap[effectiveTicketId] ?? [];
    return mergeTerminalLogs(base, live);
  }, [logs.data, liveLogMap, effectiveTicketId]);

  return (
    <div>
      <Topbar title="Terminal Log" subtitle="Pantau log mentah realtime yang difilter hanya untuk tiket yang sedang diproses" status={{ label: connected ? "Stream realtime aktif" : "Sedang menyambungkan stream", tone: connected ? "live" : "warn" }} />

      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Tiket diproses</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Pilih sesi terminal</div>
          </CardHeader>
          <CardBody className="pt-4">
            {tickets.isLoading ? <div className="text-sm text-slate-500">Memuat tiket aktif...</div> : null}
            {tickets.isError ? <div className="text-sm text-rose-700">{getErrorMessage(tickets.error, "Gagal memuat tiket terminal")}</div> : null}
            {!tickets.isLoading && !tickets.isError ? (
              <div className="space-y-3">
                {rows.map((ticket) => (
                  <button
                    key={ticket.ticket_id}
                    type="button"
                    onClick={() => setSelectedTicketId(ticket.ticket_id)}
                    className={`w-full rounded-[26px] border p-4 text-left transition-all ${effectiveTicketId === ticket.ticket_id ? "border-blue-200 bg-blue-50 shadow-[0_14px_32px_rgba(59,130,246,0.12)]" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Ticket #{ticket.ticket_id}</div>
                        <div className="mt-2 text-base font-semibold text-slate-950">{ticket.assigned_cs_email ?? "Belum terikat"}</div>
                        <div className="mt-1 text-sm text-slate-500">User #{ticket.user_id}</div>
                      </div>
                      <StatusBadge status={ticket.ticket_status} />
                    </div>
                  </button>
                ))}
                {rows.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Tidak ada tiket yang sedang diproses saat ini.</div> : null}
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Terminal mentah</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Log realtime per tiket</div>
          </CardHeader>
          <CardBody className="pt-4">
            {effectiveTicketId === 0 ? <div className="text-sm text-slate-500">Pilih tiket yang sedang diproses untuk melihat log mentahnya.</div> : null}
            {logs.isLoading && effectiveTicketId > 0 ? <div className="text-sm text-slate-500">Memuat log terminal...</div> : null}
            {logs.isError ? <div className="text-sm text-rose-700">{getErrorMessage(logs.error, "Gagal memuat terminal log")}</div> : null}
            {effectiveTicketId > 0 ? (
              <div className="overflow-hidden rounded-[28px] border border-slate-900 bg-[#0b1220] text-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.20)]">
                <div className="border-b border-slate-800 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ticket #{effectiveTicketId} - live backend trace</div>
                <div className="max-h-[720px] overflow-auto px-5 py-4 font-mono text-[12px] leading-6">
                  {displayedLogs.map((entry, index) => {
                    const category = logCategory(entry.message.toLowerCase());
                    return (
                      <div key={`${entry.timestamp}-${index}`} className="border-b border-slate-800/70 py-2 last:border-b-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-slate-500">[{format(new Date(entry.timestamp), "HH:mm:ss")}]</span>
                          <span className={entry.level === "ERROR" ? "font-semibold text-rose-300" : entry.level === "WARN" ? "font-semibold text-amber-300" : "font-semibold text-emerald-300"}>{entry.level}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${category.cls}`}>{category.label}</span>
                          <span className="text-sky-300">[{entry.source}]</span>
                        </div>
                        <div className="mt-1 text-slate-100">{highlightBooleans(entry.message)}</div>
                      </div>
                    );
                  })}
                  {displayedLogs.length === 0 ? <div className="text-slate-500">Belum ada log mentah untuk tiket ini.</div> : null}
                </div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
