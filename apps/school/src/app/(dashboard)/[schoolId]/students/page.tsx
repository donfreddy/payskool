import { Users, List } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { StudentsView } from "@/features/students/components/students-view";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface StudentsPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function StudentsPage({ params, searchParams }: StudentsPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Élèves & Inscriptions", icon: Users },
          { label: "Liste des élèves", icon: List },
        ]}
        title="Élèves & Inscriptions"
        subtitle="Registre des élèves et état de leur scolarité (situation financière uniquement)."
      />

      {readOnly && <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/students`} />}

      <StudentsView schoolId={schoolId} year={academicYear} readOnly={readOnly} />
    </div>
  );
}