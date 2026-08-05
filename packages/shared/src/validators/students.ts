import { z } from 'zod'
import { GENDERS, STUDENT_STATUSES } from '../constants'

// =============================================================================
// Student Zod Validators
// =============================================================================

export const createStudentSchema = z.object({
  matricule: z.string().min(1).max(50).trim(),
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  gender: z.enum(GENDERS).optional(),
  dateOfBirth: z.string().date().optional(), // ISO 8601: YYYY-MM-DD
  classLevel: z.string().min(1).max(50).trim(),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, 'Format: 2026-2027'),
  previousBalance: z.number().int().default(0), // centimes
  photoUrl: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})
export type CreateStudentInput = z.infer<typeof createStudentSchema>

export const updateStudentSchema = createStudentSchema.partial().extend({
  status: z.enum(STUDENT_STATUSES).optional(),
})
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>

// ---- Import Row (validation ligne par ligne) ----
export const importStudentRowSchema = z.object({
  matricule: z.string().min(1).max(50),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  gender: z.enum(GENDERS).optional(),
  classLevel: z.string().min(1).max(50),
  previousBalance: z.coerce.number().int().default(0),
  parentPhone: z.string().max(20).optional(),
  parentName: z.string().max(200).optional(),
})
export type ImportStudentRow = z.infer<typeof importStudentRowSchema>

// ---- Import Job ----
export const importJobConfigSchema = z.object({
  academicYear: z.string().regex(/^\d{4}-\d{4}$/),
  onDuplicate: z.enum(['IGNORE', 'OVERWRITE', 'MERGE']).default('IGNORE'),
  columnMapping: z.record(z.string(), z.string()), // fileColumn → fieldName
})
export type ImportJobConfig = z.infer<typeof importJobConfigSchema>

// ---- Parent Link ----
export const linkParentSchema = z.object({
  phone: z.string().min(7).max(20),
  relationship: z.string().max(50).default('PARENT'),
  isPrimary: z.boolean().default(false),
})
export type LinkParentInput = z.infer<typeof linkParentSchema>
