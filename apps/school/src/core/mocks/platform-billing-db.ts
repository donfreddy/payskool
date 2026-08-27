/** Facturation de la plateforme Payskool : abonnement de l'établissement.
 * Un plan actif, facturé mensuellement ou annuellement, avec un moyen de
 * paiement (carte, prélèvement bancaire ou mobile money).
 */
export type BillingPlanId = "ESSENTIEL" | "PRO" | "PREMIUM";

export type BillingCycle = "MONTHLY" | "ANNUAL";

export type SubscriptionStatus = "ACTIVE" | "TRIAL" | "PAST_DUE";

export type InvoiceStatus = "PAID" | "OPEN" | "OVERDUE";

export type PaymentMethodKind = "DIRECT_DEBIT" | "CARD" | "MOBILE_MONEY";

export interface BillingPlan {
  id: BillingPlanId;
  name: string;
  pricePerMonth: number; // FCFA, hors remise annuelle
  tagline: string;
  seats: number | null; // null = illimité
  features: string[];
}

export interface FakePaymentMethod {
  kind: PaymentMethodKind;
  label: string;
  detail: string;
}

export interface FakeSubscription {
  planId: BillingPlanId;
  cycle: BillingCycle;
  status: SubscriptionStatus;
  startedAt: string; // ISO
  renewsAt: string;  // ISO
  seats: number | null;
  price: number;     // prochaine échéance (FCFA)
  paymentMethod: FakePaymentMethod;
}

export interface FakeBillingInvoice {
  id: string;
  reference: string;
  period: string;
  issuedAt: string; // ISO
  amount: number;
  status: InvoiceStatus;
  paidAt?: string; // ISO
  paymentLabel: string;
}

export const PAYSKOOL_PLANS: BillingPlan[] = [
  {
    id: "ESSENTIEL",
    name: "Essentiel",
    pricePerMonth: 7500,
    tagline: "Pour les petites écoles qui démarrent.",
    seats: 12,
    features: [
      "Jusqu’à 12 élèves actifs",
      "Un guichet de caisse",
      "Reçus & encaissements",
      "Relances SMS (basique)",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    pricePerMonth: 14750,
    tagline: "L’offre la plus choisie par les établissements.",
    seats: 40,
    features: [
      "Élèves illimités du bâtiment (40 places incluses)",
      "Guichets multi-caisses",
      "Grilles tarifaires & échéances",
      "Relances automatisées (SMS, WhatsApp, appel)",
      "Intégration paiement en ligne",
    ],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    pricePerMonth: 29400,
    tagline: "Pilotage fin et support dédié.",
    seats: null,
    features: [
      "Tout le plan Pro",
      "Élèves illimités",
      "Analyses avancées & export comptable",
      "API & connecteurs (banque, comptables)",
      "Support dédié & onboarding",
    ],
  },
];

export const PAYMENT_METHOD_OPTIONS: FakePaymentMethod[] = [
  { kind: "DIRECT_DEBIT", label: "Prélèvement automatique", detail: "BICEC •••• 0142" },
  { kind: "CARD", label: "Carte bancaire", detail: "Visa •••• 4242 · exp. 09/28" },
  { kind: "MOBILE_MONEY", label: "Mobile money", detail: "MTN MoMo +237 671 12 34 01" },
];

const PLAN_ANNUAL_DISCOUNT = 0.15;

/** Prix facturé selon le plan et le cycle (remise annuelle -15 %). */
export function planPrice(planId: BillingPlanId, cycle: BillingCycle): number {
  const plan = PAYSKOOL_PLANS.find((p) => p.id === planId)!;
  if (cycle === "MONTHLY") return plan.pricePerMonth;
  return Math.round(plan.pricePerMonth * 12 * (1 - PLAN_ANNUAL_DISCOUNT));
}

const bce = (schoolId: string): FakeSubscription => {
  const now = new Date().toISOString();
  if (schoolId === "lycee-saint-paul") {
    return {
      planId: "PREMIUM",
      cycle: "ANNUAL",
      status: "ACTIVE",
      startedAt: "2026-07-01T09:00:00Z",
      renewsAt: "2027-07-01T09:00:00Z",
      seats: null,
      price: planPrice("PREMIUM", "ANNUAL"),
      paymentMethod: { kind: "CARD", label: "Carte bancaire", detail: "Visa •••• 4242 · exp. 09/28" },
    };
  }
  if (schoolId === "maternelle-bisounours") {
    return {
      planId: "ESSENTIEL",
      cycle: "MONTHLY",
      status: "TRIAL",
      startedAt: now,
      renewsAt: "2026-12-20T09:00:00Z",
      seats: 12,
      price: 0, // période d'essai
      paymentMethod: { kind: "DIRECT_DEBIT", label: "Prélèvement automatique", detail: "BICEC •••• 0142" },
    };
  }
  // cs-sainte-marie (école par défaut de la démo)
  return {
    planId: "PRO",
    cycle: "MONTHLY",
    status: "ACTIVE",
    startedAt: "2026-06-02T09:00:00Z",
    renewsAt: "2026-12-05T09:00:00Z",
    seats: 40,
    price: planPrice("PRO", "MONTHLY"),
    paymentMethod: { kind: "DIRECT_DEBIT", label: "Prélèvement automatique", detail: "BICEC •••• 0142" },
  };
};

const inv = (schoolId: string): FakeBillingInvoice[] => {
  if (schoolId === "lycee-saint-paul") {
    return [
      {
        id: "inv_lp_annual",
        reference: "FAC-2026-07-0007",
        period: "Abonnement annuel 2026-2027",
        issuedAt: "2026-07-01T09:00:00Z",
        amount: planPrice("PREMIUM", "ANNUAL"),
        status: "PAID",
        paidAt: "2026-07-01T09:12:00Z",
        paymentLabel: "Visa •••• 4242",
      },
    ];
  }
  if (schoolId === "maternelle-bisounours") {
    return [
      {
        id: "inv_mb_trial",
        reference: "FAC-2026-11-0121",
        period: "Période d’essai — accessibilité gratuite",
        issuedAt: "2026-11-01T09:00:00Z",
        amount: 0,
        status: "OPEN",
        paymentLabel: "Prélèvement à venir",
      },
    ];
  }
  // cs-sainte-marie
  const rows: Array<[string, string, number, InvoiceStatus, string]> = [
    ["FAC-2026-11-0118", "Novembre 2026", 14750, "OPEN", ""],
    ["FAC-2026-10-0104", "Octobre 2026", 14750, "PAID", "2026-10-01T08:00:00Z"],
    ["FAC-2026-09-0091", "Septembre 2026", 14750, "PAID", "2026-09-01T08:00:00Z"],
    ["FAC-2026-08-0078", "Août 2026", 14750, "PAID", "2026-08-01T08:00:00Z"],
    ["FAC-2026-07-0062", "Juillet 2026", 14750, "PAID", "2026-07-01T08:00:00Z"],
    ["FAC-2026-06-0049", "Juin 2026", 14750, "PAID", "2026-06-01T08:00:00Z"],
  ];
  return rows.map(([reference, period, amount, status, paidAt], i) => ({
    id: `inv_cs_${i}`,
    reference,
    period,
    issuedAt: `2026-${String(11 - i).padStart(2, "0")}-01T06:00:00Z`,
    amount,
    status,
    ...(paidAt ? { paidAt } : {}),
    paymentLabel: "Prélèvement BICEC •••• 0142",
  }));
};

let subscriptionBySchool: Record<string, FakeSubscription> = {};
let invoicesBySchool: Record<string, FakeBillingInvoice[]> = {};

const clone = <T,>(v: T): T => (typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

const ensureSeeded = (schoolId: string) => {
  if (!subscriptionBySchool[schoolId]) subscriptionBySchool[schoolId] = bce(schoolId);
  if (!invoicesBySchool[schoolId]) invoicesBySchool[schoolId] = inv(schoolId);
};

export function fetchSubscription(schoolId: string): Promise<FakeSubscription> {
  ensureSeeded(schoolId);
  return new Promise((resolve) => setTimeout(() => resolve(clone(subscriptionBySchool[schoolId]!)), 200));
}

export function fetchInvoices(schoolId: string): Promise<FakeBillingInvoice[]> {
  ensureSeeded(schoolId);
  return new Promise((resolve) => setTimeout(() => resolve(clone(invoicesBySchool[schoolId]!)), 200));
}

export function patchSubscription(
  schoolId: string,
  patch: Partial<FakeSubscription>,
): FakeSubscription | null {
  ensureSeeded(schoolId);
  const current = subscriptionBySchool[schoolId]!;
  const merged: FakeSubscription = {
    ...current,
    ...patch,
    ...(patch.planId || patch.cycle
      ? { price: planPrice(patch.planId ?? current.planId, patch.cycle ?? current.cycle) }
      : {}),
  };
  subscriptionBySchool[schoolId] = merged;
  return clone(merged);
}