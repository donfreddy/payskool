// =============================================================================
// Currency Utils — PAYSKOOL
// Amounts stored as BigInt centimes (e.g., 250000_00 = 250.000 FCFA)
// =============================================================================

/**
 * Formats centimes to a human-readable FCFA/XOF string.
 * Example: 25000000n → "250.000 FCFA"
 */
export function formatAmount(centimes: bigint | number, currency = 'XOF'): string {
  const amount = typeof centimes === 'bigint' ? Number(centimes) : centimes
  // FCFA, XAF, etc. have 0 decimal places conventionally
  const noDecimalCurrencies = ['XOF', 'XAF', 'GHS', 'UGX', 'RWF']

  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: noDecimalCurrencies.includes(currency) ? 0 : 2,
    maximumFractionDigits: noDecimalCurrencies.includes(currency) ? 0 : 2,
  }).format(amount / 100) // convert centimes to full unit

  return `${formatted} ${currency}`
}

/**
 * Converts a display amount (e.g., 250000) to centimes BigInt (25000000n)
 */
export function toCentimes(amount: number): bigint {
  return BigInt(Math.round(amount * 100))
}

/**
 * Converts centimes to a display number (e.g., 25000000n → 250000)
 */
export function fromCentimes(centimes: bigint | number): number {
  const c = typeof centimes === 'bigint' ? Number(centimes) : centimes
  return c / 100
}

/**
 * Converts a number amount in full units to centimes as number (for Prisma BigInt fields)
 */
export function amountToCentimes(amount: number): number {
  return Math.round(amount * 100)
}

/**
 * Formats a balance — shows negative (arrears) in red-readable format
 * Example: -50000n → "−500,00 XOF (ARRIÉRÉ)"
 */
export function formatBalance(centimes: bigint, currency = 'XOF'): string {
  if (centimes < 0n) {
    return `−${formatAmount(-centimes, currency)} (ARRIÉRÉ)`
  }
  if (centimes > 0n) {
    return `+${formatAmount(centimes, currency)} (AVANCE)`
  }
  return `0 ${currency}`
}
