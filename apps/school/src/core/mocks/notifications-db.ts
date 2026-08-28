import {
  CURRENT_ACADEMIC_YEAR,
} from "@/core/mocks/academic-years-db";
import {
  FAKE_NOTIFICATION_HISTORY,
  FAKE_RELANCE_RULES,
  MOCK_NOW,
  type FakeNotification,
  type FakeRelanceRule,
  type FakeStudent,
  type NotificationStatus,
} from "@/core/mocks/fake-data";

/**
 * "Base en mémoire" du domaine Communication (relances & notifications).
 * Le futur backend (apps/api) remplacera ces fonctions sans changer les écrans :
 * envoyer une relance ici revient à appeler POST /notifications/relances.
 */

let relanceRules: FakeRelanceRule[] = FAKE_RELANCE_RULES.map((r) => ({ ...r }));
let notificationHistory: FakeNotification[] = FAKE_NOTIFICATION_HISTORY.map((n) => ({ ...n }));

const clone = <T,>(v: T): T => (typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

export function fetchRelanceRules(): Promise<FakeRelanceRule[]> {
  return new Promise((resolve) => setTimeout(() => resolve(clone(relanceRules)), 220));
}

export function patchRelanceRule(
  ruleId: string,
  patch: Partial<FakeRelanceRule>,
): FakeRelanceRule | null {
  const index = relanceRules.findIndex((r) => r.id === ruleId);
  if (index < 0) return null;
  relanceRules[index] = { ...relanceRules[index]!, ...patch };
  return clone(relanceRules[index]);
}

export function fetchNotificationHistory(): Promise<FakeNotification[]> {
  return new Promise((resolve) => setTimeout(() => resolve(clone(notificationHistory)), 260));
}

/** Règle la plus proche activée (délai minimum) — utilisée par le guichet de relance. */
export function defaultRelanceRule(): FakeRelanceRule | null {
  const active = relanceRules
    .filter((r) => r.enabled)
    .sort((a, b) => a.delayDays - b.delayDays);
  return active[0] ? clone(active[0]) : null;
}

function render(template: string, values: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(values)) {
    out = out.split(`{${key}}`).join(value);
  }
  return out;
}

/** Enregistre un envoi de relance dans l'historique et le retourne. */
export function sendRelanceNotification(student: FakeStudent): FakeNotification | null {
  const rule = defaultRelanceRule();
  if (!rule) return null;

  const remaining = Math.max(
    student.feePlan.installments.reduce((sum, i) => sum + (i.amount - i.paid), 0) +
      (student.previousBalance < 0 ? -student.previousBalance : 0),
    0,
  );
  const due = student.feePlan.installments.find((i) => i.paid < i.amount) ?? student.feePlan.installments[0];
  const content = render(rule.template, {
    parent: student.parentName,
    élève: `${student.firstName} ${student.lastName}`,
    montant: `${remaining.toLocaleString("fr-FR")} FCFA`,
    échéance: due?.dueDate ? due.dueDate : (CURRENT_ACADEMIC_YEAR),
  });

  const entry: FakeNotification = {
    id: `notif_live_${Date.now()}_${student.id}`,
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    classLevel: student.classLevel,
    matricule: student.matricule,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    ruleId: rule.id,
    ruleName: rule.name,
    channel: rule.channel,
    status: "SENT" as NotificationStatus,
    content,
    createdAt: MOCK_NOW.toISOString(),
  };
  notificationHistory.unshift(entry);
  return clone(entry);
}