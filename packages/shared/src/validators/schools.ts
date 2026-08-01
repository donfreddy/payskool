import { z } from 'zod'
import { SCHOOL_TYPES, SUPPORTED_CURRENCIES, SUPPORTED_COUNTRIES, USER_ROLES } from '../constants.js'

// =============================================================================
// School Zod Validators
// =============================================================================

export const createSchoolSchema = z.object({
  name: z.string().min(2).max(255).trim(),
  type: z.enum(SCHOOL_TYPES),
  address: z.string().max(500).optional(),
  city: z.string().min(1).max(100).trim(),
  countryCode: z.enum(SUPPORTED_COUNTRIES),
  currency: z.enum(SUPPORTED_CURRENCIES),
  phone: z.string().max(20).optional(),
  academicYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, 'Format: 2026-2027'),
  timezone: z.string().default('Africa/Abidjan'),
})
export type CreateSchoolInput = z.infer<typeof createSchoolSchema>

export const updateSchoolSchema = createSchoolSchema.partial().extend({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED']).optional(),
})
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>

// ---- Invitation ----
export const inviteMemberSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  role: z.enum(['SCHOOL_ADMIN', 'CASHIER'] as const),
}).refine((data) => data.email || data.phone, {
  message: 'Email ou téléphone requis',
})
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
