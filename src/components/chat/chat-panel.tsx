"use client";

import * as React from "react";
import clsx from "clsx";
import { format } from "date-fns";
import { Send, Signal, SignalZero, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Message } from "@/types/api";
import { useChatWs } from "@/hooks/use-chat-ws";
import { useSendMessage } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

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
      <div className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Ruang ticket #{ticketId}
            </div>
            <div className="mt-2 text-lg font-semibold">Percakapan bantuan</div>
            <div className="mt-1 text-sm text-slate-300">
              {role === "cs" ? "CS bekerja di dalam scope ticket ini." : "Pengguna memantau bantuan tanpa melihat akses internal CS."}
            </div>
          </div>
          <div
            className={clsx(
              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
              connected ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100" : "border-amber-300/30 bg-amber-400/10 text-amber-100",
            )}
          >
            {connected ? <Signal className="h-3.5 w-3.5" /> : <SignalZero className="h-3.5 w-3.5" />}
            {connected ? "Realtime aktif" : "Menyambung"}
          </div>
        </div>
      </div>

      {warning ? <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">{warning}</div> : null}

      <div ref={listRef} className="h-[430px] overflow-auto bg-[#f8faf7] p-3 sm:p-5">
        <div className="space-y-3">
          {items.map((m) => {
            const mine = me?.id === m.senderId;
            const system = m.senderId === 0;
            return (
              <div key={m.id} className={clsx("flex", system ? "justify-center" : mine ? "justify-end" : "justify-start")}>
                <div
                  className={clsx(
                    "max-w-[88%] rounded-xl px-4 py-3 text-sm shadow-sm sm:max-w-[76%]",
                    system
                      ? "border border-sky-200 bg-sky-50 text-sky-950"
                      : mine
                        ? "bg-emerald-700 text-white"
                        : "border border-slate-200 bg-white text-slate-800",
                  )}
                >
                  <div className={clsx("text-[11px] font-semibold uppercase tracking-[0.12em]", system ? "text-sky-700" : mine ? "text-emerald-100" : "text-slate-400")}>
                    {system ? "Notifikasi sistem" : mine ? "Anda" : role === "cs" ? "Pengguna" : "Customer Service"} - {format(new Date(m.createdAt), "HH:mm")}
                  </div>
                  <div className="mt-1 whitespace-pre-wrap break-words leading-6">{m.message}</div>
                </div>
              </div>
            );
          })}
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
              Belum ada pesan. Kirim pesan pertama untuk memulai percakapan ticket ini.
            </div>
          ) : null}
        </div>
      </div>

      <form
        className="flex flex-col gap-2 border-t border-slate-200 bg-white p-3 sm:flex-row"
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
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan bantuan..." />
        <Button type="submit" disabled={send.isPending} className="sm:w-auto">
          <Send className="h-4 w-4" />
          {send.isPending ? "Mengirim" : "Kirim"}
        </Button>
      </form>
    </Card>
  );
}
