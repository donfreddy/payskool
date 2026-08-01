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
    <section className="relative overflow-hidden pt-14 pb-24 sm:pt-24 sm:pb-36">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-160 w-160 translate-x-1/4 -translate-y-1/4 rounded-full bg-emeraude/[0.06] blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-125 w-125 -translate-x-1/4 translate-y-1/4 rounded-full bg-encre/[0.03] blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Copy */}
          <div className="flex flex-col gap-6">
            <div className="animate-fade-up-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emeraude/20 bg-emeraude/[0.06] px-3 py-1 text-xs font-medium text-emeraude">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emeraude opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emeraude" />
                </span>
                Disponible au Sénégal, Côte d&apos;Ivoire, Cameroun
              </span>
            </div>

            <h1 className="display-heading animate-fade-up-2 text-4xl text-encre sm:text-5xl lg:text-[3.5rem]">
              Chaque franc de scolarité.
              <br />
              <span className="text-emeraude">Tracé, confirmé, réconcilié.</span>
            </h1>

            <p className="animate-fade-up-3 max-w-lg text-[17px] leading-relaxed text-ardoise">
              Les paiements Wave, Orange Money et MTN arrivent, sont
              vérifiés et ventilés automatiquement. Les parents sont
              relancés par WhatsApp. Votre registre est infalsifiable.
            </p>

            <div className="animate-fade-up-4 flex flex-wrap gap-3">
              <a
                href="#cta"
                className="glow-btn inline-flex items-center gap-2 rounded-xl bg-emeraude px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emeraude/90"
              >
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-fil bg-white px-6 py-3.5 text-sm font-medium text-encre transition-colors hover:bg-encre/[0.03]"
              >
                <Play className="h-4 w-4 text-emeraude" />
                Voir la démo
              </a>
            </div>

            {/* Social proof */}
            <div className="animate-fade-up-4 mt-2 flex items-center gap-5 border-t border-fil pt-6">
              <div className="flex -space-x-2">
                {["PT", "AD", "JK", "SN"].map((initials, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-encre/[0.06] text-[10px] font-bold text-ardoise"
                  >
                    {initials}
                  </div>
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-encre text-[9px] font-semibold text-white">
                  +50
                </div>
              </div>
              <p className="text-sm text-ardoise">
                Adopté par <strong className="text-encre">50+</strong>{" "}
                complexes scolaires
              </p>
            </div>
          </div>

          {/* Right — Live Ledger (Signature element) */}
          <div className="relative hidden lg:flex justify-center items-center">
            <div className="animate-float glass-card w-full max-w-md rounded-2xl p-6 shadow-xl shadow-encre/5">
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-ardoise">
                    Suivi de trésorerie
                  </p>
                  <p className="text-sm font-semibold text-encre">
                    CS Sainte-Marie
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-md bg-emeraude/10 px-2.5 py-1 text-[10px] font-semibold text-emeraude">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emeraude opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emeraude" />
                  </span>
                  EN DIRECT
                </span>
              </div>

              {/* Chart */}
              <div className="mb-5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-ardoise mb-2">
                  Encaissements · 30 derniers jours
                </p>
                <div className="flex items-end gap-[3px] h-28">
                  {[40, 65, 45, 80, 55, 90, 50, 70, 60, 85, 95, 75].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all"
                        style={{ height: `${h}%` }}
                      >
                        <div
                          className="h-full w-full rounded-t-sm bg-emeraude/70"
                          style={{ height: `${60 + i * 3}%` }}
                        />
                        <div
                          className="w-full rounded-t-sm bg-encre/[0.08]"
                          style={{ height: `${100 - (60 + i * 3)}%` }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-craie p-3">
                  <TrendingUp className="mb-1 h-3.5 w-3.5 text-emeraude" />
                  <p className="stat-number text-sm text-encre">4,2M</p>
                  <p className="text-[10px] text-ardoise">FCFA / mois</p>
                </div>
                <div className="rounded-xl bg-craie p-3">
                  <Wallet className="mb-1 h-3.5 w-3.5 text-encre/60" />
                  <p className="stat-number text-sm text-encre">98%</p>
                  <p className="text-[10px] text-ardoise">Recouvrement</p>
                </div>
                <div className="rounded-xl bg-craie p-3">
                  <CreditCard className="mb-1 h-3.5 w-3.5 text-emeraude" />
                  <p className="stat-number text-sm text-encre">342</p>
                  <p className="text-[10px] text-ardoise">Tx ce mois</p>
                </div>
              </div>
            </div>

            {/* Floating WhatsApp receipt notification */}
            <div className="animate-float-delayed absolute -right-4 -bottom-4 w-48 rounded-2xl border border-fil bg-white p-3 shadow-xl shadow-encre/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-emeraude/15 flex items-center justify-center">
                  <ReceiptText className="h-3 w-3 text-emeraude" />
                </div>
                <p className="text-[10px] font-semibold text-encre">
                  PAYSKOOL
                </p>
              </div>
              <div className="rounded-lg bg-emeraude/[0.06] p-2.5">
                <p className="text-[9px] leading-relaxed text-encre">
                  Paiement de <strong>75 000 FCFA</strong> reçu pour{" "}
                  <strong>KONÉ Aminata</strong>.
                  <br />
                  Reçu <span className="mono-data">REC-2026-0842</span>
                </p>
              </div>
              <p className="mt-1.5 text-center text-[9px] text-ardoise">
                14:32
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
