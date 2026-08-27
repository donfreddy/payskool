import { cn } from "@payskool/ui/utils";
import {
  Banknote,
  FileText,
  Phone,
  Smartphone,
  Waves,
  type LucideIcon,
} from "lucide-react";

import type { TxMethod } from "@/core/mocks/fake-data";

export const TX_METHOD_LABELS: Record<TxMethod, string> = {
  CASH: "Espèces",
  CHEQUE: "Chèque",
  ORANGE_MONEY: "Orange Money",
  MTN_MOMO: "MTN MoMo",
  WAVE: "Wave",
};

const config: Record<TxMethod, { icon: LucideIcon; tone: string }> = {
  CASH: { icon: Banknote, tone: "bg-payskool-navy/10 text-payskool-navy" },
  CHEQUE: { icon: FileText, tone: "bg-violet-100 text-violet-700" },
  ORANGE_MONEY: { icon: Smartphone, tone: "bg-payskool-orange/10 text-payskool-orange" },
  MTN_MOMO: { icon: Phone, tone: "bg-amber-100 text-amber-700" },
  WAVE: { icon: Waves, tone: "bg-cyan-100 text-cyan-700" },
};

export function TxMethodBadge({ method, className }: { method: TxMethod; className?: string }) {
  const { icon: Icon, tone } = config[method];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold",
        tone,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {TX_METHOD_LABELS[method]}
    </span>
  );
}