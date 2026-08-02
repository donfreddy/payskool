import { Download, FileText } from 'lucide-react';
import type { Receipt } from '../types/models';

interface ReceiptsListProps {
  receipts: Receipt[];
}

export function ReceiptsList({ receipts }: ReceiptsListProps) {
  return (
    <div className="px-4 py-4 mb-6">
      <h2 className="text-lg font-bold text-slate-navy mb-4">Derniers reçus de caisse</h2>
      
      <div className="space-y-3">
        {receipts.map(receipt => (
          <div key={receipt.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-navy text-sm">Reçu {receipt.receiptNumber} - {receipt.title}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {receipt.amount.toLocaleString('fr-FR')} FCFA • {receipt.date}
                </div>
              </div>
            </div>
            
            <button className="p-2 text-emeraude hover:bg-emeraude/10 rounded-full transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
