import { CreditCard } from 'lucide-react';
import type { School } from '../types/models';

interface HeroCardProps {
  school: School;
  totalRemaining: number;
}

export function HeroCard({ school, totalRemaining }: HeroCardProps) {
  return (
    <div className="px-4 pt-2 pb-6">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-slate-navy to-slate-900 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.6)] border border-white/10">
        {/* Advanced Glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-48 bg-emeraude/30 blur-[60px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emeraude/10 blur-[40px] pointer-events-none rounded-full"></div>
        
        <div className="relative p-6">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/90 backdrop-blur-md border border-white/5 mb-5 shadow-sm">
            {school.name} <span className="opacity-50 ml-1.5 font-medium">• {school.academicYear}</span>
          </div>
          
          <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-emeraude/80 mb-1.5">
              Reste total à payer
            </div>
            <div className="text-[40px] leading-none font-extrabold text-white tracking-tighter">
              {totalRemaining.toLocaleString('fr-FR')} <span className="text-xl font-bold text-white/50 tracking-normal">FCFA</span>
            </div>
          </div>
          
          <button className="relative overflow-hidden w-full group">
            {/* Button background with pulse effect base */}
            <div className="absolute inset-0 bg-emeraude rounded-2xl group-active:scale-[0.98] transition-transform duration-200"></div>
            {/* Animated gradient shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
            
            <div className="relative w-full flex items-center justify-center gap-2 text-white font-bold h-[52px] rounded-2xl shadow-[0_0_20px_rgba(5,150,105,0.4)] active:scale-[0.98] transition-all group-hover:shadow-[0_0_25px_rgba(5,150,105,0.6)]">
              <CreditCard className="w-5 h-5" />
              Payer via Mobile Money
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
