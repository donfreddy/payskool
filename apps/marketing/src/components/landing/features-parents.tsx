import { SmartphoneNfc, Users, CreditCard, FileText, MessageCircle } from "lucide-react";

const cards = [
  {
    icon: SmartphoneNfc,
    title: "Connexion sans mot de passe",
    description:
      "Un code reçu par SMS ou WhatsApp suffit. En 5 secondes, le parent accède à son espace. Aucun mot de passe à retenir.",
    color: "text-payskool-emerald",
    bg: "bg-payskool-emerald/5",
  },
  {
    icon: Users,
    title: "Vue multi-enfants",
    description:
      "Tous vos enfants regroupés sur un seul écran. Soldes, échéances et historique de paiement pour chacun, sans jongler entre les comptes.",
    color: "text-payskool-navy",
    bg: "bg-payskool-navy/5",
  },
  {
    icon: CreditCard,
    title: "Paiement Mobile Money direct",
    description:
      "Réglez une échéance en quelques secondes via Wave, Orange Money ou MTN. Depuis votre téléphone, sans vous déplacer au guichet.",
    color: "text-[#FF6600]",
    bg: "bg-orange-50",
  },
  {
    icon: FileText,
    title: "Reçus automatiques",
    description:
      "Chaque paiement génère un reçu envoyé instantanément sur WhatsApp. Historique complet et QR code de vérification inclus.",
    color: "text-payskool-emerald",
    bg: "bg-payskool-emerald/5",
  },
];

export function FeaturesParents() {
  return (
    <section id="features-parents" className="py-20 sm:py-28 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-payskool-emerald">
            Pour les Parents
          </p>
          <h2 className="display-heading mt-4 text-3xl text-payskool-navy sm:text-4xl">
            Payer la scolarité n&apos;a jamais été aussi simple
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-payskool-muted">
            Une expérience pensée pour tous les parents. Pas de téléchargement.
            Pas de mot de passe. Juste l&apos;essentiel.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative mx-auto w-full max-w-xs">
            <div className="rounded-[2.5rem] border-[4px] border-payskool-navy bg-white p-4 shadow-2xl shadow-payskool-navy/10">
              <div className="mx-auto mb-3 h-1.5 w-24 rounded-full bg-slate-300" />

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-payskool-navy">
                    Bonjour, Mme KOUASSI
                  </p>
                  <p className="text-[10px] text-payskool-muted">
                    2 enfants enregistrés
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-payskool-emerald/10">
                  <MessageCircle className="h-4 w-4 text-payskool-emerald" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-payskool-navy/5 text-sm font-semibold text-payskool-navy">
                      YK
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-payskool-navy truncate">
                        KOUASSI Yao
                      </p>
                      <p className="text-[10px] text-payskool-muted">6ème A</p>
                    </div>
                    <span className="rounded-md bg-payskool-orange/10 px-2 py-0.5 text-[9px] font-semibold text-payskool-orange">
                      EN RETARD
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[10px] text-payskool-muted">
                      Reste dû
                    </p>
                    <p className="mono-data text-xs font-semibold text-payskool-navy">
                      125 000 FCFA
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-payskool-emerald/5 text-sm font-semibold text-payskool-emerald">
                      AK
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-payskool-navy truncate">
                        KOUASSI Ama
                      </p>
                      <p className="text-[10px] text-payskool-muted">CM2</p>
                    </div>
                    <span className="rounded-md bg-payskool-emerald/10 px-2 py-0.5 text-[9px] font-semibold text-payskool-emerald">
                      À JOUR
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[10px] text-payskool-muted">Solde</p>
                    <p className="mono-data text-xs font-semibold text-payskool-emerald">
                      0 FCFA
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between rounded-xl bg-slate-100 p-2">
                {["Accueil", "Reçus", "Élève", "Support"].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="h-1 w-1 rounded-full bg-slate-400" />
                    <span className="text-[8px] text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -right-4 top-12 flex flex-col gap-2">
              <div className="rounded-lg bg-[#FF6600] px-2 py-1 text-[9px] font-semibold text-white shadow-lg">
                Orange
              </div>
              <div className="rounded-lg bg-[#FFCC00] px-2 py-1 text-[9px] font-semibold text-black shadow-lg">
                MTN
              </div>
              <div className="rounded-lg bg-[#1DC9CE] px-2 py-1 text-[9px] font-semibold text-white shadow-lg">
                Wave
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg hover:shadow-payskool-navy/5 hover:-translate-y-0.5"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <h4 className="text-sm font-semibold text-payskool-navy">
                  {card.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-payskool-muted">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
