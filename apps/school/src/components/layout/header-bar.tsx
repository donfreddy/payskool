"use client";

import { Search } from "lucide-react";
import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";

export function HeaderBar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-lg font-semibold text-[#0F172A]">Vue d'ensemble</h1>
        
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center max-w-md w-full ml-4">
          <Search className="absolute left-2.5 h-4 w-4 text-slate-400" />
          <Input 
            type="search"
            placeholder="Rechercher un élève, un reçu... (Cmd+K)"
            className="w-full pl-9 h-9 bg-slate-50 border-slate-200 focus-visible:ring-[#059669]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600 hidden sm:block">
          Filtre Année Scolaire: <span className="font-medium text-slate-900">2026-2027</span>
        </div>
        
        <Button className="bg-[#059669] hover:bg-[#059669]/90 text-white h-9 shadow-sm">
          + Nouveau Règlement Caisse
        </Button>
      </div>
    </header>
  );
}
