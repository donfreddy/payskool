import { BadgePercent, FileText } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DiscountsBoard } from "@/features/fees/discounts/components/discounts-board";

interface DiscountsPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function DiscountsPage({ params }: DiscountsPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: FileText },
          { label: "Bourses & réductions", icon: BadgePercent },
        ]}
        title="Bourses & réductions"
        subtitle="Bourses au mérite, régionales, partenariats, remises fratrie et règlements comptants accordés aux élèves."
      />

      <DiscountsBoard schoolId={schoolId} />
    </div>
  );
}