import { Download, Printer } from 'lucide-react';
import { useActiveStudent } from '../contexts/ActiveStudentContext';

export function ReceiptsView() {
  const { activeStudent } = useActiveStudent();
  const allReceipts = activeStudent.recentReceipts;

  return (
    <div className="pt-20 px-4 pb-28">
      <h1 className="text-2xl font-extrabold text-slate-navy mb-6 tracking-tight">Historique des reçus</h1>
      
      <div className="space-y-4">
        {allReceipts.map(receipt => (
          <div key={receipt.id} className="relative bg-white rounded-2xl p-5 border-2 border-dashed border-slate-200 shadow-sm flex flex-col gap-4">
            {/* Ticket Cutouts */}
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-5 h-5 bg-slate-50 rounded-full border-r-2 border-dashed border-slate-200"></div>
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 bg-slate-50 rounded-full border-l-2 border-dashed border-slate-200"></div>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Printer className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-navy text-sm">{receipt.title}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-medium text-slate-500">Élève : {activeStudent.name}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-sm font-extrabold text-slate-800">{receipt.amount.toLocaleString('fr-FR')} FCFA</span>
                <span className="block text-xs font-bold text-slate-400 mt-0.5">{receipt.date}</span>
              </div>
            </div>

            <div className="h-px w-full border-b-2 border-dashed border-slate-100 my-1"></div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reçu {receipt.receiptNumber}</span>
              <button className="flex items-center gap-2 text-xs font-bold text-emeraude hover:bg-emeraude/10 px-3 py-1.5 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Télécharger
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
