import { BadgePercent, FileText } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { DiscountsBoard } from "@/features/fees/discounts/components/discounts-board";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface DiscountsPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function DiscountsPage({ params, searchParams }: DiscountsPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: FileText },
          { label: "Bourses & réductions", icon: BadgePercent },
        ]}
        title="Bourses & réductions"
        subtitle="Bourses au mérite, régionales, partenariats, remises fratrie et règlements comptants accordés aux élèves."
      />

      {readOnly && <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/fees/discounts`} />}

      <DiscountsBoard schoolId={schoolId} year={academicYear} readOnly={readOnly} />
    </div>
  );
}