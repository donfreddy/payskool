import { CreditCard } from 'lucide-react';
import type { School } from '../types/models';

interface HeroCardProps {
  school: School;
  totalRemaining: number;
}

export function HeroCard({ school, totalRemaining }: HeroCardProps) {
  return (
    <div className="px-4 pt-2 pb-6">
      <div className="relative overflow-hidden rounded-2xl bg-slate-navy shadow-lg">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-emeraude/20 blur-[50px] pointer-events-none"></div>
        
        <div className="relative p-6">
          <div className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm mb-4">
            {school.name} - Année {school.academicYear}
          </div>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-white mb-1">
              {totalRemaining.toLocaleString('fr-FR')} FCFA
            </div>
            <div className="text-sm font-medium text-slate-400">
              Reste total à payer pour l'année
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 bg-emeraude text-white font-semibold h-12 rounded-xl shadow-[0_0_15px_rgba(5,150,105,0.4)] active:scale-[0.98] transition-all hover:bg-emeraude/90">
            <CreditCard className="w-5 h-5" />
            Payer via Mobile Money
          </button>
        </div>
      </div>
    </div>
  );
}
