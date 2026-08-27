import { AlertTriangle, FileText, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { OverdueBoard } from "@/features/reports/components/overdue-board";

interface OverduePageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function OverduePage({ params }: OverduePageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: FileText },
          { label: "Rapports & Recouvrement", icon: TrendingUp },
          { label: "Impayés & relances", icon: AlertTriangle },
        ]}
        title="Impayés & relances"
        subtitle="Élèves en défaut de paiement, latence des échéances et relances des parents, mode d'emploi de la campagne."
      />

      <OverdueBoard schoolId={schoolId} />
    </div>
  );
}