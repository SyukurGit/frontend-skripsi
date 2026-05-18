import { Card, CardBody } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardBody className="p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
        <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
        <div className="mt-2 text-sm leading-6 text-slate-500">{hint}</div>
      </CardBody>
    </Card>
  );
}
