"use client";

import * as React from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import clsx from "clsx";
import { useToastStore } from "@/store/toast";

function kindClasses(kind: "success" | "error" | "info") {
  switch (kind) {
    case "success":
      return "border-[#cde3d7] bg-white text-[#236847]";
    case "error":
      return "border-[#f0c7cd] bg-white text-[#a92637]";
    default:
      return "border-[#c8daf8] bg-white text-[#1356b8]";
  }
}

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) => setTimeout(() => dismiss(t.id), 4500));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            "rounded-lg border px-4 py-3 shadow-[0_12px_30px_rgba(17,26,36,0.12)]",
            "animate-[toast-in_180ms_ease-out]",
            kindClasses(t.kind),
          )}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {t.kind === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : t.kind === "error" ? <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> : <Info className="mt-0.5 h-4 w-4 shrink-0" />}
              <div>
              <div className="text-sm font-semibold leading-5">{t.title}</div>
              {t.detail ? (
                <div className="mt-0.5 text-sm/5 opacity-90">{t.detail}</div>
              ) : null}
              </div>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md opacity-60 hover:bg-black/5 hover:opacity-100"
              aria-label="Tutup"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
