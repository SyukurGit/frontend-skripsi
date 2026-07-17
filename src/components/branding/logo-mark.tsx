import clsx from "clsx";

export function LogoMark({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          "flex items-center justify-center rounded-lg bg-emerald-700 text-white shadow-[0_12px_30px_rgba(0,122,90,0.20)]",
          compact ? "h-10 w-10 text-sm font-bold" : "h-12 w-12 text-base font-bold",
        )}
      >
        DK
      </div>
      <div>
        <div className={clsx("text-sm font-semibold uppercase", inverse ? "text-emerald-100/80" : "text-slate-500")}>Digital Wallet</div>
        <div className={clsx("text-lg font-semibold tracking-tight", inverse ? "text-white" : "text-slate-950")}>DompetKu</div>
      </div>
    </div>
  );
}
