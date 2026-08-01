const metrics = [
  {
    number: "98",
    suffix: "%",
    label: "Taux de recouvrement des tranches à échéance",
  },
  {
    number: "0",
    suffix: " min",
    label: "De saisie manuelle. Confirmation en temps réel.",
  },
  {
    number: "100",
    suffix: "%",
    label: "De traçabilité. Chaque encaissement est signé et horodaté.",
  },
  {
    number: "3",
    suffix: " clics",
    label: "Pour un parent, de la relance WhatsApp au paiement terminé.",
  },
];

export function Metrics() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-emeraude mb-12">
          Des résultats concrets
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-2 px-6 py-8 ${
                i < metrics.length - 1
                  ? "lg:border-r lg:border-fil"
                  : ""
              } ${i < 2 ? "border-b border-fil lg:border-b-0" : ""}`}
            >
              <div className="text-center">
                <span className="stat-number text-5xl text-encre sm:text-6xl">
                  {metric.number}
                </span>
                <span className="text-lg font-normal text-ardoise">
                  {metric.suffix}
                </span>
              </div>
              <p className="mt-1 text-center text-sm leading-snug text-ardoise max-w-48">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
