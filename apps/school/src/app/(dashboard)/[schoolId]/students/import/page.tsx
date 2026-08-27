import { Upload, Users } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { ArchiveReadonlyPanel } from "@/components/shared/archive-readonly-panel";
import { ImportWizard } from "@/features/students/import/components/import-wizard";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface ImportPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function StudentImportPage({ params, searchParams }: ImportPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Élèves & Inscriptions", icon: Users },
          { label: "Importer (CSV/Excel)", icon: Upload },
        ]}
        title="Importer une liste d'élèves"
        subtitle="Import en lot depuis CSV/Excel : mappage automatique, contrôle de validation, puis import transactionnel."
      />

      {readOnly ? (
        <>
          <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/students/import`} />
          <ArchiveReadonlyPanel
            year={academicYear}
            title="Import désactivé sur une année clôturée"
            description="Les admissions de cette année sont archivées. Importez de nouveaux élèves uniquement sur l'année en cours."
          />
        </>
      ) : (
        <ImportWizard schoolId={schoolId} />
      )}
    </div>
  );
}