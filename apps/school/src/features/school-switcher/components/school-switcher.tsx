"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronsUpDown, PlusCircle, Building2 } from "lucide-react";
import { cn } from "@payskool/ui/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@payskool/ui/components/ui/dropdown-menu";
import { Button } from "@payskool/ui/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@payskool/ui/components/ui/tooltip";

export interface School {
  id: string;
  name: string;
  logo: React.ReactNode;
}

export interface SchoolSwitcherProps {
  schools: School[];
  collapsed?: boolean;
}

export function SchoolSwitcher({ schools, collapsed = false }: SchoolSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const currentSchoolId = params.schoolId as string;
  const currentSchool = schools.find((s) => s.id === currentSchoolId) || schools[0];

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-md mx-auto text-slate-600 hover:bg-slate-100 transition-colors">
                  <Building2 className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">Changer d'école</TooltipContent>
          </Tooltip>
          <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={4}>
            {schools.map((school) => (
              <DropdownMenuItem
                key={school.id}
                onClick={() => router.push(`/${school.id}/dashboard`)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-sm border">
                  {school.logo}
                </div>
                <span className="truncate text-sm">{school.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/new-school")}
              className="gap-2 p-2 cursor-pointer text-[#059669]"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="font-medium text-sm">Ajouter un établissement</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2 py-2 h-auto font-normal text-slate-700 hover:bg-slate-100"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#059669] text-white">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <span className={cn("flex-1 text-left text-sm truncate transition-all duration-300", collapsed && "w-0 opacity-0 overflow-hidden")}>
            {currentSchool?.name || "Sélectionner..."}
          </span>
          <ChevronsUpDown className={cn("h-3.5 w-3.5 text-slate-400 shrink-0", collapsed && "hidden")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={4}>
        {schools.map((school) => (
          <DropdownMenuItem
            key={school.id}
            onClick={() => router.push(`/${school.id}/dashboard`)}
            className="gap-2 p-2 cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-sm border">
              {school.logo}
            </div>
            <span className="truncate text-sm">{school.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/new-school")}
          className="gap-2 p-2 cursor-pointer text-[#059669]"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="font-medium text-sm">Ajouter un établissement</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
