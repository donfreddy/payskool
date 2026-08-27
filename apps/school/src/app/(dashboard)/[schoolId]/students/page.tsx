import { Users, List } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StudentsView } from "@/features/students/components/students-view";
import { requireCurrentAcademicYear } from "@/lib/academic-year-guard";

interface StudentsPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function StudentsPage({ params, searchParams }: StudentsPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  requireCurrentAcademicYear(year, `/${schoolId}/students`);

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

      <StudentsView schoolId={schoolId} />
    </div>
  );
}