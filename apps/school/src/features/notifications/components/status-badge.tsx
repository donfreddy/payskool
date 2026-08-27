import { cn } from "@payskool/ui/utils";
import { CheckCheck, CircleCheck, Clock3, TriangleAlert, type LucideIcon } from "lucide-react";

import type { NotificationStatus } from "@/core/mocks/fake-data";

export const STATUS_LABELS: Record<NotificationStatus, string> = {
  SENT: "Envoyé",
  DELIVERED: "Délivré",
  READ: "Lu",
  FAILED: "Échec",
};

const config: Record<NotificationStatus, { icon: LucideIcon; tone: string }> = {
  SENT: { icon: Clock3, tone: "bg-secondary text-muted-foreground" },
  DELIVERED: { icon: CheckCheck, tone: "bg-cyan-100 text-cyan-700" },
  READ: { icon: CircleCheck, tone: "bg-payskool-emerald/10 text-payskool-emerald" },
  FAILED: { icon: TriangleAlert, tone: "bg-red-100 text-red-700" },
};

export function StatusBadge({ status, className }: { status: NotificationStatus; className?: string }) {
  const { icon: Icon, tone } = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold", tone, className)}>
      <Icon className="size-3.5" />
      {STATUS_LABELS[status]}
    </span>
  );
}