import { DashboardShell } from "@/components/layout/dashboard-shell";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ schoolId: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const resolvedParams = await params;
  const schoolId = resolvedParams.schoolId;

  return (
    <DashboardShell schoolId={schoolId}>
      {children}
    </DashboardShell>
  );
}
