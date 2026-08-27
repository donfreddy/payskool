import { Badge } from "@payskool/ui/components/ui/badge";
import { cn } from "@payskool/ui/utils";
import { CheckCircle2, CircleDollarSign, Clock3, AlertTriangle, Ban } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { PaymentStatus } from "@/lib/fees";
import { PAYMENT_STATUS_LABELS } from "@/lib/fees";

const config: Record<PaymentStatus, { variant: string; icon: LucideIcon }> = {
  PAID: {
    variant: "bg-payskool-emerald/10 text-payskool-emerald",
    icon: CheckCircle2,
  },
  AHEAD: {
    variant: "bg-cyan-100 text-cyan-700",
    icon: CircleDollarSign,
  },
  PARTIAL: {
    variant: "bg-blue-100 text-blue-700",
    icon: Clock3,
  },
  OVERDUE: {
    variant: "bg-payskool-orange/10 text-payskool-orange",
    icon: AlertTriangle,
  },
  UNPAID: {
    variant: "bg-secondary text-muted-foreground",
    icon: Ban,
  },
};

export function PaymentBadge({ status, className }: { status: PaymentStatus; className?: string }) {
  const { variant, icon: Icon } = config[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 rounded-md border-transparent font-semibold",
        variant,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {PAYMENT_STATUS_LABELS[status]}
    </Badge>
  );
}