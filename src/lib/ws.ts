import { env } from "@/utils/env";

type WsOpts = {
  url: string;
  onMessage: (ev: MessageEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
};

function toWsBase(base: string) {
  if (base.startsWith("https://")) return base.replace("https://", "wss://");
  if (base.startsWith("http://")) return base.replace("http://", "ws://");
  return base;
}

export function wsUrl(path: string) {
  const base = toWsBase(env.apiBaseUrl);
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function connectWithRetry(opts: WsOpts) {
  let ws: WebSocket | null = null;
  let closed = false;
  let attempt = 0;

  const connect = () => {
    if (closed) return;
    attempt += 1;
    ws = new WebSocket(opts.url);
    ws.onopen = () => {
      attempt = 0;
      opts.onOpen?.();
    };
    ws.onmessage = opts.onMessage;
    ws.onerror = () => {
      opts.onError?.();
    };
    ws.onclose = () => {
      opts.onClose?.();
      if (closed) return;
      const backoff = Math.min(8000, 500 * Math.pow(2, Math.min(4, attempt)));
      setTimeout(connect, backoff);
    };
  };

  connect();

  return {
    send: (data: string) => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.send(data);
    },
    close: () => {
      closed = true;
      try {
        ws?.close();
      } catch {
        // ignore
      }
    },
  };
}
