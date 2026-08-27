import { Badge } from "@payskool/ui/components/ui/badge";
import { cn } from "@payskool/ui/utils";

import type { FakeInstallment } from "@/core/mocks/fake-data";
import { isInstallmentOverdue } from "@/lib/fees";
import { formatCFA, formatShortDate } from "@/lib/format";

export function TrancheRows({ installments }: { installments: FakeInstallment[] }) {
  return (
    <ul className="space-y-2">
      {installments.map((i, idx) => {
        const remaining = Math.max(i.amount - i.paid, 0);
        const overdue = isInstallmentOverdue(i.dueDate, i.paid, i.amount);
        const tone = remaining === 0 ? "emerald" : overdue ? "orange" : "slate";
        return (
          <li key={i.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                tone === "emerald" && "bg-payskool-emerald text-white",
                tone === "orange" && "bg-payskool-orange text-white",
                tone === "slate" && "bg-slate-200 text-slate-600",
              )}
            >
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{i.label}</p>
              <p className="text-[11px] text-muted-foreground">
                échéance {formatShortDate(i.dueDate)}
              </p>
            </div>
            <div className="text-right">
              <p className={cn("font-mono text-sm font-bold", remaining === 0 ? "text-payskool-emerald" : "text-foreground")}>
                {formatCFA(remaining)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                de {formatCFA(i.amount)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 rounded-md border-transparent px-1.5 text-[10px] font-bold uppercase",
                remaining === 0 && "bg-payskool-emerald/10 text-payskool-emerald",
                remaining > 0 && overdue && "bg-payskool-orange/10 text-payskool-orange",
                remaining > 0 && !overdue && "bg-blue-100 text-blue-700",
              )}
            >
              {remaining === 0 ? "Soldée" : overdue ? "Retard" : "Partielle"}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}