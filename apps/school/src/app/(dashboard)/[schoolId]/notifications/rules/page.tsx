import { Bell, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { RulesBoard } from "@/features/notifications/components/rules-board";

interface RulesPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function RulesPage({ params }: RulesPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Communication", icon: Bell },
          { label: "Relances & Notifications", icon: SlidersHorizontal },
          { label: "Règles de relance", icon: SlidersHorizontal },
        ]}
        title="Règles de relance"
        subtitle="Escalade automatique des rappels aux parents : canal, délai après l'échéance et modèle de message commun."
      />

      <RulesBoard schoolId={schoolId} />
    </div>
  );
}