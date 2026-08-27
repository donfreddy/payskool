"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Menu } from "lucide-react";
import { Suspense } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";

import { AcademicYearDropdown } from "./academic-year-dropdown";
import { FullscreenToggle } from "./full-screen-toggle";
import { NotificationDropdown } from "./notification-dropdown";
import { SearchCommand } from "./search-command";
import { UserDropdown } from "./user-dropdown";

interface HeaderBarProps {
  onMenuClick?: () => void;
  schoolId: string;
}

export function HeaderBar({ onMenuClick, schoolId }: HeaderBarProps) {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9 text-muted-foreground"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <SearchCommand />

        <Suspense fallback={null}>
          <AcademicYearDropdown />
        </Suspense>

        <div className="h-6 w-0.5 bg-muted m-1.5" />

        <NotificationDropdown />
        <FullscreenToggle />
        <ThemeToggle />
        <div className="h-6 w-0.5 bg-muted mr-1.5" />
        <UserDropdown schoolId={schoolId} />
      </div>
    </header>
  );
}
