import { Clock, Plug, Upload, Wand2 } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Plug,
    title: "Activez vos comptes Mobile Money",
    description:
      "En 2 minutes, vous connectez vos comptes Wave, Orange Money ou MTN à la plateforme. L'argent va directement sur votre compte, jamais ailleurs.",
    detail:
      "Compatible Wave, Orange Money, MTN MoMo, CinetPay et Paystack. Activation guidée pas à pas.",
  },
  {
    number: "2",
    icon: Upload,
    title: "Importez votre fichier élèves",
    description:
      "Uploadez votre fichier Excel habituel. Le système reconnaît automatiquement les colonnes et crée les échéanciers par classe en un clic.",
    detail:
      "Vos fichiers Excel ou CSV. Jusqu'à 10 000 élèves en un seul import. Vos préférences sont mémorisées.",
  },
  {
    number: "3",
    icon: Wand2,
    title: "Laissez la plateforme encaisser",
    description:
      "Les parents reçoivent automatiquement leurs rappels et paient en ligne. Les dossiers élèves se mettent à jour sans aucune intervention.",
    detail:
      "Relances WhatsApp automatiques. Paiement en un geste. Réconciliation en temps réel.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
            Démarrage express
          </p>
          <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
            Opérationnel en moins de 2 heures
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ardoise">
            Trois étapes simples. Nous vous accompagnons du premier clic
            au premier encaissement.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Connecting dashed line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+4rem)] top-9 hidden h-[2px] w-[calc(100%-8rem)] lg:block">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, var(--color-fil) 0, var(--color-fil) 4px, transparent 4px, transparent 8px)`,
                    }}
                  />
                </div>
              )}

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-encre text-white shadow-lg shadow-encre/10 transition-transform group-hover:scale-105">
                <step.icon className="h-6 w-6 text-emeraude" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emeraude text-[10px] font-bold text-white">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-encre">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ardoise">
                {step.description}
              </p>
              <p className="mt-3 rounded-lg bg-craie border border-fil/50 px-3 py-2 text-[11px] text-ardoise">
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-emeraude/20 bg-emeraude/[0.05] px-6 py-4">
            <Clock className="h-5 w-5 text-emeraude" />
            <span className="text-sm font-semibold text-encre">
              Temps total pour démarrer :{" "}
              <span className="stat-number text-emeraude">2 heures</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
