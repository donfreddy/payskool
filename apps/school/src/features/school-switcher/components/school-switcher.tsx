"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronsUpDown, PlusCircle, Building2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@payskool/ui/components/ui/dropdown-menu";

interface School {
  id: string;
  name: string;
  logo: string;
}

interface SchoolSwitcherProps {
  schools: School[];
}

export function SchoolSwitcher({ schools }: SchoolSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const currentSchoolId = params.schoolId as string;
  
  const currentSchool = schools.find((s) => s.id === currentSchoolId) || schools[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center w-full p-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
        <div className="flex items-center justify-center w-8 h-8 mr-2 bg-payskool-emerald/10 text-payskool-emerald rounded-md">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start flex-1 text-sm text-left truncate">
          <span className="font-semibold text-slate-900 truncate">
            {currentSchool?.name || "Sélectionner..."}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 text-slate-500" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-60" align="start">
        {schools.map((school) => (
          <DropdownMenuItem 
            key={school.id}
            onClick={() => router.push(`/${school.id}/dashboard`)}
            className="cursor-pointer"
          >
            <span className="mr-2">{school.logo}</span>
            <span className="truncate">{school.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/new-school')} className="cursor-pointer text-payskool-emerald">
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un établissement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
