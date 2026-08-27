export const TEMPLATE_FIELDS: { key: string; label: string }[] = [
  { key: "{parent}", label: "Nom du parent" },
  { key: "{élève}", label: "Prénom + nom" },
  { key: "{montant}", label: "Reste dû (FCFA)" },
  { key: "{échéance}", label: "Échéance concernée" },
];

export function renderTemplate(template: string, values: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(values)) {
    out = out.split(`{${key}}`).join(value);
  }
  return out;
}

export function sampleValues(): { values: Record<string, string>; source: string } {
  return {
    source: "Aperçu avec Aminata Koné · 6ème A",
    values: {
      parent: "Mme Koné Awa",
      élève: "Aminata Koné",
      montant: "250 000 FCFA",
      échéance: "15 nov.",
    },
  };
}