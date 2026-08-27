/** Centre d’aide Payskool : canaux de contact selon le plan et historique des tickets de support.
 * Contacts et FAQ alignés sur le site vitrine (apps/marketing → « FAQ » et footer).
 */
export type TicketStatus = "OPEN" | "ANSWERED" | "RESOLVED";

export type TicketCategory = "Paiement" | "Facturation" | "Compte & accès" | "Configuration" | "Autre";

export interface FakeSupportTicket {
  id: string;
  reference: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export const SUPPORT_WHATSAPP = "https://wa.me/237671123401";
export const SUPPORT_EMAIL = "support@payskool.africa";

/** Canal prioritaire selon le plan — miroir des promesses du site vitrine. */
export const SUPPORT_PER_PLAN: Record<string, { title: string; detail: string }> = {
  STARTER: { title: "Support par email", detail: "Réponse sous 48 h ouvrées." },
  PRO: { title: "Support prioritaire WhatsApp", detail: "Réponse en moins de 2 h, canal dédié." },
  GROUPE: { title: "Interlocuteur dédié", detail: "Accompagnement direct et formation sur site." },
};

export const SUPPORT_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "L’argent transite-t-il par Payskool ?",
    a: "Non. L’argent va directement sur le compte bancaire ou Mobile Money de l’école. Payskool est un service par abonnement : nous ne collectons et ne retenons jamais vos fonds. Vous connectez vous-même vos comptes Mobile Money et les paiements arrivent directement chez vous.",
  },
  {
    q: "Comment faire si nos parents paient toujours en liquide à la caisse ?",
    a: "Notre module Guichet permet d’encaisser le cash en 5 secondes avec édition immédiate du reçu. Chaque transaction est horodatée et tracée, éliminant tout risque d’écart de caisse. Le reçu est envoyé instantanément au parent par WhatsApp.",
  },
  {
    q: "Combien de temps faut-il pour démarrer ?",
    a: "Moins de 2 heures. Vous importez vos listes d’élèves en quelques minutes depuis votre fichier Excel habituel. La connexion de vos comptes Mobile Money est guidée pas à pas. Nos équipes vous accompagnent jusqu’à votre premier encaissement.",
  },
  {
    q: "Comment connecter mon compte Mobile Money ?",
    a: "Rendez-vous dans Paramètres → Intégrations Paiement, choisissez votre fournisseur (Wave, Flutterwave, Paystack, PayUnit, CamPay, Marviance), puis suivez les étapes de configuration et de vérification. Un seul fournisseur est actif à la fois.",
  },
  {
    q: "Comment changer de plan ou de moyen de paiement ?",
    a: "Dans Paramètres → Facturation Payskool, vous pouvez changer de plan et de cycle (mensuel ou annuel) à tout moment. Le prorata du mois en cours est ajusté sur la prochaine facture. Les annuels bénéficient de −20 %.",
  },
  {
    q: "Quels moyens de paiement sont supportés ?",
    a: "Wave, Flutterwave, Paystack, PayUnit, CamPay et Marviance. Ainsi que les paiements en espèces et par chèque via notre module Guichet. Nous ajoutons régulièrement de nouveaux moyens de paiement selon les besoins de nos écoles.",
  },
];

const tickets = (schoolId: string): FakeSupportTicket[] => {
  if (schoolId === "lycee-saint-paul") {
    return [
      { id: "tkt_lp_2", reference: "TKT-2026-0041", subject: "Planificateur des relances WhatsApp", category: "Configuration", status: "ANSWERED", createdAt: "2026-11-18T10:20:00Z", updatedAt: "2026-11-18T14:05:00Z" },
      { id: "tkt_lp_1", reference: "TKT-2026-0029", subject: "Export comptable de la trésorerie", category: "Paiement", status: "RESOLVED", createdAt: "2026-11-02T08:00:00Z", updatedAt: "2026-11-03T09:30:00Z" },
    ];
  }
  if (schoolId === "maternelle-bisounours") {
    return [
      { id: "tkt_mb_1", reference: "TKT-2026-0038", subject: "Accès au portail parent d’une nouvelle inscrite", category: "Compte & accès", status: "OPEN", createdAt: "2026-11-19T09:12:00Z", updatedAt: "2026-11-19T09:12:00Z" },
    ];
  }
  return [
    { id: "tkt_cs_3", reference: "TKT-2026-0037", subject: "Échec d’un paiement Wave au guichet", category: "Paiement", status: "OPEN", createdAt: "2026-11-15T16:40:00Z", updatedAt: "2026-11-15T16:40:00Z" },
    { id: "tkt_cs_2", reference: "TKT-2026-0031", subject: "Imprimer les reçus de novembre en lot", category: "Configuration", status: "ANSWERED", createdAt: "2026-11-06T11:22:00Z", updatedAt: "2026-11-07T08:45:00Z" },
    { id: "tkt_cs_1", reference: "TKT-2026-0024", subject: "Import Excel : colonnes non reconnues", category: "Configuration", status: "RESOLVED", createdAt: "2026-10-21T13:30:00Z", updatedAt: "2026-10-22T10:15:00Z" },
  ];
};

let ticketsBySchool: Record<string, FakeSupportTicket[]> = {};

const clone = <T,>(v: T): T => (typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

const ensureSeeded = (schoolId: string) => {
  if (!ticketsBySchool[schoolId]) ticketsBySchool[schoolId] = tickets(schoolId);
};

let counter = 0;

export function fetchSupportTickets(schoolId: string): Promise<FakeSupportTicket[]> {
  ensureSeeded(schoolId);
  return new Promise((resolve) => setTimeout(() => resolve(clone(ticketsBySchool[schoolId]!)), 200));
}

export function createSupportTicket(
  schoolId: string,
  input: { subject: string; category: TicketCategory },
): FakeSupportTicket {
  ensureSeeded(schoolId);
  counter += 1;
  const now = new Date().toISOString();
  const ticket: FakeSupportTicket = {
    id: `tkt_${schoolId}_${counter}`,
    reference: `TKT-2026-${String(42 + counter).padStart(4, "0")}`,
    subject: input.subject,
    category: input.category,
    status: "OPEN",
    createdAt: now,
    updatedAt: now,
  };
  ticketsBySchool[schoolId] = [ticket, ...ticketsBySchool[schoolId]!];
  return clone(ticket);
}