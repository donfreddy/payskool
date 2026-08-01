Act as a Senior Principal Software Architect specialized in Node.js/TypeScript Monorepos and Clean Architecture.

I am building a PayTech B2B SaaS platform for schools in West/Central Africa. 
I need a complete, production-ready specification and step-by-step setup guide for a TypeScript Monorepo using **pnpm workspaces** and **Turborepo**.

### 1. TARGET ARCHITECTURE & TOPOLOGY
The monorepo must support 5 distinct applications and shared internal packages:

#### 📱 Applications (`/apps`):
1. `apps/api`: NestJS REST API (PostgreSQL, Prisma, Redis, BullMQ).
2. `apps/school`: Next.js 16+ (App Router) for School Directors & Accountants (Desktop Dashboard).
3. `apps/platform`: Next.js 16+ for Platform Owner (SaaS Admin).
4. `apps/parent`: React (Vite) PWA Mobile-First app for parents paying tuition via Mobile Money.
5. `apps/marketing`: Next.js 16+ for Marketing Website (Landing Page).

#### 📦 Shared Packages (`/packages`):
1. `packages/types`: Shared DTOs, Zod validation schemas, API interfaces, and Enums shared between NestJS and React/Next apps.
2. `packages/ui`: Shared UI Component library built with Tailwind CSS, Radix UI primitives / Shadcn/UI structure, and Lucide Icons.
3. `packages/api-client`: Shared Axios/TanStack Query (React Query) wrapper for typed API calls.
4. `packages/config-typescript`: Shared `tsconfig.json` base files (base, nestjs, react, nextjs).
5. `packages/config-tailwind`: Shared Tailwind CSS configuration and design tokens.
6. `packages/config-eslint`: Shared ESLint & Prettier rules.
7. `packages/database`: Shared database configuration (Prisma schema, migrations).
8. `packages/utils`: Shared utility functions.

---

### 2. REQUIREMENTS & WHAT YOU MUST PROVIDE

#### A. Full Folder & File Tree
- Provide the complete, detailed directory layout of the monorepo from root down to key configuration files, package entrypoints, and internal symlink files.
- Use explicit and consistent naming conventions.

#### B. Root Configuration Files
Provide the exact contents for:
1. `pnpm-workspace.yaml`
2. `turbo.json` (configured with proper pipeline caching for `build`, `lint`, `dev`, and `typecheck`).
3. Root `package.json` with scripts for dev, build, lint, and formatting.
4. `.gitignore` optimized for pnpm, Turborepo, NestJS, and Next.js.

#### C. Shared Packages Setup Details
Explain and show the exact configuration for:
1. How `packages/types` exports Zod schemas and TypeScript types so both NestJS DTOs and Frontend forms can consume them without bundling issues.
2. How `packages/ui` is configured with Tailwind CSS so `dashboard`, `platform`, `parent`, and `marketing` can import shared UI components smoothly.
3. How workspace dependency linking works (`"workspace:*"` protocol in `package.json`).

#### D. Local Development Workflow
- Commands to launch all apps in parallel using `turbo dev`.
- Command to run dev on a single app (e.g., only `api` + `school`).
- How environment variables (`.env`) should be structured across apps and packages securely using Zod or `dotenv-cli`.

---

### 🎛️ GUIDELINES & STYLE
- Prioritize developer experience (DX), strict type safety, zero circular dependencies, and fast build times using Turborepo cache.
- Be concise, technical, direct, and actionable. Provide actual code snippets and JSON configs, not vague explanations.