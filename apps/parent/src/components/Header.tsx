import { ChevronDown, Bell, ShieldCheck } from 'lucide-react';
import { useActiveStudent } from '../contexts/ActiveStudentContext';

interface HeaderProps {
  onSwitchStudentClick: () => void;
  onNotificationsClick: () => void;
}

export function Header({ onSwitchStudentClick, onNotificationsClick }: HeaderProps) {
  const { activeStudent } = useActiveStudent();

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
      <button 
        onClick={onSwitchStudentClick}
        className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-3 py-1.5 text-sm font-bold text-slate-navy hover:bg-slate-50 transition-colors active:scale-95"
      >
        <span className="truncate max-w-[120px]">
          {activeStudent.name}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {/* Right: Notifications */}
      <button 
        onClick={onNotificationsClick}
        className="relative p-2 text-slate-navy hover:bg-slate-200/50 rounded-full transition-colors active:scale-95"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
      </button>
    </header>
  );
}
