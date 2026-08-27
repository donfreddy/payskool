import {
  connectProvider,
  disconnectProvider,
  fetchConnections,
  fetchPayouts,
  patchConnection,
  type ConnectProviderInput,
  type FakePaymentPayout,
  type FakePaymentProviderConnection,
} from "@/core/mocks/payment-providers-db";

/** Couche d'accès simulée des intégrations de paiement (GET/POST ✓/PATCH /payment-providers). */

export function listConnections(schoolId: string): Promise<FakePaymentProviderConnection[]> {
  return fetchConnections(schoolId);
}

export function listPayouts(schoolId: string): Promise<FakePaymentPayout[]> {
  return fetchPayouts(schoolId);
}

export function addConnection(
  schoolId: string,
  input: ConnectProviderInput,
): Promise<FakePaymentProviderConnection | null> {
  return Promise.resolve(connectProvider(schoolId, input));
}

export function saveConnection(
  schoolId: string,
  providerId: string,
  patch: Partial<FakePaymentProviderConnection>,
): Promise<FakePaymentProviderConnection | null> {
  return Promise.resolve(patchConnection(schoolId, providerId, patch));
}

export function removeConnection(schoolId: string, providerId: string): Promise<boolean> {
  return Promise.resolve(disconnectProvider(schoolId, providerId));
}

export type { ConnectProviderInput };