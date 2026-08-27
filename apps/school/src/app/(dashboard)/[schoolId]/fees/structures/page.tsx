import { CalendarRange, FileText } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StructuresBoard } from "@/features/fees/structures/components/structures-board";

interface FeeStructuresPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function FeeStructuresPage({ params }: FeeStructuresPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: FileText },
          { label: "Grilles par classe & échéances", icon: CalendarRange },
        ]}
        title="Grilles tarifaires"
        subtitle="Le contrat de scolarité de chaque classe : montants des tranches, échéances et taux de recouvrement."
      />

      <StructuresBoard schoolId={schoolId} />
    </div>
  );
}