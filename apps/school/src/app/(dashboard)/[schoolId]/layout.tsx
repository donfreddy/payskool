import { Sidebar } from "@/components/layout/sidebar";
import { HeaderBar } from "@/components/layout/header-bar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ schoolId: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const resolvedParams = await params;
  const schoolId = resolvedParams.schoolId;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar schoolId={schoolId} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderBar />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
