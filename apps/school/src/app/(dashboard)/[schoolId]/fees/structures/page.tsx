import { CalendarRange, FileText } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { StructuresBoard } from "@/features/fees/structures/components/structures-board";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface FeeStructuresPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function FeeStructuresPage({ params, searchParams }: FeeStructuresPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

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

      {readOnly && <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/fees/structures`} />}

      <StructuresBoard schoolId={schoolId} year={academicYear} readOnly={readOnly} />
    </div>
  );
}