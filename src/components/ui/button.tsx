import * as React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "dark";
type Size = "sm" | "md" | "lg" | "icon";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold",
        "focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
        "disabled:cursor-not-allowed disabled:opacity-55",
        size === "sm" && "h-9 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-sm",
        size === "icon" && "h-10 w-10 p-0",
        variant === "primary" &&
          "bg-emerald-700 text-white shadow-[0_12px_24px_rgba(0,122,90,0.18)] hover:bg-emerald-800",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
        variant === "danger" &&
          "bg-rose-700 text-white shadow-[0_12px_24px_rgba(180,35,24,0.18)] hover:bg-rose-800",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        variant === "dark" && "bg-slate-950 text-white hover:bg-slate-800",
        className,
      )}
      {...props}
    />
  );
}
