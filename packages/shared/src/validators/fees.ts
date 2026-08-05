import { z } from 'zod'
import { FEE_TYPES, DISCOUNT_TYPES } from '../constants'

// =============================================================================
// Fee Engine Zod Validators
// =============================================================================

// ---- Fee Installment ----
export const feeInstallmentSchema = z.object({
  label: z.string().min(1).max(255).trim(),
  amount: z.number().int().positive('Le montant doit être positif'), // centimes
  dueDate: z.string().date('Format: YYYY-MM-DD'),
  sortOrder: z.number().int().default(0),
})
export type FeeInstallmentInput = z.infer<typeof feeInstallmentSchema>

// ---- Fee Structure ----
export const createFeeStructureSchema = z.object({
  name: z.string().min(2).max(255).trim(),
  description: z.string().max(1000).optional(),
  classLevel: z.string().min(1).max(50).trim(),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/),
  feeType: z.enum(FEE_TYPES).default('ONE_TIME'),
  installments: z
    .array(feeInstallmentSchema)
    .min(1, 'Au moins une tranche requise')
    .max(12, 'Maximum 12 tranches'),
})
export type CreateFeeStructureInput = z.infer<typeof createFeeStructureSchema>

export const updateFeeStructureSchema = createFeeStructureSchema.partial()
export type UpdateFeeStructureInput = z.infer<typeof updateFeeStructureSchema>

// ---- Apply Fee Structure to Students (batch) ----
export const applyFeeStructureSchema = z.object({
  feeStructureId: z.string().uuid(),
  studentIds: z.array(z.string().uuid()).min(1).max(500),
  discountType: z.enum(DISCOUNT_TYPES).default('NONE'),
  discountValue: z.number().int().min(0).default(0),
  discountReason: z.string().max(500).optional(),
})
export type ApplyFeeStructureInput = z.infer<typeof applyFeeStructureSchema>

// ---- Individual Student Fee Plan Adjustment ----
export const adjustFeePlanSchema = z.object({
  discountType: z.enum(DISCOUNT_TYPES),
  discountValue: z.number().int().min(0).max(100_000_000), // max 1M FCFA
  discountReason: z.string().max(500).optional(),
}).refine(
  (data) =>
    data.discountType !== 'PERCENTAGE' || (data.discountValue >= 0 && data.discountValue <= 100),
  { message: 'Pourcentage doit être entre 0 et 100', path: ['discountValue'] },
)
export type AdjustFeePlanInput = z.infer<typeof adjustFeePlanSchema>
