import { CheckCircle2, AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import type { Installment } from '../types/models';

interface InstallmentsTimelineProps {
  installments: Installment[];
  onPayInstallment?: (installment: Installment) => void;
}

export function InstallmentsTimeline({ installments, onPayInstallment }: InstallmentsTimelineProps) {
  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-bold text-slate-navy mb-4">Échéancier & Tranches</h2>
      
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-2">
          {installments.map((inst) => {
            const isPaid = inst.status === 'PAID';
            const isDue = inst.status === 'DUE';
            const isOverdue = inst.status === 'OVERDUE';
            const isUpcoming = inst.status === 'UPCOMING';

            return (
              <div key={inst.id} className="relative pl-6">
                {/* Timeline dot/icon */}
                <div className={clsx(
                  "absolute -left-4.25 top-1 rounded-full bg-white p-1",
                  isPaid && "text-emeraude",
                  isDue && "text-amber-500",
                  isOverdue && "text-red-500",
                  isUpcoming && "text-slate-400"
                )}>
                  {isPaid && <CheckCircle2 className="w-6 h-6 bg-white" />}
                  {isDue && <AlertCircle className="w-6 h-6 bg-white" />}
                  {isOverdue && <AlertTriangle className="w-6 h-6 bg-white" />}
                  {isUpcoming && <Clock className="w-6 h-6 bg-white" />}
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-navy text-base">{inst.title}</h3>
                    <span className="font-bold text-slate-800 shrink-0">{inst.amount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  
                  {/* Due date row */}
                  {inst.dueDate && !isPaid && (
                    <p className={clsx(
                      "text-xs font-semibold mb-2",
                      isOverdue ? "text-red-500" : "text-slate-500"
                    )}>
                      {isOverdue ? "Échéance dépassée : " : "Échéance : "}{inst.dueDate}
                    </p>
                  )}
                  {isPaid && inst.dueDate && (
                    <p className="text-xs font-semibold text-slate-400 mb-2">Payé le : {inst.date}</p>
                  )}
                  
                  <div className="flex items-center justify-between gap-2">
                    {/* Status Badge */}
                    <div className={clsx(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase",
                      isPaid && "bg-emeraude/10 text-emeraude",
                      isDue && "bg-amber-500/10 text-amber-600",
                      isOverdue && "bg-red-500/10 text-red-600",
                      isUpcoming && "bg-slate-100 text-slate-500"
                    )}>
                      {isOverdue && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                      {inst.statusLabel}
                    </div>
                    
                    {/* Pay CTA for due/overdue */}
                    {(isDue || isOverdue) && onPayInstallment && (
                      <button
                        onClick={() => onPayInstallment(inst)}
                        className={clsx(
                          "text-xs font-bold px-3 py-1.5 rounded-lg transition-colors",
                          isOverdue 
                            ? "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/30"
                            : "bg-emeraude text-white hover:bg-emeraude/90 shadow-sm shadow-emeraude/30"
                        )}
                      >
                        Payer
                      </button>
                    )}
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
