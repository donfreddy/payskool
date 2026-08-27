import { Bell, History, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { HistoryBoard } from "@/features/notifications/components/history-board";

interface HistoryPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Communication", icon: Bell },
          { label: "Relances & Notifications", icon: SlidersHorizontal },
          { label: "Historique d'envoi", icon: History },
        ]}
        title="Historique d'envoi"
        subtitle="Traçabilité de chaque relance adressée aux parents : canal, destinataire, lecture et éventuels échecs."
      />

      <HistoryBoard schoolId={schoolId} />
    </div>
  );
}