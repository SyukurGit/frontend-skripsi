"use client";

import * as React from "react";
import { format } from "date-fns";
import { Radio, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "@/components/ui/badge";
import { connectWithRetry, wsUrl } from "@/lib/ws";
import { fetchAuditLogs } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import type { AuditLog, AuditLevel } from "@/types/api";
import { getErrorMessage } from "@/utils/api-error";
import { auditActionHint, auditActionLabel, auditMeta } from "@/utils/audit";
import { mapAudit } from "@/utils/map";

type AuditEvent =
  | { event: "audit_log"; payload: unknown }
  | { event: string; payload: unknown };

export default function AdminStreamPage() {
  const token = useAuthStore((s) => s.token);
  const [connected, setConnected] = React.useState(false);
  const [level, setLevel] = React.useState<AuditLevel>("HIGH");
  const [items, setItems] = React.useState<AuditLog[]>([]);
  const [warning, setWarning] = React.useState<string | null>(null);
  const [syncing, setSyncing] = React.useState(false);
  const [selectedTicketId, setSelectedTicketId] = React.useState<number | null>(null);

  const mergeAuditLogs = React.useCallback((incoming: AuditLog[]) => {
    setItems((prev) => {
      const byId = new Map<number, AuditLog>();
      for (const item of [...incoming, ...prev]) {
        byId.set(item.id, item);
      }
      return Array.from(byId.values())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 200);
    });
  }, []);

  const backfill = React.useCallback(async () => {
    setSyncing(true);
    try {
      const [high, medium] = await Promise.all([fetchAuditLogs("HIGH", 100), fetchAuditLogs("MEDIUM", 100)]);
      mergeAuditLogs([...high, ...medium]);
      setWarning(null);
    } catch (error) {
      setWarning(getErrorMessage(error, "Gagal menyinkronkan peristiwa audit terbaru."));
    } finally {
      setSyncing(false);
    }
  }, [mergeAuditLogs]);

  React.useEffect(() => {
    if (!token) return;
    const url = wsUrl(`/ws/audit?token=${encodeURIComponent(token)}`);
    const conn = connectWithRetry({
      url,
      onOpen: () => {
        setConnected(true);
        void backfill();
      },
      onClose: () => {
        setConnected(false);
        setWarning("Stream audit terputus. Sistem mencoba menyambung dan melakukan sinkronisasi ulang.");
      },
      onError: () => {
        setWarning("Koneksi stream audit bermasalah. Sistem mencoba menyambung ulang.");
      },
      onMessage: (ev) => {
        try {
          const parsed = JSON.parse(String(ev.data)) as AuditEvent;
          if (parsed.event === "audit_log") {
            mergeAuditLogs([mapAudit(parsed.payload)]);
            setWarning(null);
            return;
          }
          console.error("Unexpected audit WS event", parsed);
          setWarning("Stream mengirim jenis peristiwa yang belum didukung.");
        } catch (error) {
          console.error("Invalid audit WS payload", error, ev.data);
          setWarning("Stream mengirim payload audit yang tidak valid.");
        }
      },
    });
    return () => conn.close();
  }, [backfill, mergeAuditLogs, token]);

  const filtered = items.filter((item) => item.level === level);
  const grouped = Array.from(
    filtered.reduce((acc, item) => {
      const key = item.ticketId ?? -1;
      const list = acc.get(key) ?? [];
      list.push(item);
      acc.set(key, list);
      return acc;
    }, new Map<number, AuditLog[]>()),
  )
    .filter(([ticketId]) => ticketId !== -1)
    .map(([ticketId, logs]) => ({
      ticketId,
      logs: logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    }))
    .sort(
      (a, b) =>
        new Date(b.logs[0]?.createdAt ?? 0).getTime() - new Date(a.logs[0]?.createdAt ?? 0).getTime(),
    );

  const effectiveSelectedTicketId =
    selectedTicketId && grouped.some((group) => group.ticketId === selectedTicketId)
      ? selectedTicketId
      : (grouped[0]?.ticketId ?? null);
  const selectedGroup = grouped.find((group) => group.ticketId === effectiveSelectedTicketId) ?? null;

  return (
    <div>
      <Topbar
        title="Stream Audit"
        subtitle="Peristiwa HIGH dan MEDIUM saat aktivitas berlangsung"
        status={{
          label: connected ? "Stream terhubung" : "Menyambungkan ulang",
          tone: connected ? "live" : "warn",
        }}
      />

      <section className="mb-5 border-b border-slate-200 pb-5 pt-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-700">
              <Radio className="h-4 w-4" />
              Monitor langsung
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">Perubahan penting, tanpa muat ulang manual</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Stream membantu Admin mengamati keputusan backend ketika terjadi. Tampilan ini bukan kontrol untuk
              mengesahkan atau menolak akses JIT.
            </p>
          </div>
          <div className={`flex items-center gap-2 text-xs font-semibold ${connected ? "text-emerald-700" : "text-amber-700"}`}>
            {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {connected ? "Menerima event langsung" : "Koneksi belum stabil"}
          </div>
        </div>
      </section>

      {warning ? (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-600" />
          {warning}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <div className="text-sm font-semibold text-slate-950">Konsol peristiwa</div>
            <div className="mt-0.5 text-xs text-slate-500">
              {filtered.length} event {level} pada {grouped.length} tiket, {items.length} event tersimpan di browser.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex h-9 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(["HIGH", "MEDIUM"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLevel(option)}
                  className={`min-w-[86px] rounded-md px-3 text-xs font-semibold ${
                    level === option
                      ? option === "HIGH"
                        ? "bg-rose-700 text-white shadow-sm"
                        : "bg-amber-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {option === "HIGH" ? "Tinggi" : "Sedang"}
                </button>
              ))}
            </div>
            <Button type="button" size="sm" variant="secondary" onClick={() => void backfill()} disabled={syncing}>
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Sinkron..." : "Sinkronkan"}
            </Button>
          </div>
        </div>

        <div className="grid xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-xs font-semibold uppercase text-slate-500">Tiket dengan sinyal</span>
              <LevelBadge level={level} />
            </div>
            <div className="max-h-[460px] divide-y divide-slate-100 overflow-y-auto xl:max-h-[720px]">
              {grouped.map((group) => {
                const latest = group.logs[0];
                const selected = effectiveSelectedTicketId === group.ticketId;
                return (
                  <button
                    key={group.ticketId}
                    type="button"
                    onClick={() => setSelectedTicketId(group.ticketId)}
                    className={`relative w-full px-4 py-3 text-left hover:bg-slate-50 ${selected ? "bg-indigo-50/70" : "bg-white"}`}
                  >
                    {selected ? <span className="absolute inset-y-0 left-0 w-1 bg-indigo-600" /> : null}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-mono text-[11px] font-semibold text-slate-500">TIKET #{group.ticketId}</div>
                        <div className="mt-1 truncate text-sm font-semibold text-slate-950">
                          {auditActionLabel(latest?.action ?? "-")}
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-slate-500">
                          {latest ? format(new Date(latest.createdAt), "dd MMM HH:mm:ss") : "-"}
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-700">{group.logs.length}</span>
                    </div>
                  </button>
                );
              })}
              {grouped.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <div className="text-sm font-semibold text-slate-900">Belum ada event {level}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Event baru akan muncul di sini setelah diterima atau disinkronkan.
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex min-h-[49px] items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                {selectedGroup ? `Linimasa tiket #${selectedGroup.ticketId}` : "Linimasa tiket"}
              </span>
              {selectedGroup ? (
                <span className="font-mono text-[10px] text-slate-500">{selectedGroup.logs.length} EVENT TERKORELASI</span>
              ) : null}
            </div>

            {selectedGroup ? (
              <div className="divide-y divide-slate-100">
                {selectedGroup.logs.slice(0, 8).map((item, index) => {
                  const meta = auditMeta(item);
                  const feature = typeof meta.feature === "string" ? meta.feature : null;
                  return (
                    <div
                      key={item.id}
                      className={`grid gap-3 px-4 py-4 sm:grid-cols-[108px_minmax(0,1fr)_auto] sm:items-start sm:px-5 ${
                        index === 0 ? "bg-indigo-50/40" : "bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${index === 0 ? "bg-indigo-600 animate-pulse" : "bg-slate-300"}`} />
                          <span className="font-mono text-[11px] font-semibold text-slate-700">
                            {format(new Date(item.createdAt), "HH:mm:ss")}
                          </span>
                        </div>
                        <div className="mt-1 pl-4 font-mono text-[10px] text-slate-500">EVENT {index + 1}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-950">{auditActionLabel(item.action)}</span>
                          {index === 0 ? (
                            <span className="font-mono text-[10px] font-semibold text-indigo-700">TERBARU</span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{auditActionHint(item)}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-slate-500">
                          <span>USER {item.userId}</span>
                          <span>PERAN {item.role.toUpperCase()}</span>
                          {feature ? <span>FITUR {feature}</span> : null}
                        </div>
                      </div>
                      <LevelBadge level={item.level} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-12 text-center">
                <div className="text-sm font-semibold text-slate-900">Tidak ada linimasa untuk ditampilkan</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">
                  Pilih level lain atau sinkronkan event audit terbaru.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
