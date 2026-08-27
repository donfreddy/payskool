/** Facturation de la plateforme Payskool : abonnement de l'établissement.
 * Plans alignés sur le site vitrine (apps/marketing → « Tarifs ») :
 * Starter (Gratuit), Pro (25 000 FCFA/mois · 290 000 FCFA/an), Groupe (sur devis).
 * Remise annuelle affichée : -20 %.
 */
export type BillingPlanId = "STARTER" | "PRO" | "GROUPE";

export type BillingCycle = "MONTHLY" | "ANNUAL";

export type SubscriptionStatus = "ACTIVE" | "TRIAL" | "PAST_DUE";

export type InvoiceStatus = "PAID" | "OPEN" | "OVERDUE";

export type PaymentMethodKind = "DIRECT_DEBIT" | "CARD" | "MOBILE_MONEY";

export interface BillingPlan {
  id: BillingPlanId;
  name: string;
  description: string;
  /** FCFA par mois ; null = sur devis. */
  priceMonthly: number | null;
  /** FCFA par an ; null = sur devis. */
  priceAnnual: number | null;
  highlighted?: boolean;
  badge?: string;
  /** null = élèves illimités. */
  seats: number | null;
  features: string[];
  excluded?: string[];
  cta: string;
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
  /** Prochaine échéance (FCFA) ; null = sur devis ; 0 = gratuit (essai). */
  price: number | null;
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
    id: "STARTER",
    name: "Starter",
    description: "Pour les petites écoles",
    priceMonthly: 0,
    priceAnnual: 0,
    seats: 100,
    features: [
      "Jusqu’à 100 élèves",
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
  },
  {
    id: "PRO",
    name: "Pro",
    description: "Le plus populaire",
    priceMonthly: 25_000,
    priceAnnual: 290_000,
    highlighted: true,
    badge: "Le plus populaire",
    seats: null,
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
    cta: "Essai gratuit 30 jours",
  },
  {
    id: "GROUPE",
    name: "Groupe",
    description: "Réseaux d’établissements",
    priceMonthly: null,
    priceAnnual: null,
    seats: null,
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
    cta: "Parler à un expert",
  },
];

export const PAYMENT_METHOD_OPTIONS: FakePaymentMethod[] = [
  { kind: "DIRECT_DEBIT", label: "Prélèvement automatique", detail: "BICEC •••• 0142" },
  { kind: "CARD", label: "Carte bancaire", detail: "Visa •••• 4242 · exp. 09/28" },
  { kind: "MOBILE_MONEY", label: "Mobile money", detail: "MTN MoMo +237 671 12 34 01" },
];

/** Prix du plan selon le cycle ; null pour les plans « sur devis ». */
export function planPrice(planId: BillingPlanId, cycle: BillingCycle): number | null {
  const plan = PAYSKOOL_PLANS.find((p) => p.id === planId)!;
  return cycle === "MONTHLY" ? plan.priceMonthly : plan.priceAnnual;
}

const bce = (schoolId: string): FakeSubscription => {
  const now = new Date().toISOString();
  if (schoolId === "lycee-saint-paul") {
    return {
      planId: "GROUPE",
      cycle: "ANNUAL",
      status: "ACTIVE",
      startedAt: "2026-07-01T09:00:00Z",
      renewsAt: "2027-07-01T09:00:00Z",
      seats: null,
      price: 480_000, // devis personnalisé
      paymentMethod: { kind: "CARD", label: "Carte bancaire", detail: "Visa •••• 4242 · exp. 09/28" },
    };
  }
  if (schoolId === "maternelle-bisounours") {
    return {
      planId: "PRO",
      cycle: "MONTHLY",
      status: "TRIAL",
      startedAt: now,
      renewsAt: "2026-12-20T09:00:00Z",
      seats: null,
      price: 0, // essai gratuit 30 jours
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
    seats: null,
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
        period: "Abonnement réseau annuel 2026-2027",
        issuedAt: "2026-07-01T09:00:00Z",
        amount: 480_000,
        status: "PAID",
        paidAt: "2026-07-01T09:12:00Z",
        paymentLabel: "Visa •••• 4242",
      },
    ];
  }
  // cs-sainte-marie (cf. maternelle-bisounours : en cours d’essai, aucune facture)
  const rows: Array<[string, string, number, InvoiceStatus, string]> = [
    ["FAC-2026-11-0118", "Novembre 2026", 25_000, "OPEN", ""],
    ["FAC-2026-10-0104", "Octobre 2026", 25_000, "PAID", "2026-10-01T08:00:00Z"],
    ["FAC-2026-09-0091", "Septembre 2026", 25_000, "PAID", "2026-09-01T08:00:00Z"],
    ["FAC-2026-08-0078", "Août 2026", 25_000, "PAID", "2026-08-01T08:00:00Z"],
    ["FAC-2026-07-0062", "Juillet 2026", 25_000, "PAID", "2026-07-01T08:00:00Z"],
    ["FAC-2026-06-0049", "Juin 2026", 25_000, "PAID", "2026-06-01T08:00:00Z"],
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