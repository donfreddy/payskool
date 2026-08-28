import { Users, CalendarClock } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { RenewalBoard } from "@/features/renewal/components/renewal-board";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface RenewalPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function RenewalPage({ params, searchParams }: RenewalPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Élèves & Inscriptions", icon: Users },
          { label: "Réinscription 2027-2028", icon: CalendarClock },
        ]}
        title="Réinscription 2027-2028"
        subtitle="Préparez la reconduction des élèves sur la prochaine année : sélection, arriérés à solder et frais de réinscription."
      />

      {readOnly && <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/students/renewal`} />}

      <RenewalBoard year={academicYear} />
    </div>
  );
}