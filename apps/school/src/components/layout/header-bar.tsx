"use client";

import { Menu, CalendarDays } from "lucide-react";
import { Button } from "@payskool/ui/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FullscreenToggle } from "./full-screen-toggle";
import { UserDropdown } from "./user-dropdown";
import { NotificationDropdown } from "./notification-dropdown";
import { SearchCommand } from "./search-command";

interface HeaderBarProps {
  onMenuClick?: () => void;
}

export function HeaderBar({ onMenuClick }: HeaderBarProps) {
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

        <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
          <CalendarDays className="size-4 text-muted-foreground" />
          Année Scolaire : 2026-2027
        </button>

        <div className="h-6 w-0.5 bg-muted m-1.5" />

        <NotificationDropdown />
        <FullscreenToggle />
        <ThemeToggle />
        <div className="h-6 w-0.5 bg-muted mr-1.5" />
        <UserDropdown />
      </div>
    </header>
  );
}
