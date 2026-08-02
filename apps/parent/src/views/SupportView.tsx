import { MessageCircle, HelpCircle, PhoneCall, ChevronRight, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

export function SupportView() {
  const supportPhone = '+225 27 22 00 00';
  const faqs = [
    {
      question: "Comment modifier un paiement en cours ?",
      answer: "Les paiements en cours ne peuvent pas être modifiés directement. Si vous avez fait une erreur, veuillez contacter le support WhatsApp pour annuler la transaction avant qu'elle ne soit confirmée par l'école."
    },
    {
      question: "Où trouver l'identifiant de mon enfant ?",
      answer: "L'identifiant (matricule) est fourni par l'établissement scolaire lors de l'inscription. Vous pouvez également le trouver sur les anciens bulletins ou reçus physiques."
    },
    {
      question: "Mon paiement mobile money a échoué",
      answer: "Vérifiez d'abord que vous avez le solde nécessaire (incluant les frais de retrait). Si le solde était suffisant, l'opérateur a pu subir une coupure. Veuillez réessayer dans 15 minutes."
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="pt-20 px-4 pb-28">
      <h1 className="text-2xl font-extrabold text-slate-navy mb-6 tracking-tight">Assistance</h1>

      {/* Primary Action */}
      <a 
        href="https://wa.me/22500000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block rounded-2xl p-6 bg-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.3)] mb-8 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold mb-1">Support WhatsApp</h2>
            <p className="text-sm font-medium text-white/90">Réponse en moins de 5 minutes</p>
          </div>
        </div>
      </a>

      {/* Phone */}
      <a
        href={`tel:${supportPhone.replace(/\s/g, '')}`} 
        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 active:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <PhoneCall className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold text-slate-navy">Appeler le support</span>
            <span className="block text-sm font-medium text-emeraude mt-0.5">{supportPhone}</span>
            <span className="block text-xs text-slate-400">Lundi - Samedi, 8h - 18h</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </a>

      {/* FAQ */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-tight text-slate-600 uppercase">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          Questions Fréquentes
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div key={i} className="flex flex-col">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors active:bg-slate-100"
                >
                  <span className={clsx(
                    "text-sm font-semibold pr-4 transition-colors",
                    isOpen ? "text-emeraude" : "text-slate-700"
                  )}>
                    {faq.question}
                  </span>
                  <div className="shrink-0 text-slate-400">
                    {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </button>
                <div 
                  className={clsx(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-4 pt-0 text-sm font-medium text-slate-500 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
