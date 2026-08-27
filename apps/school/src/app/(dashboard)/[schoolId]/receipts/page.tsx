import { Calculator, ReceiptText } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReceiptsBrowser } from "@/features/receipts/components/receipts-browser";

interface ReceiptsPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function ReceiptsPage({ params, searchParams }: ReceiptsPageProps) {
  const [{ schoolId }, { q }] = await Promise.all([params, searchParams]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: Calculator },
          { label: "Reçus", icon: ReceiptText },
        ]}
        title="Reçus & réimpressions"
        subtitle="Retrouvez n'importe quel reçu par numéro, élève ou matricule, vérifiez sa ventilation et réimprimez-le."
      />

      <ReceiptsBrowser schoolId={schoolId} initialQuery={q} />
    </div>
  );
}