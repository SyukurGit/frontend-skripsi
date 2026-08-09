import { WalletCards } from "lucide-react";
import { cn } from "@/utils/cn";

export function LogoMark({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-[#22262f] text-white",
          compact ? "h-9 w-9" : "h-11 w-11",
        )}
      >
        <WalletCards className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </div>
      <div>
        <div className={cn("text-[11px] font-medium", inverse ? "text-white/55" : "text-[#7b8492]")}>Prototipe dompet digital</div>
        <div className={cn("text-base font-semibold", inverse ? "text-white" : "text-[#171a21]")}>DompetKu</div>
      </div>
    </div>
  );
}
