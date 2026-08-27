import { Upload, Users } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ImportWizard } from "@/features/students/import/components/import-wizard";

interface ImportPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function StudentImportPage({ params }: ImportPageProps) {
  const { schoolId } = await params;

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

      <ImportWizard schoolId={schoolId} />
    </div>
  );
}