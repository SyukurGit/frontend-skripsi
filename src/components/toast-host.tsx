"use client";

import * as React from "react";
import clsx from "clsx";
import { useToastStore } from "@/store/toast";

function kindClasses(kind: "success" | "error" | "info") {
  switch (kind) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-950";
    case "error":
      return "border-rose-200 bg-rose-50 text-rose-950";
    default:
      return "border-sky-200 bg-sky-50 text-sky-950";
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
            "rounded-xl border px-4 py-3 shadow-sm backdrop-blur",
            "animate-[toast-in_180ms_ease-out]",
            kindClasses(t.kind),
          )}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold leading-5">{t.title}</div>
              {t.detail ? (
                <div className="mt-0.5 text-sm/5 opacity-90">{t.detail}</div>
              ) : null}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-md px-2 py-1 text-xs font-semibold opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
