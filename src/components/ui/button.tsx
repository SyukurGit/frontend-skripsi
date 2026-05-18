import * as React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
      <button
        className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,#335cff,#1d4ed8)] text-white shadow-[0_10px_22px_rgba(51,92,255,0.26)] hover:-translate-y-0.5 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
        variant === "secondary" &&
          "border border-border bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        variant === "danger" &&
          "bg-rose-600 text-white shadow-[0_10px_22px_rgba(225,29,72,0.20)] hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        className,
      )}
      {...props}
    />
  );
}
