import * as React from "react";
import { cn } from "@/utils/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-[#d6dbe1] bg-white px-3 text-sm text-[#252932] shadow-[inset_0_1px_1px_rgba(17,26,36,0.025)]",
        "placeholder:text-[#98a0ad] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
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
      className={cn(
        "h-10 w-full rounded-md border border-[#d6dbe1] bg-white px-3 text-sm text-[#252932]",
        "focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
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
      className={cn(
        "w-full rounded-md border border-[#d6dbe1] bg-white px-3 py-2.5 text-sm text-[#252932]",
        "placeholder:text-[#98a0ad] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}
