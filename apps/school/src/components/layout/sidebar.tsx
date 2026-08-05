"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, PanelLeft, X, ChevronDown } from "lucide-react";
import { cn } from "@payskool/ui/utils";
import { getNavSections, type Role, type NavItem } from "@/features/auth/rbac/nav-items";
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

function NavLink({
  item,
  collapsed,
  onMobileClose,
  children,
}: {
  item: NavItem;
  collapsed: boolean;
  onMobileClose?: () => void;
  parentActive?: boolean;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isChildActive = item.items?.some((sub) => sub.href && pathname.startsWith(sub.href)) ?? false;
  const isActive = item.href ? pathname.startsWith(item.href) : isChildActive;

  if (collapsed && item.href) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md mx-auto transition-colors",
              isActive
                ? "bg-payskool-emerald/10 text-payskool-emerald"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  if (collapsed && !item.href) {
    return null;
  }

  if (item.items) {
    const expanded = open || isChildActive;
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "w-full flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
            expanded
              ? "text-payskool-emerald"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.title}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
        </button>
        <div className={cn("ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2", !expanded && "hidden")}>
          {item.items.map((sub) => (
            <NavLink
              key={sub.title}
              item={sub}
              collapsed={false}
              {...(onMobileClose ? { onMobileClose } : {})}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      {...(onMobileClose ? { onClick: onMobileClose as React.MouseEventHandler<HTMLAnchorElement> } : {})}
      className={cn(
        "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-payskool-emerald/10 text-payskool-emerald"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        children && "pl-4"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span>{item.title}</span>
      {children}
    </Link>
  );
}

export function Sidebar({ schoolId, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const userRole = FAKE_USER.role as Role;
  const sections = getNavSections({ role: userRole, schoolId });

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex h-screen flex-col border-r border-border bg-card shrink-0 z-30",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-14" : "w-60",
          "fixed inset-y-0 left-0 lg:static",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3.5 top-5 z-20 h-7 w-7 rounded-full border border-border bg-card shadow-sm hover:bg-accent hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", collapsed && "rotate-180")} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
          className="absolute right-3 top-3 z-20 h-8 w-8 rounded-md lg:hidden"
          aria-label="Fermer le menu"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Link
          href={`/${schoolId}/dashboard`}
          className="flex items-center gap-2 px-3 py-4 overflow-hidden"
          {...(onMobileClose ? { onClick: onMobileClose as React.MouseEventHandler<HTMLAnchorElement> } : {})}
        >
          <Shield className="h-6 w-6 shrink-0 text-[#059669]" />
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
              Pay<span className="text-[#059669]">skool</span>
            </span>
          )}
        </Link>

        <div className="px-2">
          <SchoolSwitcher schools={FAKE_SCHOOLS} collapsed={collapsed} />
        </div>

        <nav className="mt-2 flex flex-col flex-1 overflow-y-auto px-2">
          {sections.map((section) => (
            <div key={section.heading} className="mb-4">
              {!collapsed && (
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {section.heading}
                </p>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.title}
                  item={item}
                  collapsed={collapsed}
                  {...(onMobileClose ? { onMobileClose } : {})}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className={cn("mt-auto border-t border-border p-3 flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarFallback className="rounded-lg bg-[#0F172A] text-white text-sm">
              {FAKE_USER.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="grid text-left text-sm leading-tight min-w-0">
              <span className="truncate font-semibold text-foreground">{FAKE_USER.name}</span>
              <span className="truncate text-xs text-muted-foreground capitalize">{FAKE_USER.role.toLowerCase()}</span>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

export { Sidebar as PayskoolSidebar };
