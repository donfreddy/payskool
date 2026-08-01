import { TRANSACTION_PREFIX, RECEIPT_PREFIX } from '../constants.js'

// =============================================================================
// Reference Code Generators — PAYSKOOL
// Generates unique, human-readable codes for transactions and receipts
// =============================================================================

/**
 * Generates a transaction reference code.
 * Format: TXN-{SCHOOL_SLUG_UPPER}-{YYYYMMDD}-{SEQ_5DIGITS}
 * Example: TXN-STMARIE-20261015-00042
 */
export function generateTransactionRef(
  schoolSlug: string,
  sequenceNumber: number,
  date: Date = new Date(),
): string {
  const slug = schoolSlug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
  const dateStr = formatDateCompact(date)
  const seq = String(sequenceNumber).padStart(5, '0')
  return `${TRANSACTION_PREFIX}-${slug}-${dateStr}-${seq}`
}

/**
 * Generates a receipt number.
 * Format: REC-{SCHOOL_SLUG}-{YYYYMMDD}-{SEQ_5DIGITS}
 * Example: REC-STMARIE-20261015-00042
 */
export function generateReceiptNumber(
  schoolSlug: string,
  sequenceNumber: number,
  date: Date = new Date(),
): string {
  const slug = schoolSlug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
  const dateStr = formatDateCompact(date)
  const seq = String(sequenceNumber).padStart(5, '0')
  return `${RECEIPT_PREFIX}-${slug}-${dateStr}-${seq}`
}

/**
 * Generates an idempotency key for payment deduplication.
 * Format: {schoolId}-{studentId}-{amount}-{timestamp}
 */
export function generateIdempotencyKey(
  schoolId: string,
  studentId: string,
  amount: number,
): string {
  const ts = Date.now()
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `${schoolId.slice(0, 8)}-${studentId.slice(0, 8)}-${amount}-${ts}-${rand}`
}

/**
 * Generates a secure invitation token (URL-safe base64)
 */
export function generateInvitationToken(): string {
  const bytes = new Uint8Array(32)
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(bytes)
  }
  return Buffer.from(bytes).toString('base64url')
}

function formatDateCompact(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}
