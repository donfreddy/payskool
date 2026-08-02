# PAYSKOOL 🎓

**PAYSKOOL** is a B2B PayTech SaaS platform dedicated to financial management and automated tuition fee collection for schools in Sub-Saharan Africa.

Our mission is to simplify payments (Mobile Money, cash, cheque) while providing full transparency to school promoters and parents.

---

## 🏗️ Architecture

The project is structured as a **Monorepo** using [Turborepo](https://turbo.build/) and [pnpm](https://pnpm.io/) for optimal dependency and build management.

### 📱 Applications (`/apps`)

- **`parent`**: Mobile-first Progressive Web App (PWA) for parents. Lets them check balances, manage multiple children, and pay via Mobile Money. (React / Vite)
- **`school`**: B2B dashboard for school promoters and administrators. Manages fee schedules, cash registers, and the financial enablement module.
- **`marketing`**: Product website and landing page. (Next.js)
- **`platform`**: Global administration interface (Super Admin) for the PAYSKOOL platform.
- **`api`**: Main backend (REST / GraphQL API) handling business logic and the database.

### 📦 Shared Packages (`/packages`)

- **`ui`**: Reusable React components (Design System).
- **`db`**: Prisma schema and database client.
- **`api-client`**: Typed API client for communicating with the backend.
- **`shared`**: Shared utilities, types, and functions.
- **`config-*`**: Shared configurations (ESLint, TypeScript, Tailwind CSS).

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v9+)

### Installation

1. Clone the repository and install dependencies at the root:
   ```bash
   pnpm install
   ```

2. Configure environment variables (database, etc.):
   ```bash
   cp .env.example .env
   ```

3. Initialize the database:
   ```bash
   pnpm db:generate
   pnpm db:push
   # Optional: pnpm db:seed
   ```

### Running the project in development

To start all applications in parallel:
```bash
pnpm run dev
```

To run a specific application (e.g. the Parent app):
```bash
pnpm --filter parent run dev
```

---

## 📚 Technical Documentation

For more details on PAYSKOOL's functional and technical specifications, see the [Requirements Document (BRD / PRD)](./BRD_PRD_PAYSKOOL.md) at the root of the project.