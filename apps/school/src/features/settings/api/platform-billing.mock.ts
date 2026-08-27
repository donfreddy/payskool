import {
  fetchInvoices,
  fetchSubscription,
  patchSubscription,
  type FakeBillingInvoice,
  type FakeSubscription,
} from "@/core/mocks/platform-billing-db";

/** Couche d'accès simulée de la facturation Payskool (GET/PATCH /subscription, GET /invoices). */

export function getSubscription(schoolId: string): Promise<FakeSubscription> {
  return fetchSubscription(schoolId);
}

export function listInvoices(schoolId: string): Promise<FakeBillingInvoice[]> {
  return fetchInvoices(schoolId);
}

export function updateSubscription(
  schoolId: string,
  patch: Partial<FakeSubscription>,
): Promise<FakeSubscription | null> {
  return Promise.resolve(patchSubscription(schoolId, patch));
}