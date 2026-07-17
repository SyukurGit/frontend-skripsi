import { Card, CardBody } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const toneClass =
    tone === "success"
      ? "border-l-emerald-600"
      : tone === "warning"
        ? "border-l-amber-600"
        : tone === "danger"
          ? "border-l-rose-600"
          : tone === "info"
            ? "border-l-cyan-600"
            : "border-l-slate-300";
  return (
    <Card className={`overflow-hidden border-l-4 ${toneClass}`}>
      <CardBody className="p-5">
        <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
        <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 font-tabular">{value}</div>
        <div className="mt-1 text-sm leading-6 text-slate-500">{hint}</div>
      </CardBody>
    </Card>
  );
}
