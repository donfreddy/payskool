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
    priceMonthly: "25 000",
    priceAnnual: "290 000",
    currency: "FCFA",
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
    <section id="pricing" className="py-20 sm:py-28 bg-craie">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
            Tarifs
          </p>
          <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
            Simple, transparent, sans surprise
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ardoise">
            Un abonnement, c&apos;est tout. Zéro commission sur vos
            encaissements. L&apos;argent va directement sur votre compte.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setAnnual(false)}
            className={`text-sm font-medium transition-colors ${
              !annual ? "text-encre" : "text-ardoise"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
              annual ? "bg-emeraude" : "bg-fil"
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
              annual ? "text-encre" : "text-ardoise"
            }`}
          >
            Annuel
            <span className="ml-1.5 rounded-full bg-emeraude/10 px-2 py-0.5 text-[10px] font-semibold text-emeraude">
              -20%
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 transition-all ${
                plan.highlighted
                  ? "border-emeraude shadow-xl shadow-emeraude/6 lg:scale-105"
                  : "border-fil hover:shadow-lg hover:shadow-encre/3"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emeraude px-4 py-1 text-[11px] font-semibold text-white shadow-lg shadow-emeraude/20">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-encre">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-ardoise">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="stat-number text-4xl text-encre">
                    {annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  {plan.periodMonthly && (
                    <span className="text-sm text-ardoise">
                      {" "}
                      {annual ? plan.periodAnnual : plan.periodMonthly}
                    </span>
                  )}
                </div>
                {"currency" in plan && (
                  <p className="mt-0.5 text-xs text-ardoise">
                    {plan.currency}
                  </p>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-encre"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emeraude" />
                    {feature}
                  </li>
                ))}
                {plan.excluded.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-fil line-through"
                  >
                    <span className="mt-0.5 block h-4 w-4 shrink-0 rounded-full border border-fil" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`block rounded-xl px-6 py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "glow-btn bg-emeraude text-white hover:bg-emeraude/90"
                    : "border border-fil text-encre hover:bg-encre/3"
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
