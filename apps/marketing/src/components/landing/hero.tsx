import {
  ArrowRight,
  CreditCard,
  Play,
  ReceiptText,
  TrendingUp,
  Wallet,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/4 rounded-full bg-payskool-emerald/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full bg-payskool-navy/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="animate-fade-up-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-payskool-emerald/20 bg-payskool-emerald/5 px-3 py-1 text-xs font-medium text-payskool-emerald">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-payskool-emerald opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-payskool-emerald" />
                </span>
                Disponible au Sénégal, Côte d&apos;Ivoire, Cameroun
              </span>
            </div>

            <h1 className="display-heading animate-fade-up-2 text-4xl leading-[1.08] text-payskool-navy sm:text-5xl lg:text-6xl">
              Récupérez jusqu&apos;à{" "}
              <span className="stat-number text-payskool-emerald">98%</span>
              <br />
              de vos frais de scolarité, à temps,
              <br />
              sans effort.
            </h1>

            <p className="animate-fade-up-3 max-w-lg text-lg leading-relaxed text-payskool-muted">
              Vos paiements par Wave, Orange Money et MTN sont tracés,
              confirmés et réconciliés automatiquement. Les parents sont
              relancés sur WhatsApp. Zéro fuite de cash.
            </p>

            <div className="animate-fade-up-4 flex flex-wrap gap-3">
              <a
                href="#cta"
                className="glow-btn inline-flex items-center gap-2 rounded-xl bg-payskool-emerald px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-payskool-emerald/90"
              >
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-payskool-navy transition-colors hover:bg-slate-50"
              >
                <Play className="h-4 w-4 text-payskool-emerald" />
                Voir la démo (2 min)
              </a>
            </div>

            <div className="animate-fade-up-4 mt-4 flex items-center gap-6 border-t border-slate-100 pt-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-payskool-muted"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-payskool-navy text-[9px] font-semibold text-white">
                  +50
                </div>
              </div>
              <p className="text-sm text-payskool-muted">
                Adopté par <strong className="text-payskool-navy">50+</strong>{" "}
                complexes scolaires
              </p>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center items-center">
            <div className="animate-float glass-card w-full max-w-md rounded-2xl p-5 shadow-xl shadow-payskool-navy/5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-payskool-muted">
                    Suivi de trésorerie
                  </p>
                  <p className="text-sm font-semibold text-payskool-navy">
                    CS Sainte-Marie
                  </p>
                </div>
                <span className="rounded-md bg-payskool-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-payskool-emerald">
                  EN DIRECT
                </span>
              </div>

              <div className="mb-5 space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-payskool-muted">
                  Encaissements, 30 derniers jours
                </p>
                <div className="flex items-end gap-2 h-28">
                  {[40, 65, 45, 80, 55, 90, 50, 70, 60, 85, 95, 75].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-payskool-navy/10 transition-colors hover:bg-payskool-navy/20"
                        style={{ height: `${h}%` }}
                      >
                        <div
                          className="h-full rounded-t-sm bg-payskool-emerald/80"
                          style={{ height: `${h * 0.7}%` }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <TrendingUp className="mb-1 h-3.5 w-3.5 text-payskool-emerald" />
                  <p className="mono-data text-sm font-semibold text-payskool-navy">
                    4,2M
                  </p>
                  <p className="text-[10px] text-payskool-muted">FCFA / mois</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <Wallet className="mb-1 h-3.5 w-3.5 text-payskool-navy" />
                  <p className="mono-data text-sm font-semibold text-payskool-navy">
                    98%
                  </p>
                  <p className="text-[10px] text-payskool-muted">Recouvrement</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <CreditCard className="mb-1 h-3.5 w-3.5 text-payskool-emerald" />
                  <p className="mono-data text-sm font-semibold text-payskool-navy">
                    342
                  </p>
                  <p className="text-[10px] text-payskool-muted">Tx ce mois</p>
                </div>
              </div>
            </div>

            <div className="animate-float-delayed absolute -right-6 -bottom-6 w-44 rounded-[2rem] border-[3px] border-payskool-navy bg-white p-3 shadow-xl shadow-payskool-navy/10">
              <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-slate-300" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-payskool-emerald/20 flex items-center justify-center">
                    <ReceiptText className="h-3 w-3 text-payskool-emerald" />
                  </div>
                  <p className="text-[10px] font-semibold text-payskool-navy">
                    PAYSKOOL
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-2">
                  <p className="text-[9px] leading-relaxed text-payskool-navy">
                    Paiement de <strong>75 000 FCFA</strong> reçu pour{" "}
                    <strong>KONÉ Aminata</strong>. Reçu #{">"}
                    REC-2026-0842
                  </p>
                </div>
                <p className="text-center text-[9px] text-payskool-muted">
                  14:32
                </p>
              </div>
              <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
