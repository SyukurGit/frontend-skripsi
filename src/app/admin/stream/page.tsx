"use client";

import * as React from "react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { connectWithRetry, wsUrl } from "@/lib/ws";
import { fetchAuditLogs } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import type { AuditLog, AuditLevel } from "@/types/api";
import { getErrorMessage } from "@/utils/api-error";
import { auditActionHint, auditActionLabel, auditMeta } from "@/utils/audit";
import { mapAudit } from "@/utils/map";
import { format } from "date-fns";

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
      setWarning(getErrorMessage(error, "Failed to sync recent audit events."));
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
        setWarning("Realtime audit stream disconnected. Reconnecting and resyncing...");
      },
      onError: () => {
        setWarning("Realtime audit stream error. Reconnecting and resyncing...");
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
          setWarning("Received unsupported realtime audit event.");
        } catch (error) {
          console.error("Invalid audit WS payload", error, ev.data);
          setWarning("Received invalid realtime audit payload.");
        }
      },
    });
    return () => conn.close();
  }, [backfill, mergeAuditLogs, token]);

  const filtered = items.filter((x) => x.level === level);
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
    .map(([ticketId, logs]) => ({ ticketId, logs: logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) }))
    .sort((a, b) => new Date(b.logs[0]?.createdAt ?? 0).getTime() - new Date(a.logs[0]?.createdAt ?? 0).getTime());

  const effectiveSelectedTicketId = selectedTicketId && grouped.some((group) => group.ticketId === selectedTicketId) ? selectedTicketId : (grouped[0]?.ticketId ?? null);
  const selectedGroup = grouped.find((group) => group.ticketId === effectiveSelectedTicketId) ?? null;

  return (
    <div>
      <Topbar
        title="Audit Realtime"
        subtitle="Pantau perubahan penting pada tiket aktif dengan narasi realtime yang selaras dengan panel admin utama"
        status={{ label: connected ? "Realtime connected" : "Reconnecting stream", tone: connected ? "live" : "warn" }}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Monitor realtime</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Pilih tiket yang sedang bergerak</div>
            <div className="mt-2 text-sm text-slate-500">Stream ini membantu memperlihatkan perubahan audit yang masuk tanpa menunggu refresh manual, sehingga keputusan backend bisa dijelaskan saat itu juga.</div>
          </CardHeader>
          <CardBody className="pt-4">
            {warning ? <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">{warning}</div> : null}
            <div className="flex gap-2">
              <button
                className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold ${level === "HIGH" ? "border-rose-200 bg-rose-50 text-rose-900" : "border-border bg-white text-slate-600"}`}
                onClick={() => setLevel("HIGH")}
              >
                HIGH
              </button>
              <button
                className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold ${level === "MEDIUM" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-border bg-white text-slate-600"}`}
                onClick={() => setLevel("MEDIUM")}
              >
                MEDIUM
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
              <span>Buffered: {items.length} events</span>
              <Button type="button" variant="secondary" onClick={() => void backfill()} disabled={syncing}>
                {syncing ? "Syncing..." : "Sync now"}
              </Button>
            </div>

            <div className="mt-5 space-y-3">
              {grouped.map((group) => (
                <button
                  key={group.ticketId}
                  type="button"
                  onClick={() => setSelectedTicketId(group.ticketId)}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${effectiveSelectedTicketId === group.ticketId ? "border-emerald-300 bg-emerald-50 shadow-[0_14px_30px_rgba(0,122,90,0.12)]" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tiket realtime</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">Ticket #{group.ticketId}</div>
                      <div className="mt-1 text-sm text-slate-500">Event terbaru: {auditActionLabel(group.logs[0]?.action ?? "-")}</div>
                    </div>
                    <LevelBadge level={group.logs[0]?.level ?? level} />
                  </div>
                </button>
              ))}
              {grouped.length === 0 ? <div className="rounded-xl border border-dashed border-border bg-slate-50 p-6 text-sm text-slate-500">Belum ada tiket dengan event realtime pada level ini.</div> : null}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Timeline realtime</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Alur keputusan yang sedang berjalan</div>
              </div>
              <LevelBadge level={level} />
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            {selectedGroup ? (
              <div className="space-y-3">
                {selectedGroup.logs.slice(0, 8).map((item, index) => {
                  const meta = auditMeta(item);
                  const feature = typeof meta.feature === "string" ? meta.feature : null;
                  return (
                    <div key={item.id} className={`rounded-lg border p-4 transition-all duration-300 ${index === 0 ? "border-emerald-300 bg-emerald-50 shadow-[0_16px_34px_rgba(0,122,90,0.12)]" : "border-border bg-slate-50"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${index === 0 ? "bg-emerald-700 text-white animate-pulse" : "bg-slate-200 text-slate-700"}`}>{index + 1}</div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Langkah realtime</div>
                            <div className="mt-2 text-base font-semibold text-slate-950">{auditActionLabel(item.action)}</div>
                          </div>
                        </div>
                        <LevelBadge level={item.level} />
                      </div>
                      <div className="mt-3 text-sm leading-6 text-slate-600">{auditActionHint(item)}</div>
                      {feature ? <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Fitur: {feature}</div> : null}
                      <div className="mt-3 text-xs text-slate-500">{format(new Date(item.createdAt), "PPp")} - user:{item.userId} role:{item.role}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-slate-50 p-6 text-sm text-slate-500">Pilih tiket dari panel kiri untuk melihat event realtime yang sedang masuk.</div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
