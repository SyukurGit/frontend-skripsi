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
      ? "border-l-[#3a8a63]"
      : tone === "warning"
        ? "border-l-[#c47b16]"
        : tone === "danger"
          ? "border-l-[#c83243]"
          : tone === "info"
            ? "border-l-[var(--brand)]"
            : "border-l-[#cfd5dd]";
  return (
    <Card className={`overflow-hidden border-l-4 ${toneClass}`}>
      <CardBody className="p-5">
        <div className="text-xs font-medium text-[#7b8492]">{label}</div>
        <div className="mt-3 text-2xl font-semibold text-[#171a21] font-tabular">{value}</div>
        <div className="mt-1 text-sm leading-6 text-[#667085]">{hint}</div>
      </CardBody>
    </Card>
  );
}
