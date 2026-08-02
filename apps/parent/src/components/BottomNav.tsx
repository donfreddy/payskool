import { Home, Receipt, Users, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

export function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Accueil', active: true },
    { icon: Receipt, label: 'Reçus', active: false },
    { icon: Users, label: 'Élèves', active: false },
    { icon: MessageCircle, label: 'Support', active: false },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 pb-safe pt-2 px-6 z-50">
      <div className="flex items-center justify-between h-14">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} className="flex flex-col items-center justify-center gap-1 min-w-[64px]">
              <div className={clsx(
                "p-1.5 rounded-xl transition-colors",
                item.active ? "bg-emeraude/10 text-emeraude" : "text-slate-400 hover:text-slate-600"
              )}>
                <Icon className={clsx("w-6 h-6", item.active && "stroke-[2.5px]")} />
              </div>
              <span className={clsx(
                "text-[10px] font-medium",
                item.active ? "text-emeraude" : "text-slate-500"
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
