import * as React from "react";
import clsx from "clsx";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-[inset_0_1px_2px_rgba(16,24,32,0.035)]",
        "placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900",
        "focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900",
        "placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}
