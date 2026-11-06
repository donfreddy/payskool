/**
 * SMS length and billing, per GSM 03.38. A message that fits the GSM-7
 * alphabet costs one SMS per 160 characters (153 once split); one character
 * outside it switches the whole message to UCS-2: 70 per SMS (67 once split).
 */

const GSM_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?" +
  "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";

/** Characters that need an escape, so they count twice in GSM-7. */
const GSM_EXTENDED = "^{}\\[~]|€\f";

const basic = new Set(GSM_BASIC);
const extended = new Set(GSM_EXTENDED);

export type SmsEncoding = "GSM-7" | "UCS-2";

export interface SmsCount {
  encoding: SmsEncoding;
  /** Characters as billed: GSM-7 septets, or UTF-16 code units in UCS-2. */
  length: number;
  segments: number;
  /** Characters outside GSM-7, deduplicated, in order of appearance. */
  offending: string[];
}

/**
 * Typography that word processors and phones insert silently, and that would
 * otherwise force UCS-2: no-break spaces, curly quotes, ellipsis, dashes.
 */
export function toSmsText(text: string): string {
  // Code points, as the formatter writes them literally: spaces U+00A0 U+202F
  // U+2007 U+2009; single quotes U+2018 U+2019 U+201B U+2032; double quotes
  // U+201C U+201D U+00AB U+00BB; ellipsis U+2026; dashes U+2010 to U+2015.
  return text
    .replace(/[    ]/g, " ")
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/…/g, "...")
    .replace(/[‐-―]/g, "-");
}

/**
 * Parts needed for a multi-part SMS, filled greedily: an escape pair (GSM-7)
 * or a surrogate pair (UCS-2) is never split across two parts, which can cost
 * one part more than a plain division.
 */
function parts(costs: number[], single: number, multi: number): number {
  const total = costs.reduce((sum, cost) => sum + cost, 0);
  if (total === 0) return 0;
  if (total <= single) return 1;
  let count = 1;
  let used = 0;
  for (const cost of costs) {
    if (used + cost > multi) {
      count += 1;
      used = 0;
    }
    used += cost;
  }
  return count;
}

export function countSms(text: string): SmsCount {
  const chars = Array.from(text);
  const offending: string[] = [];
  for (const char of chars) {
    if (!basic.has(char) && !extended.has(char) && !offending.includes(char)) {
      offending.push(char);
    }
  }

  if (offending.length === 0) {
    const costs = chars.map((char) => (extended.has(char) ? 2 : 1));
    return {
      encoding: "GSM-7",
      length: costs.reduce((sum, cost) => sum + cost, 0),
      segments: parts(costs, 160, 153),
      offending,
    };
  }

  // UCS-2 bills UTF-16 code units: an emoji is two.
  const costs = chars.map((char) => char.length);
  return {
    encoding: "UCS-2",
    length: text.length,
    segments: parts(costs, 70, 67),
    offending,
  };
}

/** Characters left before the next part starts, for the current encoding. */
export function roomLeft(count: SmsCount): number {
  if (count.segments <= 1) return (count.encoding === "GSM-7" ? 160 : 70) - count.length;
  const per = count.encoding === "GSM-7" ? 153 : 67;
  return Math.max(0, count.segments * per - count.length);
}

/**
 * Plain-letter stand-ins for the French characters that are outside GSM-7,
 * as most schools already write them in SMS. Uppercase Ç and É are GSM-7.
 */
const GSM_FALLBACK: Record<string, string> = {
  ç: "c",
  â: "a",
  ê: "e",
  ë: "e",
  î: "i",
  ï: "i",
  ô: "o",
  û: "u",
  ÿ: "y",
  œ: "oe",
  Œ: "OE",
  À: "A",
  Â: "A",
  È: "E",
  Ê: "E",
  Ë: "E",
  Î: "I",
  Ï: "I",
  Ô: "O",
  Ù: "U",
  Û: "U",
};

export function gsmFallback(text: string): string {
  return Array.from(text, (char) => GSM_FALLBACK[char] ?? char).join("");
}

/** The fallbacks that would apply to these characters, for display ("ç → c"). */
export function fallbackPairs(chars: string[]): [string, string][] {
  return chars.flatMap((char) => {
    const replacement = GSM_FALLBACK[char];
    return replacement ? [[char, replacement] as [string, string]] : [];
  });
}

/** Replaces each {token} with its value; unknown tokens are left as typed. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{([^{}]+)\}/g, (match, token: string) => values[token] ?? match);
}

/**
 * For display only: keeps amounts and French punctuation from breaking across
 * lines in a narrow bubble. Never use it on text that is sent or counted.
 */
export function displaySms(text: string): string {
  const nbsp = String.fromCharCode(0xa0);
  return text
    .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${nbsp}`)
    .replace(/(\d) (?=FCFA)/g, `$1${nbsp}`)
    .replace(/ ([:;!?])/g, `${nbsp}$1`);
}
