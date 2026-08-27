import { UserCog } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileBoard } from "@/features/settings/components/profile-board";

interface ProfilePageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[{ label: "Paramètres", icon: UserCog }]}
        title="Profil"
        subtitle="Vos informations, vos préférences de langue et la sécurité du compte (mot de passe, 2FA, sessions)."
      />

      <ProfileBoard schoolId={schoolId} />
    </div>
  );
}