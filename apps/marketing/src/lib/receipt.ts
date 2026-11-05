/**
 * Normalises what a person types or pastes as a receipt number into the
 * canonical "REC-<digits>" form. Tolerated: case, whitespace of any kind (a
 * phone keyboard often inserts a non-breaking space), any dash between the
 * prefix and the digits, a "N°" prefix, leading zeros and a trailing dot.
 * Whitespace is dropped everywhere, so "REC-8 957" reads as REC-8957, but any
 * other separator inside the digits is refused: "REC-8957-2" is not REC-89572.
 * Returns null when the input holds no receipt number.
 */
export function normalizeReceiptNumber(input: string): string | null {
  const compact = input
    .normalize("NFKC")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^N[°O]/, "")
    .replace(/[‐-―−]/g, "-");
  const match = compact.match(/^(?:REC)?[-.:]?0*(\d{1,12})\.?$/);
  return match ? `REC-${match[1]}` : null;
}
