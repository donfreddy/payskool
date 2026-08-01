"use client";

import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    description: "Pour les petites écoles",
    priceMonthly: "Gratuit",
    priceAnnual: "Gratuit",
    periodMonthly: "à vie",
    periodAnnual: "à vie",
    features: [
      "Jusqu'à 100 élèves",
      "Paiements cash et suivi de base",
      "Reçus simples",
      "Import Excel (1 école)",
      "Support par email",
    ],
    excluded: [
      "Paiement Mobile Money",
      "Multi-établissements",
      "Reçus avec QR code",
      "Relances WhatsApp",
      "Rapports avancés",
    ],
    cta: "Commencer",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "Le plus populaire",
    priceMonthly: "25 000 FCFA",
    priceAnnual: "290 000 FCFA",
    periodMonthly: "/ mois",
    periodAnnual: "/ an",
    features: [
      "Élèves illimités",
      "Paiement Mobile Money (Wave, Orange, MTN)",
      "Multi-établissements",
      "Reçus avec QR code infalsifiable",
      "Relances WhatsApp automatiques",
      "Import Excel intelligent",
      "Suivi de trésorerie",
      "Support prioritaire WhatsApp",
      "Formation incluse",
    ],
    excluded: [],
    cta: "Essai gratuit 30 jours",
    highlighted: true,
    badge: "Le plus populaire",
  },
  {
    name: "Groupe",
    description: "Réseaux d'établissements",
    priceMonthly: "Sur devis",
    priceAnnual: "Sur devis",
    periodMonthly: "",
    periodAnnual: "",
    features: [
      "Tout le plan Pro",
      "3+ établissements",
      "Remise dégressive",
      "Migration gratuite",
      "Accès prioritaire",
      "Interlocuteur dédié",
      "Disponibilité garantie",
      "Formation sur site",
    ],
    excluded: [],
    cta: "Parler à un expert",
    highlighted: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-payskool-emerald">
            Tarifs
          </p>
          <h2 className="display-heading mt-4 text-3xl text-payskool-navy sm:text-4xl">
            Simple, transparent, sans surprise
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-payskool-muted">
            Un abonnement, c&apos;est tout. Zéro commission sur vos
            encaissements. L&apos;argent va directement sur votre compte.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setAnnual(false)}
            className={`text-sm font-medium transition-colors ${
              !annual ? "text-payskool-navy" : "text-payskool-muted"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
              annual ? "bg-payskool-emerald" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                annual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`text-sm font-medium transition-colors ${
              annual ? "text-payskool-navy" : "text-payskool-muted"
            }`}
          >
            Annuel
            <span className="ml-1.5 rounded-full bg-payskool-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-payskool-emerald">
              -20%
            </span>
          </button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 transition-all ${
                plan.highlighted
                  ? "border-payskool-emerald shadow-xl shadow-payskool-emerald/5 lg:scale-105"
                  : "border-slate-200 hover:shadow-lg"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-payskool-emerald px-4 py-1 text-[11px] font-semibold text-white shadow-lg">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-payskool-navy">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-payskool-muted">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="stat-number text-4xl text-payskool-navy">
                    {annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  {plan.periodMonthly && (
                    <span className="text-sm text-payskool-muted">
                      {annual ? plan.periodAnnual : plan.periodMonthly}
                    </span>
                  )}
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-payskool-navy"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-payskool-emerald" />
                    {feature}
                  </li>
                ))}
                {plan.excluded.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-slate-300 line-through"
                  >
                    <span className="mt-0.5 block h-4 w-4 shrink-0 rounded-full border border-slate-200" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`block rounded-xl px-6 py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "glow-btn bg-payskool-emerald text-white hover:bg-payskool-emerald/90"
                    : "border border-slate-200 text-payskool-navy hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
