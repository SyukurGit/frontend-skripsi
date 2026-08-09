import { Card, CardBody, CardHeader } from "@/components/ui/card";

export function DemoScriptCard({
  title,
  subtitle,
  steps,
}: {
  title: string;
  subtitle: string;
  steps: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Alur demonstrasi</div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</div>
        <div className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</div>
      </CardHeader>
      <CardBody className="pt-4">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand)] text-xs font-bold text-white">{index + 1}</div>
              <div className="text-sm leading-6 text-slate-600">{step}</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
