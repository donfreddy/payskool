"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { HeaderBar } from "./header-bar";
import { Footer } from "./footer";

interface DashboardShellProps {
  schoolId: string;
  children: React.ReactNode;
}

export function DashboardShell({ schoolId, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        schoolId={schoolId}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <HeaderBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-muted/40 min-h-[calc(100svh-6.82rem)] p-4 md:p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
