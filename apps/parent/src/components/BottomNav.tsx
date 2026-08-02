import { Home, Receipt, Users, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import type { TabId } from '../App';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'students', icon: Users, label: 'Élèves' },
    { id: 'receipts', icon: Receipt, label: 'Reçus' },
    { id: 'support', icon: MessageCircle, label: 'Support' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 pb-safe pt-2 px-6 z-50">
      <div className="flex items-center justify-between h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button 
              key={item.id} 
              onClick={() => onChangeTab(item.id)}
              className="flex flex-col items-center justify-center gap-1 min-w-[64px]"
            >
              <div className={clsx(
                "p-1.5 rounded-xl transition-colors",
                isActive ? "bg-emeraude/10 text-emeraude" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}>
                <Icon className={clsx("w-6 h-6", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={clsx(
                "text-[10px] font-bold",
                isActive ? "text-emeraude" : "text-slate-500"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
