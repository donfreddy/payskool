import { TrendingUp, Wallet, Clock3, GraduationCap } from "lucide-react";
import { Progress } from "@payskool/ui/components/ui/progress";

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

export function MetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Shell title="Recouvrement Total" icon={Wallet}>
        <p className="text-2xl font-bold tracking-tight text-success">45.200.000 FCFA</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="size-3.5 text-success" />
          <span className="font-medium text-success">+14%</span> vs 2025
        </p>
      </Shell>

      <Shell title="Taux de Recouvrement" icon={TrendingUp}>
        <p className="text-2xl font-bold tracking-tight text-foreground">78%</p>
        <Progress value={78} className="mt-3 h-1.5 bg-secondary [&>div]:bg-success" />
      </Shell>

      <Shell title="Reste à Encaisser" icon={Clock3}>
        <p className="text-2xl font-bold tracking-tight text-foreground">12.800.000 FCFA</p>
        <p className="mt-1 text-xs text-muted-foreground">Tranches 2 & 3 en attente</p>
      </Shell>

      <Shell title="Élèves à Jour" icon={GraduationCap}>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          412 <span className="text-base font-medium text-muted-foreground">/ 520</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">80% de la totalité</p>
      </Shell>
    </div>
  );
}