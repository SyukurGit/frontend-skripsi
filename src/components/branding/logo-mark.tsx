import clsx from "clsx";

export function LogoMark({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          "flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#335cff,#1d4ed8)] text-white shadow-[0_12px_30px_rgba(51,92,255,0.28)]",
          compact ? "h-10 w-10 text-sm font-bold" : "h-12 w-12 text-base font-bold",
        )}
      >
        DK
      </div>
      <div>
        <div className={clsx("text-sm font-semibold tracking-[0.18em]", inverse ? "text-blue-100/78" : "text-slate-500")}>DIGITAL WALLET</div>
        <div className={clsx("text-lg font-semibold tracking-tight", inverse ? "text-white" : "text-slate-950")}>DompetKu</div>
      </div>
    </div>
  );
}
