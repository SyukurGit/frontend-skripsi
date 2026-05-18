"use client";

import * as React from "react";
import type { Message } from "@/types/api";
import { useAuthStore } from "@/store/auth";
import { connectWithRetry, wsUrl } from "@/lib/ws";
import { mapMessage } from "@/utils/map";

type ChatEvent =
  | { event: "ticket_message"; payload: unknown }
  | { event: string; payload: unknown };

export function useChatWs(ticketId: number, onMessage: (m: Message) => void) {
  const token = useAuthStore((s) => s.token);
  const [connected, setConnected] = React.useState(false);
  const [warning, setWarning] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!token) return;
    if (!Number.isFinite(ticketId) || ticketId <= 0) return;
    const url = wsUrl(`/ws/chat/${ticketId}?token=${encodeURIComponent(token)}`);
    const conn = connectWithRetry({
      url,
      onOpen: () => {
        setConnected(true);
        setWarning(null);
      },
      onClose: () => {
        setConnected(false);
        setWarning("Realtime chat disconnected. Reconnecting...");
      },
      onError: () => {
        setWarning("Realtime chat connection error. Reconnecting...");
      },
      onMessage: (ev) => {
        try {
          const parsed = JSON.parse(String(ev.data)) as ChatEvent;
          if (parsed.event === "ticket_message") {
            onMessage(mapMessage(parsed.payload));
            setWarning(null);
            return;
          }
          console.error("Unexpected chat WS event", parsed);
          setWarning("Received unsupported realtime chat event.");
        } catch (error) {
          console.error("Invalid chat WS payload", error, ev.data);
          setWarning("Received invalid realtime chat payload.");
        }
      },
    });

    return () => conn.close();
  }, [ticketId, token, onMessage]);

  return { connected, warning };
}
