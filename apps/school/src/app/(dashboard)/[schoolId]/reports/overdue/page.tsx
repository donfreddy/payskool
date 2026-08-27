import { AlertTriangle, FileText, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { OverdueBoard } from "@/features/reports/components/overdue-board";
import { consultAcademicYear } from "@/lib/academic-year-guard";

interface OverduePageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function OverduePage({ params, searchParams }: OverduePageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: FileText },
          { label: "Rapports & Recouvrement", icon: TrendingUp },
          { label: "Impayés & relances", icon: AlertTriangle },
        ]}
        title="Impayés & relances"
        subtitle={`Élèves de ${academicYear} en défaut de paiement, latence des échéances et relances des parents, mode d'emploi de la campagne.`}
      />

      <OverdueBoard schoolId={schoolId} year={academicYear} />
    </div>
  );
}