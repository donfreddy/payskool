import { useState, useEffect } from 'react';
import { X, Smartphone, Loader2, CheckCircle2, ReceiptText } from 'lucide-react';
import clsx from 'clsx';

interface PaymentFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

type PaymentStep = 'form' | 'processing' | 'success';

export function PaymentFlowModal({ isOpen, onClose, amount }: PaymentFlowModalProps) {
  const [step, setStep] = useState<PaymentStep>('form');
  const [phone, setPhone] = useState('07 00 00 00 00');
  const [operator, setOperator] = useState<'orange' | 'mtn' | 'wave'>('orange');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) setStep('form');
  }, [isOpen]);

  const handlePay = () => {
    setStep('processing');
    // Simulate USSD delay
    setTimeout(() => {
      setStep('success');
    }, 4000);
  };

  return (
    <div 
      className={clsx(
        "fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 flex flex-col justify-end sm:justify-center sm:items-center sm:p-4",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div 
        className={clsx(
          "w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl transition-transform duration-300 ease-out flex flex-col overflow-hidden",
          isOpen ? "translate-y-0" : "translate-y-full sm:translate-y-12 sm:scale-95"
        )}
      >
        {/* Header (Only for form) */}
        {step === 'form' && (
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 shrink-0">
            <h2 className="text-xl font-extrabold text-slate-navy">Paiement</h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="relative flex-1">
          {/* STEP 1: FORM */}
          {step === 'form' && (
            <div className="p-6 pb-safe animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <span className="block text-sm font-bold text-slate-500 mb-1">Montant à régler</span>
                <span className="block text-4xl font-extrabold text-slate-navy tracking-tighter">
                  {amount.toLocaleString('fr-FR')} <span className="text-lg text-slate-400 font-bold">FCFA</span>
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Moyen de paiement
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setOperator('orange')}
                      className={clsx(
                        "p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95",
                        operator === 'orange' ? "border-[#FF7900] bg-[#FF7900]/10" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="w-8 h-8 bg-[#FF7900] rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-700">Orange</span>
                    </button>
                    <button 
                      onClick={() => setOperator('mtn')}
                      className={clsx(
                        "p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95",
                        operator === 'mtn' ? "border-[#FFCC00] bg-[#FFCC00]/10" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="w-8 h-8 bg-[#FFCC00] rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-700">MTN</span>
                    </button>
                    <button 
                      onClick={() => setOperator('wave')}
                      className={clsx(
                        "p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95",
                        operator === 'wave' ? "border-[#1CC5F4] bg-[#1CC5F4]/10" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="w-8 h-8 bg-[#1CC5F4] rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-700">Wave</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-slate-navy focus:outline-none focus:border-emeraude focus:ring-4 focus:ring-emeraude/10 transition-all"
                    />
                  </div>
                </div>

                <button 
                  onClick={handlePay}
                  className="w-full bg-emeraude text-white font-bold h-[56px] rounded-2xl shadow-[0_8px_20px_rgba(5,150,105,0.3)] active:scale-[0.98] transition-transform text-lg"
                >
                  Confirmer le paiement
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROCESSING (USSD PUSH) */}
          {step === 'processing' && (
            <div className="p-8 pb-safe flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
              <div className="relative mb-8">
                {/* Pulsing rings */}
                <div className="absolute inset-0 bg-emeraude/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 bg-emeraude/40 rounded-full animate-pulse"></div>
                
                <div className="relative w-24 h-24 bg-emeraude rounded-full flex items-center justify-center shadow-lg">
                  <Smartphone className="w-10 h-10 text-white animate-bounce" />
                </div>
              </div>
              
              <h3 className="text-xl font-extrabold text-slate-navy mb-3 text-center">Validation requise</h3>
              <p className="text-sm font-medium text-slate-500 text-center leading-relaxed mb-6">
                Veuillez consulter votre téléphone (<strong className="text-slate-700">{phone}</strong>) et entrer votre code secret pour valider la transaction.
              </p>
              
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-50 px-4 py-2 rounded-full">
                <Loader2 className="w-4 h-4 animate-spin" />
                En attente de votre validation...
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="p-8 pb-safe flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emeraude/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-14 h-14 text-emeraude" />
              </div>
              
              <h3 className="text-2xl font-extrabold text-slate-navy mb-2 text-center">Paiement réussi !</h3>
              <p className="text-sm font-medium text-slate-500 text-center mb-8">
                Votre transaction de {amount.toLocaleString('fr-FR')} FCFA a été validée avec succès.
              </p>

              <div className="w-full space-y-3">
                <button 
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold h-[56px] rounded-2xl active:scale-[0.98] transition-transform"
                >
                  <ReceiptText className="w-5 h-5" />
                  Télécharger le reçu
                </button>
                <button 
                  onClick={onClose}
                  className="w-full bg-emeraude text-white font-bold h-[56px] rounded-2xl shadow-lg shadow-emeraude/20 active:scale-[0.98] transition-transform"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
