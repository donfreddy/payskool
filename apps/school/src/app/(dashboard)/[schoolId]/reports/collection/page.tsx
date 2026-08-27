import { FileText, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { CollectionBoard } from "@/features/reports/components/collection-board";
import { consultAcademicYear } from "@/lib/academic-year-guard";

interface CollectionPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: FileText },
          { label: "Rapports & Recouvrement", icon: TrendingUp },
          { label: "Taux de recouvrement", icon: TrendingUp },
        ]}
        title="Taux de recouvrement"
        subtitle={`Encaissements de ${academicYear} à date, modes de paiement et performance de chaque classe par rapport aux grilles attendues.`}
      />

      <CollectionBoard schoolId={schoolId} year={academicYear} />
    </div>
  );
}