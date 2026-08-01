# PAYSKOOL — Implementation Plan (Phase 1: MVP Foundation)

## Goal

Scaffold the complete PAYSKOOL monorepo and build the foundational layers: database schema, API server, authentication, multi-tenancy, and the admin dashboard shell. This is the **Sprint 0 + Sprint 1** that gets the platform from zero to a functional skeleton.

## Scope

Phase 1 focuses on the **backend foundation + admin dashboard**. The cashier app and parent PWA will reuse the same packages but are deferred to Phase 2.

---

## Proposed Changes

### 1. Monorepo Foundation (Turborepo)

#### [NEW] Root Configuration

- `package.json` — Workspace root with Turborepo
- `turbo.json` — Pipeline config (build, dev, lint, typecheck)
- `docker-compose.yml` — PostgreSQL 16 + Redis 7 for local dev
- `.env.example` — Environment variables template
- `.gitignore`
- `tsconfig.base.json` — Shared TypeScript config

---

### 2. `packages/db` — Database Layer (Prisma ORM)

#### [NEW] Prisma Schema

All 17+ tables from the BRD translated to Prisma schema:

- `prisma/schema.prisma` — Unified Prisma schema (tous les models)
- `prisma/migrations/` — Migrations générées automatiquement
- `src/client.ts` — PrismaClient singleton (avec extension RLS)
- `src/seed.ts` — Dev seed data
- `src/index.ts` — Re-export du client et des types

---

### 3. `packages/shared` — Shared Types & Validators

#### [NEW] Zod Validators + TypeScript Types

- `validators/auth.ts` — Login, register, OTP schemas
- `validators/schools.ts` — School CRUD schemas
- `validators/students.ts` — Student CRUD + import schemas
- `validators/fees.ts` — Fee structure, installment, plan schemas
- `validators/transactions.ts` — Transaction creation schemas
- `types/index.ts` — Shared TypeScript types (inferred from Zod)
- `constants.ts` — Enums, status codes, limits
- `utils/currency.ts` — Amount formatting (centimes → display)
- `utils/reference.ts` — Reference code generator

---

### 4. `packages/config` — Shared Configs

#### [NEW] ESLint, TypeScript, Tailwind configs

- `eslint/base.js`
- `typescript/base.json`
- `tailwind/base.ts`

---

### 5. `packages/ui` — Shared UI Components

#### [NEW] Shadcn/ui base setup

- Initialized with core primitives (Button, Input, Card, Dialog, Table, Badge, etc.)
- Tailwind config with PAYSKOOL design tokens (colors, typography)

---

### 6. `apps/api` — Fastify REST API

#### [NEW] API Server

- `src/index.ts` — Fastify server bootstrap
- `src/plugins/auth.ts` — JWT verification + user injection
- `src/plugins/tenant.ts` — `X-School-Id` middleware + RLS context
- `src/middleware/authorize.ts` — RBAC permission checker
- **Auth routes:** register, login, OTP, refresh
- **Resource routes:** workspaces, schools, members, students, fees, transactions, webhooks, reports
- **Services:** FIFO allocation, webhook verification, OTP, encryption, queue setup

---

### 7. `apps/admin` — Next.js Admin Dashboard

#### [NEW] Admin Dashboard Shell

- Next.js 15 App Router with Shadcn/ui
- Layout with sidebar + school switcher
- Core pages: login, dashboard, students, fees, transactions, reports, settings, team

---

## Build Order

```
Step 1: Root scaffolding (Turborepo + Docker)
Step 2: packages/config
Step 3: packages/db (Drizzle schema + migrations)
Step 4: packages/shared (Zod validators + types)
Step 5: apps/api (Fastify server + auth + tenant + core routes)
Step 6: packages/ui (Shadcn/ui setup)
Step 7: apps/admin (Next.js dashboard)
```

> [!IMPORTANT]
> This is a large MVP. I'll build it incrementally, starting with the foundation layers and working up to the UI. Each step will produce runnable, testable code.

## Open Questions

> [!IMPORTANT]
> **Before I proceed, please confirm:**
> 1. **Node.js version** — Are you on Node 20+? (required for Turborepo + Next.js 15)
> 2. **Do you have Docker installed?** — Needed for local PostgreSQL + Redis. If not, I can configure for local installs instead.
> 3. **Should I start building now?** — This will generate ~80+ files. I'll go step by step so you can follow along.

## Verification Plan

### Automated Tests
- `pnpm db:push` — Apply Prisma schema to PostgreSQL
- `pnpm --filter api dev` — Start API server, hit health check
- `pnpm --filter admin dev` — Start admin dashboard, verify renders

### Manual Verification
- API: `curl localhost:3001/api/health` returns 200
- Admin: `localhost:3000` renders login page
- DB: All tables created with correct constraints
