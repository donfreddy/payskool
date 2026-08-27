import { FileText, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { CollectionBoard } from "@/features/reports/components/collection-board";

interface CollectionPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: FileText },
          { label: "Rapports & Recouvrement", icon: TrendingUp },
          { label: "Taux de recouvrement", icon: TrendingUp },
        ]}
        title="Taux de recouvrement"
        subtitle="Encaissements à date, modes de paiement et performance de chaque classe par rapport aux grilles attendues."
      />

      <CollectionBoard schoolId={schoolId} />
    </div>
  );
}