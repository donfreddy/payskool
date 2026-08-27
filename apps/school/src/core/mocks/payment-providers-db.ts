import { MOCK_NOW } from "@/core/mocks/fake-data";

/** Moyens de paiement en ligne connectables (Mobile money + carte). */
export type PaymentProviderKind = "MTN_MOMO" | "ORANGE_MONEY" | "WAVE" | "CARD";

export type ConnectionStatus = "ACTIVE" | "PAUSED";

export type PayoutStatus = "PAID" | "SCHEDULED";

export interface PaymentProviderCatalogEntry {
  kind: PaymentProviderKind;
  name: string;
  shortName: string;
  tagline: string;
  category: "Mobile money" | "Cartes bancaires";
  demoPhone: string;
  demoHolder: string;
  feePercent: number;
  maxPerTx: number;
}

export interface FakePaymentProviderConnection {
  id: string;
  kind: PaymentProviderKind;
  name: string;
  shortName: string;
  phone: string;
  holder: string;
  feePercent: number;
  status: ConnectionStatus;
  testMode: boolean;
  connectedAt: string; // ISO
  lastSyncAt: string;  // ISO
}

export interface FakePaymentPayout {
  id: string;
  reference: string;
  providerId: string;
  providerName: string;
  amount: number; // net versé (en FCFA)
  fees: number;   // retenues opérateur cumulées (en FCFA)
  scheduledFor: string; // ISO
  status: PayoutStatus;
  bank: string;
}

export interface ConnectProviderInput {
  kind: PaymentProviderKind;
  phone: string;
  holder: string;
  testMode: boolean;
}

export const PAYMENT_PROVIDER_CATALOG: PaymentProviderCatalogEntry[] = [
  {
    kind: "MTN_MOMO",
    name: "MTN Mobile Money",
    shortName: "MTN MoMo",
    tagline: "Relevé MTN officiel, paiement par USSD ou API marchand.",
    category: "Mobile money",
    demoPhone: "+237 671 12 34 01",
    demoHolder: "Cellule scolarité CS Sainte-Marie",
    feePercent: 1,
    maxPerTx: 500000,
  },
  {
    kind: "ORANGE_MONEY",
    name: "Orange Money",
    shortName: "Orange Money",
    tagline: "Le wallet Orange utilisé par la majorité des parents à Douala.",
    category: "Mobile money",
    demoPhone: "+237 690 12 34 01",
    demoHolder: "Cellule scolarité CS Sainte-Marie",
    feePercent: 1.2,
    maxPerTx: 1000000,
  },
  {
    kind: "WAVE",
    name: "Wave",
    shortName: "Wave",
    tagline: "Wallet mobile à frais réduits, instantané et sans code USSD.",
    category: "Mobile money",
    demoPhone: "+237 656 12 34 01",
    demoHolder: "Cellule scolarité CS Sainte-Marie",
    feePercent: 1,
    maxPerTx: 2000000,
  },
  {
    kind: "CARD",
    name: "PaySkool Gateway",
    shortName: "Cartes",
    tagline: "Carte bancaire Visa / Mastercard via la passerelle PaySkool.",
    category: "Cartes bancaires",
    demoPhone: "+237 233 42 18 60",
    demoHolder: "Compte PaySkool Gateway CS Sainte-Marie",
    feePercent: 1.8,
    maxPerTx: 3000000,
  },
];

const KIND_FEE: Record<PaymentProviderKind, number> = {
  MTN_MOMO: 1,
  ORANGE_MONEY: 1.2,
  WAVE: 1,
  CARD: 1.8,
};

/** Commission opérateur (en %) appliquée à un moyen de paiement. */
export function providerFeePercent(kind: PaymentProviderKind): number {
  return KIND_FEE[kind];
}

const connectionSeed = (schoolId: string): FakePaymentProviderConnection[] => {
  const base = {
    id: "",
    connectedAt: "2024-09-05T08:30:00Z",
    lastSyncAt: MOCK_NOW.toISOString(),
    testMode: true,
  };
  if (schoolId === "lycee-saint-paul") {
    return [
      {
        ...base,
        id: "pp_orange",
        kind: "ORANGE_MONEY",
        name: "Orange Money",
        shortName: "Orange Money",
        phone: "+237 690 45 78 12",
        holder: "Comptabilité Lycée Saint-Paul",
        feePercent: 1.2,
        status: "ACTIVE",
      },
      {
        ...base,
        id: "pp_card",
        kind: "CARD",
        name: "PaySkool Gateway",
        shortName: "Cartes",
        phone: "+237 222 20 14 35",
        holder: "Compte PaySkool Gateway Lycée Saint-Paul",
        feePercent: 1.8,
        status: "ACTIVE",
      },
    ];
  }
  if (schoolId === "maternelle-bisounours") {
    return [
      {
        ...base,
        id: "pp_wave",
        kind: "WAVE",
        name: "Wave",
        shortName: "Wave",
        phone: "+237 656 20 54 32",
        holder: "Direction Maternelle les Bisounours",
        feePercent: 1,
        status: "ACTIVE",
      },
    ];
  }
  // cs-sainte-marie (école par défaut de la démo)
  return [
    {
      ...base,
      id: "pp_mtn",
      kind: "MTN_MOMO",
      name: "MTN Mobile Money",
      shortName: "MTN MoMo",
      phone: "+237 671 12 34 01",
      holder: "Cellule scolarité CS Sainte-Marie",
      feePercent: 1,
      status: "ACTIVE",
    },
    {
      ...base,
      id: "pp_orange",
      kind: "ORANGE_MONEY",
      name: "Orange Money",
      shortName: "Orange Money",
      phone: "+237 690 12 34 01",
      holder: "Cellule scolarité CS Sainte-Marie",
      feePercent: 1.2,
      status: "ACTIVE",
    },
  ];
};

const payoutSeed = (schoolId: string): FakePaymentPayout[] => {
  if (schoolId !== "cs-sainte-marie") {
    return [
      {
        id: "pp_out_probe",
        reference: "VIR-PP-1001",
        providerId: "pp_orange",
        providerName: "Orange Money",
        amount: 512000,
        fees: 6600,
        scheduledFor: "2026-11-24T09:00:00Z",
        status: "SCHEDULED",
        bank: "BICEC •••• 0142",
      },
    ];
  }
  return [
    {
      id: "pp_out_01",
      reference: "VIR-PP-1042",
      providerId: "pp_mtn",
      providerName: "MTN MoMo",
      amount: 1284500,
      fees: 13850,
      scheduledFor: "2026-11-24T09:00:00Z",
      status: "SCHEDULED",
      bank: "BICEC •••• 0142",
    },
    {
      id: "pp_out_02",
      reference: "VIR-PP-1043",
      providerId: "pp_orange",
      providerName: "Orange Money",
      amount: 1210000,
      fees: 15840,
      scheduledFor: "2026-11-24T09:00:00Z",
      status: "SCHEDULED",
      bank: "BICEC •••• 0142",
    },
    {
      id: "pp_out_03",
      reference: "VIR-PP-1031",
      providerId: "pp_orange",
      providerName: "Orange Money",
      amount: 1010000,
      fees: 11040,
      scheduledFor: "2026-11-17T09:00:00Z",
      status: "PAID",
      bank: "BICEC •••• 0142",
    },
    {
      id: "pp_out_04",
      reference: "VIR-PP-1025",
      providerId: "pp_mtn",
      providerName: "MTN MoMo",
      amount: 985000,
      fees: 9850,
      scheduledFor: "2026-11-10T09:00:00Z",
      status: "PAID",
      bank: "BICEC •••• 0142",
    },
  ];
};

let connectionsBySchool: Record<string, FakePaymentProviderConnection[]> = {};
let payoutsBySchool: Record<string, FakePaymentPayout[]> = {};

const clone = <T,>(v: T): T => (typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

const ensureSeeded = (schoolId: string) => {
  if (!connectionsBySchool[schoolId]) connectionsBySchool[schoolId] = connectionSeed(schoolId);
  if (!payoutsBySchool[schoolId]) payoutsBySchool[schoolId] = payoutSeed(schoolId);
};

export function fetchConnections(schoolId: string): Promise<FakePaymentProviderConnection[]> {
  ensureSeeded(schoolId);
  return new Promise((resolve) =>
    setTimeout(() => resolve(clone(connectionsBySchool[schoolId]!)), 200),
  );
}

export function fetchPayouts(schoolId: string): Promise<FakePaymentPayout[]> {
  ensureSeeded(schoolId);
  return new Promise((resolve) =>
    setTimeout(() => resolve(clone(payoutsBySchool[schoolId]!)), 200),
  );
}

export function connectProvider(
  schoolId: string,
  input: ConnectProviderInput,
): FakePaymentProviderConnection | null {
  ensureSeeded(schoolId);
  const catalog = PAYMENT_PROVIDER_CATALOG.find((c) => c.kind === input.kind);
  if (!catalog) return null;
  const list = connectionsBySchool[schoolId]!;
  if (list.some((c) => c.kind === input.kind)) return null;
  const created: FakePaymentProviderConnection = {
    id: `pp_${input.kind.toLowerCase()}_${Date.now().toString(36)}`,
    kind: input.kind,
    name: catalog.name,
    shortName: catalog.shortName,
    phone: input.phone.trim(),
    holder: input.holder.trim(),
    feePercent: catalog.feePercent,
    status: "ACTIVE",
    testMode: input.testMode,
    connectedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
  };
  list.unshift(created);
  return clone(created);
}

export function patchConnection(
  schoolId: string,
  providerId: string,
  patch: Partial<FakePaymentProviderConnection>,
): FakePaymentProviderConnection | null {
  const list = connectionsBySchool[schoolId] ?? [];
  const index = list.findIndex((c) => c.id === providerId);
  if (index < 0) return null;
  list[index] = { ...list[index]!, ...patch, lastSyncAt: new Date().toISOString() };
  return clone(list[index]);
}

export function disconnectProvider(schoolId: string, providerId: string): boolean {
  const list = connectionsBySchool[schoolId] ?? [];
  const next = list.filter((c) => c.id !== providerId);
  if (next.length === list.length) return false;
  connectionsBySchool[schoolId] = next;
  return true;
}