import {
  listOnlinePayments,
  refundOnlinePayment,
  simulateParentPayment,
} from "@/core/mocks/payments-db";
import type { OnlinePayment } from "@/features/payments/types";

/**
 * Couche d'accès simulée du domaine Paiements en ligne.
 * Les signatures imitent de futurs appels API (Promises) — il suffira de
 * remplacer le corps par des fetch vers `apps/api` sans toucher aux écrans.
 */

export function listPayments(_schoolId: string): Promise<OnlinePayment[]> {
  return listOnlinePayments();
}

export function refundPayment(paymentId: string): Promise<OnlinePayment | null> {
  return Promise.resolve(refundOnlinePayment(paymentId));
}

export function simulateParentPaymentFromPortal(): Promise<OnlinePayment> {
  return Promise.resolve(simulateParentPayment());
}