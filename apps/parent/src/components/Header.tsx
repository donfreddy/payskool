import { ChevronDown, Bell, ShieldCheck } from 'lucide-react';
import type { Student } from '../types/models';

interface HeaderProps {
  activeStudent: Student;
}

export function Header({ activeStudent }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-5 h-5 text-emeraude" />
        <span className="font-extrabold tracking-tight text-slate-navy">
          PAYS<span className="text-emeraude">KOOL</span>
        </span>
      </div>

      {/* Center: Student Selector */}
      <button className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-3 py-1.5 text-sm font-medium text-slate-navy hover:bg-slate-50 transition-colors">
        <span className="truncate max-w-[120px]">
          {activeStudent.name} ({activeStudent.grade})
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {/* Right: Notifications */}
      <button className="relative p-2 text-slate-navy hover:bg-slate-200/50 rounded-full transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
      </button>
    </header>
  );
}
