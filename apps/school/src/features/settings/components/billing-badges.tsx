import { cn } from "@payskool/ui/utils";

import type { InvoiceStatus, SubscriptionStatus } from "@/core/mocks/platform-billing-db";

const STATUS_TONES: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-payskool-emerald/10 text-payskool-emerald",
  TRIAL: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  PAST_DUE: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_DOTS: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-payskool-emerald",
  TRIAL: "bg-sky-500",
  PAST_DUE: "bg-red-500",
};

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: "Actif",
  TRIAL: "Essai",
  PAST_DUE: "Retard de paiement",
};

export function SubscriptionStatusBadge({
  status,
  className,
}: {
  status: SubscriptionStatus;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", STATUS_TONES[status], className)}>
      <span className={cn("mr-1.5 size-1.5 rounded-full", STATUS_DOTS[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}

const INVOICE_TONES: Record<InvoiceStatus, string> = {
  PAID: "bg-payskool-emerald/10 text-payskool-emerald",
  OPEN: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  OVERDUE: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const INVOICE_DOTS: Record<InvoiceStatus, string> = {
  PAID: "bg-payskool-emerald",
  OPEN: "bg-amber-500",
  OVERDUE: "bg-red-500",
};

const INVOICE_LABELS: Record<InvoiceStatus, string> = {
  PAID: "Payée",
  OPEN: "En attente",
  OVERDUE: "En retard",
};

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", INVOICE_TONES[status], className)}>
      <span className={cn("mr-1.5 size-1.5 rounded-full", INVOICE_DOTS[status])} />
      {INVOICE_LABELS[status]}
    </span>
  );
}