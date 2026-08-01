import { z } from 'zod'
import { TRANSACTION_CHANNELS, PAYMENT_PROVIDERS } from '../constants.js'

// =============================================================================
// Transaction Zod Validators
// =============================================================================

// ---- Create Cash/Cheque Transaction (Cashier) ----
export const createCashTransactionSchema = z.object({
  studentId: z.string().uuid(),
  studentFeePlanId: z.string().uuid().optional(),
  amount: z.number().int().positive('Le montant doit être positif'), // centimes
  channel: z.enum(['CASH', 'CHEQUE'] as const),
  chequeNumber: z.string().max(50).optional(),
  chequeBank: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
}).refine(
  (data) => data.channel !== 'CHEQUE' || (!!data.chequeNumber && !!data.chequeBank),
  { message: 'N° chèque et banque requis pour un paiement par chèque' },
)
export type CreateCashTransactionInput = z.infer<typeof createCashTransactionSchema>

// ---- Initiate Online Payment (Parent) ----
export const initiateOnlinePaymentSchema = z.object({
  studentId: z.string().uuid(),
  studentFeePlanId: z.string().uuid().optional(),
  amount: z.number().int().positive(),
  provider: z.enum([
    'PAYSTACK', 'FLUTTERWAVE', 'CINETPAY', 'WAVE', 'ORANGE_MONEY', 'MTN_MOMO',
  ] as const),
  returnUrl: z.string().url().optional(),
})
export type InitiateOnlinePaymentInput = z.infer<typeof initiateOnlinePaymentSchema>

// ---- Create Reversal (Annulation) ----
export const createReversalSchema = z.object({
  originalTransactionId: z.string().uuid(),
  reason: z.string().min(5).max(500, 'Raison requise pour l\'annulation'),
})
export type CreateReversalInput = z.infer<typeof createReversalSchema>

// ---- Transaction Filters (query params) ----
export const transactionFiltersSchema = z.object({
  studentId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'FAILED', 'REVERSED'] as const).optional(),
  channel: z.enum(['CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER'] as const).optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>
