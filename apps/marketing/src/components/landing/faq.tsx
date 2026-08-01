import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "L'argent transite-t-il par PAYSKOOL ?",
    answer:
      "Non. L'argent va directement sur le compte bancaire ou Mobile Money de l'école. PAYSKOOL est un service par abonnement : nous ne collectons et ne retenons jamais vos fonds. Vous connectez vous-même vos comptes Mobile Money et les paiements arrivent directement chez vous.",
  },
  {
    question: "Comment faire si nos parents paient toujours en liquide à la caisse ?",
    answer:
      "Notre module Guichet permet d'encaisser le cash en 5 secondes avec édition immédiate du reçu. Chaque transaction est horodatée et tracée, éliminant tout risque d'écart de caisse. Le reçu est envoyé instantanément au parent par WhatsApp.",
  },
  {
    question: "Combien de temps faut-il pour démarrer ?",
    answer:
      "Moins de 2 heures. Vous importez vos listes d'élèves en quelques minutes depuis votre fichier Excel habituel. La connexion de vos comptes Mobile Money est guidée pas à pas. Nos équipes vous accompagnent jusqu'à votre premier encaissement.",
  },
  {
    question: "Les parents doivent-ils installer une application ?",
    answer:
      "Non. Le portail parent s'ouvre directement dans le navigateur du téléphone, sans rien télécharger. Il fonctionne sur tous les téléphones connectés à Internet, même les plus simples. La connexion se fait par code SMS ou WhatsApp.",
  },
  {
    question: "Quels moyens de paiement sont supportés ?",
    answer:
      "Wave, Orange Money, MTN Mobile Money, CinetPay et Paystack. Ainsi que les paiements en espèces et par chèque via notre module Guichet. Nous ajoutons régulièrement de nouveaux moyens de paiement selon les besoins de nos écoles.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
            Questions fréquentes
          </p>
          <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
            Tout ce que vous devez savoir
          </h2>
        </div>

        <div className="mt-12 divide-y divide-fil">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-base font-medium text-encre group-open:text-emeraude transition-colors">
                  {faq.question}
                </span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-craie text-ardoise transition-all group-open:bg-emeraude/10 group-open:text-emeraude group-open:rotate-180">
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </span>
              </summary>
              <div className="mt-4 animate-fade-in">
                <p className="text-sm leading-relaxed text-ardoise">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-fil bg-white p-6 text-center">
          <p className="text-sm text-ardoise">
            Vous avez d&apos;autres questions ?
          </p>
          <a
            href="#"
            className="mt-2 inline-block text-sm font-semibold text-emeraude hover:underline"
          >
            Contactez-nous sur WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}
