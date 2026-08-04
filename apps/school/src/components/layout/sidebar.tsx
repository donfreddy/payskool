"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { getNavItems, Role } from "@/features/auth/rbac/nav-items";
import { SchoolSwitcher } from "@/features/school-switcher/components/school-switcher";
import { FAKE_SCHOOLS, FAKE_USER } from "@/core/mocks/fake-data";
import { Avatar, AvatarFallback } from "@payskool/ui/components/ui/avatar";

interface SidebarProps {
  schoolId: string;
}

export function Sidebar({ schoolId }: SidebarProps) {
  const pathname = usePathname();
  // Using FAKE_USER for now
  const userRole = FAKE_USER.role as Role; 
  
  const navItems = getNavItems(userRole, schoolId);

  return (
    <aside className="w-64 border-r border-slate-200 bg-[#F8FAFC] flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-6 pb-4">
        <Link href={`/${schoolId}/dashboard`} className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-[#059669]" />
          <span className="text-xl font-bold tracking-tight text-[#0F172A]">
            Pay<span className="text-[#059669]">skool</span>
          </span>
        </Link>
        <SchoolSwitcher schools={FAKE_SCHOOLS} />
      </div>

      {/* Navigation Filtered by Role */}
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                isActive 
                  ? "bg-[#0F172A]/5 text-[#0F172A] font-medium" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-[#0F172A]" : "text-slate-400"}`} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200 mt-auto">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-[#0F172A] text-white">
              {FAKE_USER.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 leading-none">
              {FAKE_USER.name}
            </span>
            <span className="text-xs text-slate-500 mt-1 capitalize">
              {FAKE_USER.role.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
