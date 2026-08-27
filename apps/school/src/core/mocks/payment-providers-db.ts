import { MOCK_NOW } from "@/core/mocks/fake-data";

/**
 * Fournisseurs d'encaissement supportés par la plateforme (agrégateurs).
 * Les établissements ne s'intègrent pas directement aux APIs MTN/Orange :
 * ils passent par un de ces fournisseurs, un seul à la fois.
 */
export type PaymentProviderId =
  | "wave"
  | "flutterwave"
  | "paystack"
  | "payunit"
  | "campay"
  | "marviance";

export type VerificationMode = "SMS_CODE" | "TEST_TRANSACTION";

export type PaymentEnvironment = "test" | "live";

export type PayoutStatus = "PAID" | "SCHEDULED";

export interface PaymentProviderField {
  key: string;
  label: string;
  kind: "text" | "password" | "tel";
  placeholder?: string;
  hint?: string;
}

export interface PaymentProviderCatalogEntry {
  id: PaymentProviderId;
  name: string;
  tagline: string;
  markets: string;
  channels: string;
  feePercent: number;
  feeLabel: string;
  settlement: string;
  /** Champs de configuration — le flow diffère d'un fournisseur à l'autre. */
  fields: PaymentProviderField[];
  verification: VerificationMode;
  testAmount?: number; // mode TEST_TRANSACTION
  demoPhone?: string;   // mode SMS_CODE
  demoValues: Record<string, string>;
}

export interface FakePaymentProviderConnection {
  id: string;
  providerId: PaymentProviderId;
  providerName: string;
  channel: string;
  environment: PaymentEnvironment;
  config: Record<string, string>;
  feePercent: number;
  connectedAt: string; // ISO
  lastSyncAt: string;  // ISO
}

export interface ConnectProviderInput {
  providerId: PaymentProviderId;
  config: Record<string, string>;
  environment: PaymentEnvironment;
}

export const PAYMENT_PROVIDER_CATALOG: PaymentProviderCatalogEntry[] = [
  {
    id: "wave",
    name: "Wave",
    tagline: "Mobile money panafricain : paiement instantané par lien ou QR, sans USSD.",
    markets: "Cameroun · Sénégal · Côte d’Ivoire · Burkina Faso",
    channels: "Mobile money",
    feePercent: 1,
    feeLabel: "1 % / transaction",
    settlement: "Virement hebdomadaire (lundi)",
    fields: [
      { key: "phone", label: "Numéro Wave Business", kind: "tel", placeholder: "+237 6 …", hint: "Compte marchand sur lequel transitent les encaissements." },
      { key: "callback", label: "URL de callback (webhook)", kind: "text", placeholder: "https://api.ecole.cm/wave/callback" },
    ],
    verification: "SMS_CODE",
    demoPhone: "+237 656 12 34 01",
    demoValues: {
      phone: "+237 656 12 34 01",
      callback: "https://api.cs-sainte-marie.cm/wave/callback",
    },
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    tagline: "Passerelle panafricaine : cartes bancaires, mobile money et liens de paiement.",
    markets: "Cameroun · Nigéria · Sénégal · Ghana · Kenya · …",
    channels: "Cartes Visa/MC + mobile money",
    feePercent: 1.4,
    feeLabel: "1,4 % / transaction",
    settlement: "Virement (J+2)",
    fields: [
      { key: "email", label: "E-mail du compte marchand", kind: "text", placeholder: "comptabilite@ecole.cm" },
      { key: "publicKey", label: "Clé publique (FLWPUBK-…)", kind: "text", placeholder: "FLWPUBK-XXXXXXXXXXXXXXXX", hint: "Clé de test ou live selon l’environnement." },
      { key: "secretKey", label: "Clé secrète (FLWSECK-…)", kind: "password", hint: "Visible uniquement à l’enregistrement." },
    ],
    verification: "TEST_TRANSACTION",
    testAmount: 1,
    demoValues: {
      email: "comptabilite@cs-sainte-marie.cm",
      publicKey: "FLWPUBK-TEST-abc123def456",
      secretKey: "FLWSECK-TEST-x1y2z3",
    },
  },
  {
    id: "paystack",
    name: "Paystack",
    tagline: "Cartes Visa/Mastercard/Verve et mobile money, maintenant au Cameroun.",
    markets: "Cameroun · Nigéria · Ghana · Afrique du Sud",
    channels: "Cartes Visa/MC/Verve + mobile money",
    feePercent: 1.5,
    feeLabel: "1,5 % / transaction",
    settlement: "Virement (J+1)",
    fields: [
      { key: "publicKey", label: "Clé publique (pk_…)", kind: "text", placeholder: "pk_test_…" },
      { key: "secretKey", label: "Clé secrète (sk_…)", kind: "password", placeholder: "sk_test_…" },
      { key: "callback", label: "Webhook (callback + verify-hash)", kind: "text", placeholder: "https://api.ecole.cm/paystack/webhook" },
    ],
    verification: "TEST_TRANSACTION",
    testAmount: 1,
    demoValues: {
      publicKey: "pk_test_demo_8d2f1a",
      secretKey: "sk_test_demo_7c4e9b",
      callback: "https://api.cs-sainte-marie.cm/paystack/webhook",
    },
  },
  {
    id: "payunit",
    name: "PayUnit",
    tagline: "Aggrégateur camerounais : mobile money par USSD et lien de paiement.",
    markets: "Cameroun",
    channels: "Mobile money (MTN, Orange, Moov)",
    feePercent: 1,
    feeLabel: "1 % / transaction",
    settlement: "Virement hebdomadaire (lundi)",
    fields: [
      { key: "apiId", label: "Identifiant API marchand", kind: "text", placeholder: "PU-xxxx" },
      { key: "apiKey", label: "Clé API", kind: "password" },
      { key: "callback", label: "URL de callback", kind: "text", placeholder: "https://api.ecole.cm/payunit/callback" },
    ],
    verification: "SMS_CODE",
    demoPhone: "+237 681 55 20 44",
    demoValues: {
      apiId: "PU-demo-001",
      apiKey: "pkey-demo-001",
      callback: "https://api.cs-sainte-marie.cm/payunit/callback",
    },
  },
  {
    id: "campay",
    name: "CamPay",
    tagline: "Mobile money camerounais pensé pour le paiement de scolarité et de factures.",
    markets: "Cameroun",
    channels: "Mobile money (MTN, Orange) + Yup",
    feePercent: 1.2,
    feeLabel: "1,2 % / transaction",
    settlement: "Virement hebdomadaire (lundi)",
    fields: [
      { key: "phone", label: "Téléphone marchand", kind: "tel", placeholder: "+237 6 …", hint: "Compte agent qui reçoit les fonds avant transfert." },
      { key: "clientId", label: "Client ID", kind: "text", placeholder: "client_id" },
      { key: "secret", label: "Secret (authentification)", kind: "password" },
    ],
    verification: "SMS_CODE",
    demoPhone: "+237 690 77 44 21",
    demoValues: {
      phone: "+237 690 77 44 21",
      clientId: "cam-cs-saintemarie",
      secret: "cam-secret-demo",
    },
  },
  {
    id: "marviance",
    name: "Marviance",
    tagline: "Plateforme camerounaise de paiement scolaire : USSD, mobile money et carte.",
    markets: "Cameroun",
    channels: "Mobile money + USSD + carte",
    feePercent: 1,
    feeLabel: "1 % / transaction",
    settlement: "Virement hebdomadaire (jeudi)",
    fields: [
      { key: "code", label: "Code marchand", kind: "text", placeholder: "MV-…" },
      { key: "secretKey", label: "Clé secrète (MKEY…)", kind: "password" },
      { key: "phone", label: "Téléphone de support (encaissements)", kind: "tel", placeholder: "+237 6 …" },
    ],
    verification: "SMS_CODE",
    demoPhone: "+237 699 55 33 22",
    demoValues: {
      code: "MV-cs-saintemarie-01",
      secretKey: "MKEY-TEST-1234abcd",
      phone: "+237 699 55 33 22",
    },
  },
];

export function providerById(id: PaymentProviderId): PaymentProviderCatalogEntry | undefined {
  return PAYMENT_PROVIDER_CATALOG.find((c) => c.id === id);
}

export interface FakePaymentPayout {
  id: string;
  reference: string;
  providerId: PaymentProviderId;
  providerName: string;
  amount: number; // net versé (en FCFA)
  fees: number;   // retenues fournisseur cumulées (en FCFA)
  scheduledFor: string; // ISO
  status: PayoutStatus;
  bank: string;
}

const connectionSeed = (schoolId: string): FakePaymentProviderConnection | null => {
  const now = MOCK_NOW.toISOString();
  if (schoolId === "lycee-saint-paul") {
    return {
      id: "cv_paystack",
      providerId: "paystack",
      providerName: "Paystack",
      channel: "Cartes Visa/MC/Verve + mobile money",
      environment: "test",
      config: {
        publicKey: "pk_test_demo_8d2f1a",
        secretKey: "sk_test_demo_7c4e9b",
        callback: "https://api.lycee-saint-paul.cm/paystack/webhook",
      },
      feePercent: 1.5,
      connectedAt: "2025-09-02T09:00:00Z",
      lastSyncAt: now,
    };
  }
  if (schoolId === "maternelle-bisounours") {
    return null; // aucun fournisseur configuré : le catalogue est proposé
  }
  // cs-sainte-marie (école par défaut de la démo)
  return {
    id: "cv_wave",
    providerId: "wave",
    providerName: "Wave",
    channel: "Mobile money",
    environment: "test",
    config: {
      phone: "+237 656 12 34 01",
      callback: "https://api.cs-sainte-marie.cm/wave/callback",
    },
    feePercent: 1,
    connectedAt: "2025-09-05T08:30:00Z",
    lastSyncAt: now,
  };
};

const payoutSeed = (schoolId: string, active: FakePaymentProviderConnection | null): FakePaymentPayout[] => {
  if (!active) return [];
  const providerId = active.providerId;
  const providerName = active.providerName;
  const base = { providerId, providerName, bank: "BICEC •••• 0142" };
  if (schoolId === "lycee-saint-paul") {
    return [
      { ...base, id: "pp_out_01", reference: "VIR-PP-2011", amount: 965000, fees: 10890, scheduledFor: "2026-11-24T09:00:00Z", status: "SCHEDULED" },
      { ...base, id: "pp_out_02", reference: "VIR-PP-2006", amount: 812000, fees: 8744, scheduledFor: "2026-11-17T09:00:00Z", status: "PAID" },
    ];
  }
  return [
    { ...base, id: "pp_out_01", reference: "VIR-PP-1042", amount: 1284500, fees: 13405, scheduledFor: "2026-11-24T09:00:00Z", status: "SCHEDULED" },
    { ...base, id: "pp_out_02", reference: "VIR-PP-1031", amount: 1010000, fees: 10480, scheduledFor: "2026-11-17T09:00:00Z", status: "PAID" },
    { ...base, id: "pp_out_03", reference: "VIR-PP-1025", amount: 985000, fees: 9850, scheduledFor: "2026-11-10T09:00:00Z", status: "PAID" },
  ];
};

let connectionBySchool: Record<string, FakePaymentProviderConnection | null> = {};
let payoutsBySchool: Record<string, FakePaymentPayout[]> = {};

const clone = <T,>(v: T): T => (typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

const ensureSeeded = (schoolId: string) => {
  if (!(schoolId in connectionBySchool)) connectionBySchool[schoolId] = connectionSeed(schoolId);
  if (!payoutsBySchool[schoolId]) payoutsBySchool[schoolId] = payoutSeed(schoolId, connectionBySchool[schoolId] ?? null);
};

export function fetchConnection(schoolId: string): Promise<FakePaymentProviderConnection | null> {
  ensureSeeded(schoolId);
  return new Promise((resolve) => setTimeout(() => resolve(clone(connectionBySchool[schoolId] ?? null)), 200));
}

export function fetchPayouts(schoolId: string): Promise<FakePaymentPayout[]> {
  ensureSeeded(schoolId);
  return new Promise((resolve) => setTimeout(() => resolve(clone(payoutsBySchool[schoolId] ?? [])), 200));
}

/** Configure (ou remplace) le fournisseur d'encaissement — un seul actif à la fois. */
export function connectProvider(
  schoolId: string,
  input: ConnectProviderInput,
): FakePaymentProviderConnection | null {
  const entry = providerById(input.providerId);
  if (!entry) return null;
  ensureSeeded(schoolId);
  const created: FakePaymentProviderConnection = {
    id: `cv_${input.providerId}`,
    providerId: input.providerId,
    providerName: entry.name,
    channel: entry.channels,
    environment: input.environment,
    config: { ...entry.demoValues, ...input.config },
    feePercent: entry.feePercent,
    connectedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
  };
  connectionBySchool[schoolId] = created;
  payoutsBySchool[schoolId] = payoutSeed(schoolId, created);
  return clone(created);
}

export function disconnectProvider(schoolId: string): void {
  ensureSeeded(schoolId);
  connectionBySchool[schoolId] = null;
  payoutsBySchool[schoolId] = [];
}