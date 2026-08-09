"use client";

import * as React from "react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Send, Signal, SignalZero } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/types/api";
import { useChatWs } from "@/hooks/use-chat-ws";
import { useSendMessage } from "@/services/queries";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { cn } from "@/utils/cn";

export function ChatPanel({
  ticketId,
  initial,
  role,
}: {
  ticketId: number;
  initial: Message[];
  role: "user" | "cs";
}) {
  const me = useAuthStore((state) => state.user);
  const toast = useToastStore((state) => state.push);
  const [appended, setAppended] = React.useState<Message[]>([]);
  const [text, setText] = React.useState("");
  const send = useSendMessage(ticketId, role);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const onWsMessage = React.useCallback((message: Message) => {
    setAppended((previous) => {
      if (previous.some((item) => item.id === message.id)) return previous;
      return [...previous, message];
    });
  }, []);

  const { connected, warning } = useChatWs(ticketId, onWsMessage);

  const items = React.useMemo(() => {
    const seen = new Set<number>();
    return [...initial, ...appended]
      .filter((message) => {
        if (seen.has(message.id)) return false;
        seen.add(message.id);
        return true;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [initial, appended]);

  React.useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [items.length]);

  React.useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "40px";
    element.style.height = `${Math.min(element.scrollHeight, 112)}px`;
  }, [text]);

  async function submit() {
    const value = text.trim();
    if (!value || send.isPending) return;
    setText("");
    try {
      await send.mutateAsync(value);
    } catch (error) {
      setText(value);
      toast({ kind: "error", title: "Pesan gagal dikirim", detail: getErrorMessage(error, "Pesan gagal dikirim") });
    }
  }

  return (
    <section className="flex h-[min(720px,calc(100dvh-10rem))] min-h-[520px] flex-col overflow-hidden rounded-lg border border-[#dfe3e8] bg-white shadow-[0_1px_2px_rgba(17,26,36,0.035)]">
      <header className="flex items-center justify-between gap-3 border-b border-[#e1e5ea] bg-white px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[#252932]">Percakapan ticket #{ticketId}</div>
          <div className="mt-0.5 truncate text-xs text-[#7b8492]">
            {role === "cs" ? "Hanya tersedia dalam assignment ticket ini" : "Percakapan dengan Customer Support"}
          </div>
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
            connected ? "border-[#c8daf8] bg-[#edf4ff] text-[#1356b8]" : "border-[#f0d5ad] bg-[#fff8e9] text-[#8c5207]",
          )}
        >
          {connected ? <Signal className="h-3.5 w-3.5" /> : <SignalZero className="h-3.5 w-3.5" />}
          <span className="hidden xs:inline">{connected ? "Terhubung" : "Menyambung"}</span>
        </div>
      </header>

      {warning ? <div className="border-b border-[#f0d5ad] bg-[#fff8e9] px-4 py-2 text-xs text-[#8c5207]">{warning}</div> : null}

      <div ref={listRef} className="app-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f8fafc] px-3 py-4 sm:px-5">
        <div className="mx-auto max-w-3xl space-y-3">
          {items.map((message) => {
            const mine = me?.id === message.senderId;
            const system = message.senderId === 0;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex", system ? "justify-center" : mine ? "justify-end" : "justify-start")}
              >
                {system ? (
                  <div className="max-w-[92%] rounded-md border border-[#c8daf8] bg-[#edf4ff] px-3 py-2 text-center text-xs leading-5 text-[#284f86]">
                    {message.message}
                    <span className="ml-2 text-[10px] text-[#6684aa]">{format(new Date(message.createdAt), "HH:mm")}</span>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "max-w-[84%] rounded-lg px-3.5 py-2.5 text-sm sm:max-w-[72%]",
                      mine
                        ? "rounded-br-sm bg-[#1769e0] text-white shadow-[0_3px_10px_rgba(23,105,224,0.14)]"
                        : "rounded-bl-sm border border-[#dfe3e8] bg-white text-[#252932]",
                    )}
                  >
                    <div className="whitespace-pre-wrap break-words leading-6">{message.message}</div>
                    <div className={cn("mt-1 text-right text-[10px]", mine ? "text-white/65" : "text-[#98a0ad]")}>
                      {mine ? "Anda" : role === "cs" ? "Pengguna" : "Customer Support"} · {format(new Date(message.createdAt), "HH:mm")}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
          {items.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center text-center">
              <div>
                <div className="text-sm font-semibold text-[#596170]">Belum ada pesan</div>
                <p className="mt-1 text-xs leading-5 text-[#98a0ad]">Kirim pesan untuk memulai percakapan dalam ticket ini.</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <form
        className="safe-bottom flex items-end gap-2 border-t border-[#dfe3e8] bg-white px-3 pt-3 sm:px-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit();
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder="Tulis pesan..."
          className="app-scrollbar min-h-10 flex-1 resize-none rounded-md border border-[#d6dbe1] bg-white px-3 py-2.5 text-sm leading-5 text-[#252932] outline-none placeholder:text-[#98a0ad] focus:border-[var(--brand)] focus:ring-4 focus:ring-[color:var(--ring)]"
          aria-label="Pesan ticket"
        />
        <Button type="submit" size="icon" disabled={send.isPending || text.trim().length === 0} aria-label="Kirim pesan">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </section>
  );
}
