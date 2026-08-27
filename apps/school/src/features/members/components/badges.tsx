import { cn } from "@payskool/ui/utils";

import type { MemberRole, MemberStatus } from "@/core/mocks/fake-data";
import { ROLE_LABELS, ROLE_TONES, STATUS_LABELS, STATUS_TONES } from "@/features/members/lib/labels";

export function RoleBadge({ role, className }: { role: MemberRole; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold", ROLE_TONES[role], className)}>
      {ROLE_LABELS[role]}
    </span>
  );
}

export function MemberStatusBadge({ status, className }: { status: MemberStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold", STATUS_TONES[status], className)}>
      <span className={cn("mr-1.5 size-1.5 rounded-full", status === "ACTIVE" ? "bg-payskool-emerald" : status === "INVITED" ? "bg-amber-400" : "bg-red-500")} />
      {STATUS_LABELS[status]}
    </span>
  );
}