export interface PilotRequest {
  school: string;
  city: string;
  students: string;
}

export const MAX_FIELD_LENGTH = 120;

/**
 * One form field as it goes into the message: whitespace runs (line breaks
 * included, so a field cannot forge extra lines) become one space, and the
 * value is cut by code point, never inside a surrogate pair: a lone surrogate
 * makes encodeURIComponent throw.
 */
export function cleanField(value: unknown): string {
  if (typeof value !== "string") return "";
  const compact = value.replace(/\s+/g, " ").trim();
  return Array.from(compact).slice(0, MAX_FIELD_LENGTH).join("").trimEnd();
}

/**
 * The pilot request message. Empty fields are left out rather than sent blank,
 * so a promoter who only types the school name still sends a clean message.
 * Labels carry their own colon, so each locale sets its own typography.
 */
export function pilotRequestMessage(
  intro: string,
  labels: Record<keyof PilotRequest, string>,
  request: Partial<PilotRequest> = {},
): string {
  const lines = (Object.keys(labels) as (keyof PilotRequest)[])
    .map((key) => [labels[key], request[key]?.trim()] as const)
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `${label} ${value}`);
  return [intro, ...lines].join("\n");
}
