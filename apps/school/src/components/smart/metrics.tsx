import { Progress } from "@payskool/ui/components/ui/progress";
import { Clock3, GraduationCap, ReceiptText, TrendingUp, Wallet } from "lucide-react";

import { formatCFA } from "@/lib/format";

function Shell({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export interface YearMetrics {
  year: string;
  readOnly: boolean;
  collected: number;
  totalDue: number;
  recovery: number; // 0 → 100
  receiptsCount: number;
  studentCount: number;
  uptoDate: number;
}

export function MetricsGrid({
  year,
  readOnly,
  collected,
  totalDue,
  recovery,
  receiptsCount,
  studentCount,
  uptoDate,
}: YearMetrics) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Shell title="Recouvrement Total" icon={Wallet}>
        <p className="text-2xl font-bold tracking-tight text-success">{formatCFA(collected)}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="size-3.5 text-success" />
          <span className="font-medium text-success">{uptoDate}/{studentCount}</span> élèves à jour sur {year}
        </p>
      </Shell>

      <Shell title="Taux de Recouvrement" icon={TrendingUp}>
        <p className="text-2xl font-bold tracking-tight text-foreground">{recovery}%</p>
        <Progress value={recovery} className="mt-3 h-1.5 bg-secondary [&>div]:bg-success" />
        <p className="mt-1 text-xs text-muted-foreground">{formatCFA(totalDue)} attendus au total</p>
      </Shell>

      <Shell title="Reçus émis" icon={ReceiptText}>
        <p className="text-2xl font-bold tracking-tight text-foreground">{receiptsCount}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="size-3.5" />
          {readOnly ? "Registre archivé — lecture seule" : `Registre ${year}`}
        </p>
      </Shell>

      <Shell title="Élèves inscrits" icon={GraduationCap}>
        <p className="text-2xl font-bold tracking-tight text-foreground">{studentCount}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {readOnly ? "Année clôturée — consultation" : "Effectif déclaré"}
        </p>
      </Shell>
    </div>
  );
}