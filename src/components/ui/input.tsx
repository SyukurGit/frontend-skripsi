import * as React from "react";
import clsx from "clsx";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
      <input
        className={clsx(
        "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]",
        "placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
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
        "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900",
        "focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
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
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900",
        "placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}
