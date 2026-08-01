// =============================================================================
// PAYSKOOL — Constants, Enums & Limits
// Shared between API and all frontends
// =============================================================================

export const APP_NAME = 'PAYSKOOL' as const
export const APP_VERSION = '1.0.0' as const

// ---- Currency ----
export const SUPPORTED_CURRENCIES = ['XOF', 'XAF', 'GHS', 'NGN', 'KES', 'UGX', 'RWF'] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export const CURRENCY_LABELS: Record<SupportedCurrency, string> = {
  XOF: 'Franc CFA BCEAO (XOF)',
  XAF: 'Franc CFA BEAC (XAF)',
  GHS: 'Cedi Ghanéen (GHS)',
  NGN: 'Naira Nigérian (NGN)',
  KES: 'Shilling Kenyan (KES)',
  UGX: 'Shilling Ougandais (UGX)',
  RWF: 'Franc Rwandais (RWF)',
}

// ---- Countries (West/Central Africa) ----
export const SUPPORTED_COUNTRIES = [
  'CI', 'SN', 'CM', 'BF', 'ML', 'TG', 'BJ', 'CD', 'GH', 'NG', 'GN', 'GM', 'UG', 'RW',
] as const
export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number]

// ---- User Roles ----
export const USER_ROLES = ['SUPER_ADMIN', 'OWNER', 'SCHOOL_ADMIN', 'CASHIER', 'PARENT'] as const
export type UserRole = (typeof USER_ROLES)[number]

// ---- Workspace Plans ----
export const WORKSPACE_PLANS = ['TRIAL', 'STARTER', 'PRO', 'ENTERPRISE'] as const
export type WorkspacePlan = (typeof WORKSPACE_PLANS)[number]

export const PLAN_LIMITS: Record<WorkspacePlan, { maxSchools: number; maxStudents: number }> = {
  TRIAL: { maxSchools: 1, maxStudents: 50 },
  STARTER: { maxSchools: 2, maxStudents: 300 },
  PRO: { maxSchools: 5, maxStudents: 2000 },
  ENTERPRISE: { maxSchools: 999, maxStudents: 999_999 },
}

// ---- Transaction ----
export const TRANSACTION_CHANNELS = ['CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER'] as const
export const TRANSACTION_STATUSES = ['PENDING', 'CONFIRMED', 'FAILED', 'REVERSED'] as const
export const TRANSACTION_TYPES = ['PAYMENT', 'REVERSAL', 'REFUND', 'ADJUSTMENT'] as const

// ---- Payment Providers ----
export const PAYMENT_PROVIDERS = [
  'NONE', 'PAYSTACK', 'FLUTTERWAVE', 'CINETPAY', 'WAVE', 'ORANGE_MONEY', 'MTN_MOMO',
] as const
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number]

// ---- School Types ----
export const SCHOOL_TYPES = ['MATERNELLE', 'PRIMAIRE', 'SECONDAIRE', 'COMPLEXE'] as const

// ---- Student ----
export const STUDENT_STATUSES = ['ENROLLED', 'TRANSFERRED', 'GRADUATED', 'EXPELLED'] as const
export const GENDERS = ['M', 'F'] as const

// ---- Fee ----
export const FEE_TYPES = ['ONE_TIME', 'RECURRING'] as const
export const DISCOUNT_TYPES = ['NONE', 'PERCENTAGE', 'FIXED'] as const
export const INSTALLMENT_STATUSES = ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'] as const

// ---- Notifications ----
export const NOTIFICATION_CHANNELS = ['SMS', 'WHATSAPP', 'EMAIL', 'PUSH'] as const
export const NOTIFICATION_TYPES = [
  'PAYMENT_RECEIPT',
  'OVERDUE_REMINDER',
  'PAYMENT_CONFIRMATION',
  'UPCOMING_DUE',
  'WELCOME',
  'OTP',
] as const

// ---- OTP ----
export const OTP_LENGTH = 6
export const OTP_TTL_MINUTES = 5
export const OTP_MAX_ATTEMPTS = 3
export const OTP_MAX_SENDS_PER_HOUR = 5

// ---- Pagination ----
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// ---- Import ----
export const IMPORT_MAX_ROWS = 10_000
export const IMPORT_MAX_FILE_SIZE_MB = 5

// ---- Receipt ----
export const RECEIPT_PREFIX = 'REC'
export const TRANSACTION_PREFIX = 'TXN'

// ---- Auth ----
export const JWT_ACCESS_TTL = '15m'
export const JWT_REFRESH_TTL = '7d'
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/
export const PHONE_REGEX = /^\+[1-9]\d{6,14}$/

// ---- Academic Year ----
export const ACADEMIC_YEAR_REGEX = /^\d{4}-\d{4}$/
