"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, PanelLeft, X } from "lucide-react";
import { cn } from "@payskool/ui/utils";
import { getNavItems, Role } from "@/features/auth/rbac/nav-items";
import { SchoolSwitcher } from "@/features/school-switcher/components/school-switcher";
import { FAKE_SCHOOLS, FAKE_USER } from "@/core/mocks/fake-data";
import { Avatar, AvatarFallback } from "@payskool/ui/components/ui/avatar";
import { Button } from "@payskool/ui/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@payskool/ui/components/ui/tooltip";

interface SidebarProps {
  schoolId: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ schoolId, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const userRole = FAKE_USER.role as Role;
  const navItems = getNavItems(userRole, schoolId);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          // Base styles
          "relative flex h-screen flex-col border-r border-slate-200 bg-white shrink-0 z-30",
          // Desktop: always visible, transition width
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[56px]" : "w-[240px]",
          // Mobile: fixed overlay, slide in/out
          "fixed inset-y-0 left-0 lg:static",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3.5 top-5 z-20 h-7 w-7 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className={cn("h-4 w-4 text-slate-500 transition-transform duration-300", collapsed && "rotate-180")} />
        </Button>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
          className="absolute right-3 top-3 z-20 h-8 w-8 rounded-md lg:hidden"
          aria-label="Fermer le menu"
        >
          <X className="h-4 w-4 text-slate-500" />
        </Button>

        {/* Logo */}
        <Link
          href={`/${schoolId}/dashboard`}
          className="flex items-center gap-2 px-3 py-4 overflow-hidden"
          onClick={onMobileClose}
        >
          <Shield className="h-6 w-6 shrink-0 text-[#059669]" />
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-[#0F172A] whitespace-nowrap">
              Pay<span className="text-[#059669]">skool</span>
            </span>
          )}
        </Link>

        {/* School Switcher */}
        <div className="px-2">
          <SchoolSwitcher schools={FAKE_SCHOOLS} collapsed={collapsed} />
        </div>

        {/* Nav items */}
        <nav className="mt-2 flex flex-col gap-1 flex-1 overflow-y-auto px-2">
          {!collapsed && (
            <p className="px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Menu Principal
            </p>
          )}
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-md mx-auto transition-colors",
                        isActive
                          ? "bg-[#059669]/10 text-[#059669]"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#059669]/10 text-[#059669]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer - user profile */}
        <div className={cn("mt-auto border-t border-slate-200 p-3 flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarFallback className="rounded-lg bg-[#0F172A] text-white text-sm">
              {FAKE_USER.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="grid text-left text-sm leading-tight min-w-0">
              <span className="truncate font-semibold text-slate-900">{FAKE_USER.name}</span>
              <span className="truncate text-xs text-slate-500 capitalize">{FAKE_USER.role.toLowerCase()}</span>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
