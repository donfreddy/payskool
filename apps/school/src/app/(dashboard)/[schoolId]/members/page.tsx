import { UserCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { MembersBoard } from "@/features/members/components/members-board";

interface MembersPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[{ label: "Administration", icon: UserCheck }]}
        title="Membres & équipe"
        subtitle="Collaborateurs ayant accès à l’application : rôles, invitations en attente et suspension des accès."
      />

      <MembersBoard schoolId={schoolId} />
    </div>
  );
}