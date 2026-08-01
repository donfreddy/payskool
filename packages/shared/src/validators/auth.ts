import { z } from 'zod'
import { PHONE_REGEX, PASSWORD_REGEX } from '../constants.js'

// =============================================================================
// Auth Zod Validators
// Shared between NestJS DTOs and React Hook Form
// =============================================================================

// ---- Register (Owner / School Admin) ----
export const registerSchema = z.object({
  email: z.string().email('Email invalide').max(255),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(PASSWORD_REGEX, 'Doit contenir au moins 1 majuscule et 1 chiffre'),
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  workspaceName: z.string().min(2).max(255).trim().optional(),
})
export type RegisterInput = z.infer<typeof registerSchema>

// ---- Login (Email + Password) ----
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
export type LoginInput = z.infer<typeof loginSchema>

// ---- OTP Request (Parent / Passwordless) ----
export const otpRequestSchema = z.object({
  phone: z
    .string()
    .regex(PHONE_REGEX, 'Format: +225 07 XX XX XX XX (international)'),
})
export type OtpRequestInput = z.infer<typeof otpRequestSchema>

// ---- OTP Verify ----
export const otpVerifySchema = z.object({
  phone: z.string().regex(PHONE_REGEX),
  code: z.string().length(6, 'Le code OTP doit contenir 6 chiffres').regex(/^\d+$/),
})
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>

// ---- Refresh Token ----
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>

// ---- Change Password ----
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(PASSWORD_REGEX, 'Doit contenir au moins 1 majuscule et 1 chiffre'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
