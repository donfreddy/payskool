import { School } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { SchoolBoard } from "@/features/settings/components/school-board";

interface SchoolSettingsPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function SchoolSettingsPage({ params }: SchoolSettingsPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[{ label: "Paramètres", icon: School }]}
        title="École"
        subtitle="Fiche d’identité de l’établissement : coordonnées, responsable et année académique en cours."
      />

      <SchoolBoard schoolId={schoolId} />
    </div>
  );
}