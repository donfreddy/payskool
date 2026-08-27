const cfa = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 450000 -> "450 000 FCFA" (espace fine fr-FR). */
export function formatCFA(amount: number): string {
  return `${cfa.format(Math.round(amount))} FCFA`;
}

/** 450000 -> "450 000" — montant sans devise, pour les tickets. */
export function formatDigits(amount: number): string {
  return cfa.format(Math.round(amount));
}

/** 5000 -> "5 k" */
export function formatCompactCFA(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `${cfa.format(Math.round(amount / 1000))} k FCFA`;
  return cfa.format(Math.round(amount / 1000)) + " k";
}

/** "2026-11-15" -> "15 nov." (libellés courts). */
export function formatShortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/** "2026-11-15" -> "lun. 15 nov. 2026" */
export function formatFullDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

/** "2026-11-20T10:42:00Z" -> "10:42" */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/** "Junior Kengni" -> "JK" */
export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}