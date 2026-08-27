import { CalendarRange, FileText } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StructuresBoard } from "@/features/fees/structures/components/structures-board";
import { requireCurrentAcademicYear } from "@/lib/academic-year-guard";

interface FeeStructuresPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function FeeStructuresPage({ params, searchParams }: FeeStructuresPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  requireCurrentAcademicYear(year, `/${schoolId}/fees/structures`);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: FileText },
          { label: "Grilles par classe & échéances", icon: CalendarRange },
        ]}
        title="Grilles tarifaires"
        subtitle="Le contrat de scolarité de chaque classe : montants des tranches, échéances et taux de recouvrement."
      />

      <StructuresBoard schoolId={schoolId} />
    </div>
  );
}