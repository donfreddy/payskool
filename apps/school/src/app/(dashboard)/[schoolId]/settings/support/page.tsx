import { LifeBuoy, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { SupportBoard } from "@/features/settings/components/support-board";

interface SupportPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Paramètres", icon: SlidersHorizontal },
          { label: "Aide & Support", icon: LifeBuoy },
        ]}
        title="Aide & Support"
        subtitle="Centre d’aide, canaux de contact adaptés à votre abonnement et suivi de vos tickets."
      />

      <SupportBoard schoolId={schoolId} />
    </div>
  );
}