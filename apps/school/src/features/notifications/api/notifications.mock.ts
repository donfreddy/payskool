import type {
  FakeNotification,
  FakeRelanceRule,
  FakeStudent,
} from "@/core/mocks/fake-data";
import {
  fetchNotificationHistory,
  fetchRelanceRules,
  patchRelanceRule,
  sendRelanceNotification,
} from "@/core/mocks/notifications-db";

/**
 * Couche d'accès simulée du domaine Communication (relances & notifications).
 * À remplacer par les appels réels vers `apps/api`
 * (GET/PATCH /relance-rules, GET/POST /notifications/relances).
 */

export function listRelanceRules(_schoolId: string): Promise<FakeRelanceRule[]> {
  return fetchRelanceRules();
}

export function saveRelanceRule(
  _schoolId: string,
  ruleId: string,
  patch: Partial<FakeRelanceRule>,
): Promise<FakeRelanceRule | null> {
  return Promise.resolve(patchRelanceRule(ruleId, patch));
}

export function listNotificationHistory(_schoolId: string): Promise<FakeNotification[]> {
  return fetchNotificationHistory();
}

export function sendRelance(
  _schoolId: string,
  student: FakeStudent,
): Promise<FakeNotification | null> {
  return Promise.resolve(sendRelanceNotification(student));
}