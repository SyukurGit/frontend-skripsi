import * as React from "react";
import { cn } from "@/utils/cn";
import { Card, CardBody } from "@/components/ui/card";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <section className="mb-6 border-b border-[#dfe3e8] pb-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? <div className="text-xs font-semibold text-[var(--brand)]">{eyebrow}</div> : null}
          <h1 className="mt-1 text-2xl font-semibold text-[#171a21] sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">{description}</p> : null}
          {meta ? <div className="mt-3 flex flex-wrap gap-2">{meta}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}

export function DataPanel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="flex flex-col gap-3 border-b border-[#e9ecf0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="text-base font-semibold text-[#171a21]">{title}</div>
          {description ? <div className="mt-1 text-sm leading-6 text-[#667085]">{description}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      <CardBody className="pt-5">{children}</CardBody>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[#cfd5dd] bg-[#f8fafc] px-5 py-8 text-center">
      <div className="text-sm font-semibold text-[#252932]">{title}</div>
      {description ? <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">{description}</div> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "border-[#dfe3e8] bg-[#f8fafc] text-[#596170]",
        tone === "success" && "border-[#cde3d7] bg-[#eef7f2] text-[#236847]",
        tone === "warning" && "border-[#f0d5ad] bg-[#fff8e9] text-[#8c5207]",
        tone === "danger" && "border-[#f0c7cd] bg-[#fff1f3] text-[#a92637]",
        tone === "info" && "border-[#c8daf8] bg-[#edf4ff] text-[#1356b8]",
      )}
    >
      {children}
    </span>
  );
}

export function KeyValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-[#e1e5ea] bg-[#f8fafc] px-3 py-2.5">
      <div className="text-xs font-medium text-[#7b8492]">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[#252932]">{value}</div>
    </div>
  );
}
