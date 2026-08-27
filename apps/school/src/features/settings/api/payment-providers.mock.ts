import {
  connectProvider,
  disconnectProvider,
  fetchConnection,
  fetchPayouts,
  type ConnectProviderInput,
  type FakePaymentPayout,
  type FakePaymentProviderConnection,
} from "@/core/mocks/payment-providers-db";

/** Couche d'accès simulée des fournisseurs d'encaissement (GET/POST /payment-providers). */

export function getActiveProvider(schoolId: string): Promise<FakePaymentProviderConnection | null> {
  return fetchConnection(schoolId);
}

export function listPayouts(schoolId: string): Promise<FakePaymentPayout[]> {
  return fetchPayouts(schoolId);
}

/** Configure un fournisseur — remplace l'éventuel fournisseur actif (un seul à la fois). */
export function saveProvider(
  schoolId: string,
  input: ConnectProviderInput,
): Promise<FakePaymentProviderConnection | null> {
  return Promise.resolve(connectProvider(schoolId, input));
}

export function removeActiveProvider(schoolId: string): Promise<void> {
  disconnectProvider(schoolId);
  return Promise.resolve();
}

export type { ConnectProviderInput };