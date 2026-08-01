import { ArrowRight, Ban, CheckCircle2 } from "lucide-react";

const comparisons = [
  { before: "Registres papier illisibles, raturés, perdus", after: "Historique numérique complet, infalsifiable" },
  { before: "Cash qui disparaît entre la caisse et la banque", after: "Chaque franc est tracé, de l'encaissement au compte" },
  { before: "Relances manuelles par appels, un à un", after: "Relances WhatsApp automatiques, programmées" },
  { before: "Aucune visibilité : qui doit quoi ?", after: "Soldes en temps réel par classe et par élève" },
  { before: "Parents qui contestent, pas de preuve de paiement", after: "Reçus avec QR code, envoyés instantanément" },
];

export function BeforeAfter() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Before */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ambre">
              Sans Payskool
            </p>
            <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
              Le casse-tête du recouvrement
            </h2>
            <p className="mt-4 text-ardoise">
              Le quotidien de la plupart des écoles aujourd&apos;hui.
            </p>
            <ul className="mt-8 space-y-3">
              {comparisons.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-ambre/15 bg-ambre/[0.03] p-4"
                >
                  <Ban className="mt-0.5 h-4 w-4 shrink-0 text-ambre/50" />
                  <span className="text-sm text-ardoise">
                    {item.before}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
              Avec Payskool
            </p>
            <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
              La tranquillité d&apos;esprit
            </h2>
            <p className="mt-4 text-ardoise">
              Ce que vous obtenez en basculant sur Payskool.
            </p>
            <ul className="mt-8 space-y-3">
              {comparisons.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-emeraude/20 bg-emeraude/[0.03] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emeraude" />
                  <span className="text-sm font-medium text-encre">
                    {item.after}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 rounded-xl bg-emeraude px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emeraude/90"
              >
                Passer à Payskool
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
