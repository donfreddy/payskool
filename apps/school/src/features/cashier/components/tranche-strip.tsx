import { cn } from "@payskool/ui/utils";

import type { FakeInstallment } from "@/core/mocks/fake-data";
import { isInstallmentOverdue } from "@/lib/fees";
import { formatCFA, formatShortDate } from "@/lib/format";

function statusOf(i: FakeInstallment) {
  const remaining = Math.max(i.amount - i.paid, 0);
  if (remaining === 0) return { label: "Soldée", tone: "paid" as const };
  if (isInstallmentOverdue(i.dueDate, i.paid, i.amount)) {
    return { label: "En retard", tone: "overdue" as const };
  }
  if (i.paid > 0) return { label: "Partielle", tone: "partial" as const };
  return { label: "À échoir", tone: "pending" as const };
}

const chipTones = {
  paid: "bg-payskool-emerald/10 text-payskool-emerald",
  overdue: "bg-payskool-orange/10 text-payskool-orange",
  partial: "bg-blue-100 text-blue-700",
  pending: "bg-secondary text-muted-foreground",
};

const dotTones = {
  paid: "bg-payskool-emerald",
  overdue: "bg-payskool-orange",
  partial: "bg-blue-500",
  pending: "bg-slate-300",
};

export function TrancheStrip({
  installment,
  index,
  isDue,
}: {
  installment: FakeInstallment;
  index: number;
  isDue: boolean;
}) {
  const status = statusOf(installment);
  const pct = Math.round((installment.paid / installment.amount) * 100);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        isDue ? "border-payskool-emerald/30 bg-payskool-emerald/[0.04]" : "border-border",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
          dotTones[status.tone],
          status.tone === "paid" && "text-white",
          status.tone === "overdue" && "text-white",
          status.tone !== "paid" && status.tone !== "overdue" && "text-primary-foreground",
        )}
      >
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{installment.label}</p>
          <span className={cn("shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase", chipTones[status.tone])}>
            {status.label}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatCFA(installment.amount)} · échéance {formatShortDate(installment.dueDate)}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full",
              status.tone === "overdue" ? "bg-payskool-orange" : "bg-payskool-emerald",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">{formatCFA(installment.paid)}</span> réglés
          {installment.amount - installment.paid > 0 && (
            <>
              {" · "}
              <span className="font-semibold text-payskool-orange">{formatCFA(installment.amount - installment.paid)}</span> reste
            </>
          )}
        </p>
      </div>
    </div>
  );
}