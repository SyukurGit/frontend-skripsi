import * as React from "react";
import clsx from "clsx";
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
    <section className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_28px_rgba(16,24,32,0.04)] sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? <div className="text-xs font-semibold uppercase text-emerald-700">{eyebrow}</div> : null}
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
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
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="text-base font-semibold text-slate-950">{title}</div>
          {description ? <div className="mt-1 text-sm leading-6 text-slate-500">{description}</div> : null}
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
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description ? <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</div> : null}
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
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        tone === "neutral" && "border-slate-200 bg-slate-50 text-slate-700",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "warning" && "border-amber-200 bg-amber-50 text-amber-800",
        tone === "danger" && "border-rose-200 bg-rose-50 text-rose-800",
        tone === "info" && "border-cyan-200 bg-cyan-50 text-cyan-800",
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}
