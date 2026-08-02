import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import type { Installment } from '../types/models';

interface InstallmentsTimelineProps {
  installments: Installment[];
}

export function InstallmentsTimeline({ installments }: InstallmentsTimelineProps) {
  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-bold text-slate-navy mb-4">Échéancier & Tranches</h2>
      
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-2">
          {installments.map((inst) => {
            const isPaid = inst.status === 'PAID';
            const isDue = inst.status === 'DUE';
            const isUpcoming = inst.status === 'UPCOMING';

            return (
              <div key={inst.id} className="relative pl-6">
                {/* Timeline dot/icon */}
                <div className={clsx(
                  "absolute -left-[17px] top-1 rounded-full bg-white p-1",
                  isPaid && "text-emeraude",
                  isDue && "text-amber-500",
                  isUpcoming && "text-slate-400"
                )}>
                  {isPaid && <CheckCircle2 className="w-6 h-6 bg-white" />}
                  {isDue && <AlertCircle className="w-6 h-6 bg-white" />}
                  {isUpcoming && <Clock className="w-6 h-6 bg-white" />}
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-slate-navy text-base mb-1">{inst.title}</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-slate-800">{inst.amount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={clsx(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase",
                    isPaid && "bg-emeraude/10 text-emeraude",
                    isDue && "bg-amber-500/10 text-amber-600",
                    isUpcoming && "bg-slate-100 text-slate-500"
                  )}>
                    {isPaid ? `${inst.statusLabel} - ${inst.date}` : inst.statusLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
