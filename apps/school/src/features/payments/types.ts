import type { TxMethod } from "@/core/mocks/fake-data";

export type OnlineOperator = Extract<TxMethod, "ORANGE_MONEY" | "MTN_MOMO" | "WAVE">;

/** Statuts côté école : le webhook PSP fait foi (SETTLED = encaissé automatique).
 *  REFUNDED = remboursement décidé par l'école (incident). */
export type OnlinePaymentStatus = "SETTLED" | "REFUNDED";

/** Opportunité de paiement arrivée via "webhook" simulateur des intégrations
 *  MoMo/Wave (⇒ page Paramètres → Intégrations Paiement). En production c'est
 *  la notif webhook du PSP ; en démo elle est déclenchée par le bouton
 *  "Paiement Parent Simulé". */
export interface OnlinePayment {
  id: string;
  ref: string; // référence PSP, ex. "W-XXXX-2026"
  studentId: string;
  firstName: string;
  lastName: string;
  classLevel: string;
  matricule: string;
  gender: "M" | "F";
  academicYear: string;
  amount: number;
  operator: OnlineOperator;
  phone: string;
  parentName: string;
  createdAt: string; // ISO
  status: OnlinePaymentStatus;
  receiptId?: string;
  receiptNumber?: string;
}