"use client";

import * as React from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Message } from "@/types/api";
import { useChatWs } from "@/hooks/use-chat-ws";
import { useSendMessage } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { format } from "date-fns";

export function ChatPanel({
  ticketId,
  initial,
  role,
}: {
  ticketId: number;
  initial: Message[];
  role: "user" | "cs";
}) {
  const me = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.push);
  const [appended, setAppended] = React.useState<Message[]>([]);
  const [text, setText] = React.useState("");
  const send = useSendMessage(ticketId, role);

  const listRef = React.useRef<HTMLDivElement | null>(null);

  const onWsMessage = React.useCallback((m: Message) => {
    setAppended((prev) => {
      if (prev.some((x) => x.id === m.id)) return prev;
      return [...prev, m];
    });
  }, []);

  const { connected, warning } = useChatWs(ticketId, onWsMessage);

  const items = React.useMemo(() => {
    const all = [...initial, ...appended];
    const seen = new Set<number>();
    const dedup: Message[] = [];
    for (const m of all) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      dedup.push(m);
    }
    dedup.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return dedup;
  }, [initial, appended]);

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [items.length]);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-white px-5 py-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Customer Support</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">Percakapan</div>
        </div>
        <div className={clsx("text-xs font-semibold", connected ? "text-emerald-700" : "text-muted")}> 
          {connected ? "Terhubung" : "Menyambung..."}
        </div>
      </div>
      {warning ? <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">{warning}</div> : null}

      <div ref={listRef} className="h-[420px] overflow-auto bg-[linear-gradient(180deg,#fff,rgba(250,250,249,1))] p-4">
        <div className="space-y-2">
          {items.map((m) => {
            const mine = me?.id === m.senderId;
            const system = m.senderId === 0;
            return (
              <div key={m.id} className={clsx("flex", system ? "justify-center" : mine ? "justify-end" : "justify-start")}>
                <div
                  className={clsx(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    system ? "border border-blue-100 bg-blue-50 text-blue-900" : mine ? "bg-accent text-white" : "bg-white border border-border",
                  )}
                >
                  <div className={clsx("text-xs", system ? "text-blue-700" : mine ? "text-white/80" : "text-muted")}>
                    {format(new Date(m.createdAt), "p")}
                  </div>
                  {system ? <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Notifikasi Sistem</div> : null}
                  <div className="mt-1 whitespace-pre-wrap break-words">{m.message}</div>
                </div>
              </div>
            );
          })}
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-white p-6 text-sm text-muted">
              Belum ada pesan pada tiket ini.
            </div>
          ) : null}
        </div>
      </div>

      <form
        className="flex items-center gap-2 border-t border-border bg-white p-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const v = text.trim();
          if (!v) return;
          setText("");
          try {
            await send.mutateAsync(v);
          } catch (error) {
            setText(v);
            toast({ kind: "error", title: "Pesan gagal dikirim", detail: getErrorMessage(error, "Pesan gagal dikirim") });
          }
        }}
      >
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan..." />
        <Button type="submit" disabled={send.isPending}>
          Kirim
        </Button>
      </form>
    </Card>
  );
}
