"use client";

import * as React from "react";
import { format } from "date-fns";
import { Database, TerminalSquare, Wifi, WifiOff } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { StatusBadge } from "@/components/ui/badge";
import { useAdminTerminalLogs, useAdminTerminalTickets } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { getErrorMessage } from "@/utils/api-error";
import { connectWithRetry, wsUrl } from "@/lib/ws";
import type { TerminalLogEntry } from "@/types/api";

function logCategory(message: string) {
  if (message.includes("jit")) {
    return { label: "JIT", cls: "border-indigo-400/30 bg-indigo-500/15 text-indigo-200" };
  }
  if (message.includes("chat message")) {
    return { label: "PESAN", cls: "border-sky-400/30 bg-sky-500/15 text-sky-200" };
  }
  if (message.includes("status")) {
    return { label: "STATUS", cls: "border-amber-400/30 bg-amber-500/15 text-amber-200" };
  }
  if (message.includes("sensitive")) {
    return { label: "SENSITIF", cls: "border-rose-400/30 bg-rose-500/15 text-rose-200" };
  }
  return { label: "ALUR", cls: "border-slate-600 bg-slate-700/40 text-slate-300" };
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

function terminalPriority(entry: TerminalLogEntry) {
  const message = entry.message.toLowerCase();
  if (message.includes("jit request approved") || message.includes("jit request denied")) return 90;
  if (message.includes("validation summary")) return 80;
  const stepMatch = message.match(/validation step (\d+)/);
  if (stepMatch) return Number(stepMatch[1]) * 10;
  if (message.includes("jit request received")) return 5;
  return 0;
}

function mergeTerminalLogs(base: TerminalLogEntry[], live: TerminalLogEntry[]) {
  const seen = new Set<string>();
  const merged: TerminalLogEntry[] = [];

  for (const entry of [...base, ...live]) {
    const key =
      entry.sequence > 0
        ? `${entry.ticket_id}|${entry.sequence}`
        : `${entry.ticket_id}|${entry.timestamp}|${entry.level}|${entry.source}|${entry.message}`;
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

export default function AdminTerminalPage() {
  const token = useAuthStore((s) => s.token);
  const tickets = useAdminTerminalTickets();
  const rows = tickets.data ?? [];
  const [selectedTicketId, setSelectedTicketId] = React.useState<number | null>(null);
  const effectiveTicketId =
    selectedTicketId && rows.some((ticket) => ticket.ticket_id === selectedTicketId)
      ? selectedTicketId
      : (rows[0]?.ticket_id ?? 0);
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
            const key =
              payload.sequence > 0
                ? `${payload.ticket_id}|${payload.sequence}`
                : `${payload.ticket_id}|${payload.timestamp}|${payload.level}|${payload.source}|${payload.message}`;
            const exists = current.some((entry) => {
              const entryKey =
                entry.sequence > 0
                  ? `${entry.ticket_id}|${entry.sequence}`
                  : `${entry.ticket_id}|${entry.timestamp}|${entry.level}|${entry.source}|${entry.message}`;
              return entryKey === key;
            });
            const next = exists ? current : [...current, payload].slice(-200);
            return { ...prev, [effectiveTicketId]: next };
          });
        } catch {
          // Paket log yang rusak diabaikan agar aliran berikutnya tetap dapat ditampilkan.
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

  const connectionLabel =
    effectiveTicketId === 0 ? "Tidak ada tiket aktif" : connected ? "Trace terhubung" : "Menyambungkan trace";

  return (
    <div>
      <Topbar
        title="Terminal Teknis"
        subtitle="Trace backend sementara untuk tiket dalam penanganan"
        status={{ label: connectionLabel, tone: effectiveTicketId === 0 ? "muted" : connected ? "live" : "warn" }}
      />

      <section className="mb-5 border-b border-slate-200 pb-5 pt-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-700">
              <TerminalSquare className="h-4 w-4" />
              Trace operasional
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">Lihat pemeriksaan backend pada tiket aktif</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Terminal menampilkan detail teknis untuk diagnosis saat demo atau investigasi. Gunakan audit per tiket
              sebagai sumber jejak yang persisten.
            </p>
          </div>
          <div className={`flex items-center gap-2 text-xs font-semibold ${connected ? "text-emerald-700" : "text-slate-600"}`}>
            {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {connectionLabel}
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <Database className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <div>
          <div className="text-xs font-semibold text-amber-900">Buffer terminal bersifat sementara</div>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            Log disimpan di memori proses backend dengan kapasitas terbatas. Isinya dapat hilang saat layanan dimulai
            ulang dan tidak menggantikan audit persisten.
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
        <div className="grid xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-950">Tiket dalam penanganan</div>
                <div className="mt-0.5 text-xs text-slate-500">CLAIMED atau IN_PROGRESS.</div>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-700">{rows.length}</span>
            </div>

            {tickets.isLoading ? <div className="px-4 py-5 text-sm text-slate-500">Memuat tiket...</div> : null}
            {tickets.isError ? (
              <div className="px-4 py-5 text-sm text-rose-700">
                {getErrorMessage(tickets.error, "Gagal memuat tiket terminal")}
              </div>
            ) : null}
            {!tickets.isLoading && !tickets.isError ? (
              <div className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto xl:max-h-[760px]">
                {rows.map((ticket) => {
                  const selected = effectiveTicketId === ticket.ticket_id;
                  return (
                    <button
                      key={ticket.ticket_id}
                      type="button"
                      onClick={() => setSelectedTicketId(ticket.ticket_id)}
                      className={`relative w-full px-4 py-3 text-left hover:bg-slate-50 ${selected ? "bg-indigo-50/70" : "bg-white"}`}
                    >
                      {selected ? <span className="absolute inset-y-0 left-0 w-1 bg-indigo-600" /> : null}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-mono text-[11px] font-semibold text-slate-500">TIKET #{ticket.ticket_id}</div>
                          <div className="mt-1 truncate text-sm font-semibold text-slate-950">
                            {ticket.assigned_cs_email ?? "Belum ditugaskan"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">Pengguna #{ticket.user_id}</div>
                        </div>
                        <StatusBadge status={ticket.ticket_status} />
                      </div>
                    </button>
                  );
                })}
                {rows.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <div className="text-sm font-semibold text-slate-900">Tidak ada tiket aktif</div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">
                      Tiket muncul di sini setelah diambil CS atau mulai diproses.
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </aside>

          <div className="min-w-0 bg-[#0b1220]">
            <div className="flex min-h-[61px] flex-col gap-2 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <div className="font-mono text-xs font-semibold text-slate-200">
                  {effectiveTicketId ? `ticket/${effectiveTicketId}/backend-trace` : "backend-trace"}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Baris terbaru ditampilkan paling atas.</div>
              </div>
              {effectiveTicketId ? (
                <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
                  <span>{displayedLogs.length} BARIS</span>
                  <span className={connected ? "text-emerald-300" : "text-amber-300"}>
                    {connected ? "LIVE" : "RECONNECTING"}
                  </span>
                </div>
              ) : null}
            </div>

            {effectiveTicketId === 0 ? (
              <div className="px-5 py-12 font-mono text-xs text-slate-500">
                Tidak ada tiket dalam penanganan untuk membuka trace.
              </div>
            ) : null}
            {logs.isLoading && effectiveTicketId > 0 ? (
              <div className="px-5 py-5 font-mono text-xs text-slate-500">Memuat buffer terminal...</div>
            ) : null}
            {logs.isError ? (
              <div className="border-b border-rose-900/60 bg-rose-950/40 px-5 py-4 font-mono text-xs text-rose-300">
                {getErrorMessage(logs.error, "Gagal memuat log teknis")}
              </div>
            ) : null}

            {effectiveTicketId > 0 ? (
              <div className="max-h-[760px] min-h-[420px] overflow-auto px-4 py-3 font-mono text-[12px] leading-6 sm:px-5">
                {displayedLogs.map((entry, index) => {
                  const category = logCategory(entry.message.toLowerCase());
                  const sequence = entry.sequence > 0 ? String(entry.sequence).padStart(4, "0") : "----";
                  return (
                    <div
                      key={`${entry.ticket_id}-${entry.sequence}-${entry.timestamp}-${index}`}
                      className="grid border-b border-slate-800/80 py-2.5 last:border-b-0 lg:grid-cols-[72px_82px_minmax(0,1fr)]"
                    >
                      <div className="text-slate-500">#{sequence}</div>
                      <div className="text-slate-500">{format(new Date(entry.timestamp), "HH:mm:ss")}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={
                              entry.level === "ERROR"
                                ? "font-semibold text-rose-300"
                                : entry.level === "WARN"
                                  ? "font-semibold text-amber-300"
                                  : "font-semibold text-indigo-300"
                            }
                          >
                            {entry.level}
                          </span>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${category.cls}`}>
                            {category.label}
                          </span>
                          <span className="text-sky-300">[{entry.source}]</span>
                        </div>
                        <div className="mt-1 break-words text-slate-100">{highlightBooleans(entry.message)}</div>
                      </div>
                    </div>
                  );
                })}
                {!logs.isLoading && displayedLogs.length === 0 ? (
                  <div className="py-6 text-slate-500">Buffer belum berisi trace untuk tiket ini.</div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
