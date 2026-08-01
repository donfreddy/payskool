import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Nous sommes passés de 72% à 98% de recouvrement dès le premier trimestre. Mes caissiers ne manipulent plus de cash sans trace, je sais exactement ce qui rentre chaque jour.",
    name: "M. Philippe Traoré",
    role: "Directeur",
    school: "Collège Les Flamboyants",
    city: "Abidjan, Côte d'Ivoire",
    stat: "98%",
    statLabel: "de recouvrement",
    initials: "PT",
  },
  {
    quote:
      "Avant, je passais mes week-ends à pointer les paiements sur papier. Aujourd'hui tout est automatisé. Les parents reçoivent leurs reçus sur WhatsApp, plus une seule contestation.",
    name: "Mme Aminata Diallo",
    role: "Promotrice",
    school: "Groupe Scolaire Arc-en-Ciel",
    city: "Dakar, Sénégal",
    stat: "0",
    statLabel: "contestation depuis la mise en place",
    initials: "AD",
  },
  {
    quote:
      "J'ai 4 écoles et 1 200 élèves. Sans Payskool, c'était ingérable. Maintenant je pilote tout depuis mon téléphone, même quand je suis en déplacement.",
    name: "M. Jean-Pierre Kounoudji",
    role: "Fondateur",
    school: "Les Petits Génies",
    city: "Cotonou, Bénin",
    stat: "4",
    statLabel: "écoles pilotées en temps réel",
    initials: "JK",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
            Ils nous font confiance
          </p>
          <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
            Des résultats concrets, pas des promesses
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ardoise">
            Des promoteurs et directeurs d&apos;école qui ont transformé
            leur gestion financière avec Payskool.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col rounded-2xl border border-fil bg-white p-6 sm:p-8 transition-all hover:shadow-lg hover:shadow-encre/[0.03]"
            >
              <Quote className="h-7 w-7 text-emeraude/20" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ardoise">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="mt-6 pt-5 border-t border-fil">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-encre/[0.05] text-sm font-semibold text-encre">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-encre">
                      {t.name}
                    </p>
                    <p className="text-xs text-ardoise">
                      {t.role} — {t.school}
                    </p>
                    <p className="text-xs text-ardoise">{t.city}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-emeraude/[0.05] p-4 text-center">
                <p className="stat-number text-2xl text-emeraude">
                  {t.stat}
                </p>
                <p className="text-[11px] text-ardoise mt-0.5">
                  {t.statLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
