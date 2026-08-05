"use client";

import { Search, Menu } from "lucide-react";
import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FullscreenToggle } from "./full-screen-toggle";
import { UserDropdown } from "./user-dropdown";

interface HeaderBarProps {
  onMenuClick?: () => void;
}

export function HeaderBar({ onMenuClick }: HeaderBarProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
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

        <div className="relative hidden md:flex items-center max-w-md w-full ml-4">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un élève, un reçu... (Cmd+K)"
            className="w-full pl-9 h-9 bg-muted border-border focus-visible:ring-payskool-emerald"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground hidden sm:block">
          Filtre Année Scolaire: <span className="font-medium text-foreground">2026-2027</span>
        </div>
        
        <FullscreenToggle />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  );
}
