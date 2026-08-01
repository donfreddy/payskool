# DESIGN SYSTEM & BRANDING GUIDELINES — PAYSKOOL

> **Version:** 1.0.0  
> **Target Platform:** School Payment & Management SaaS  
> **UI Stack:** React / Next.js, Tailwind CSS, Shadcn UI primitives, Lucide Icons, TypeScript
> **Backend:** NestJS, Prisma, PostgreSQL, Redis and BullMQ

---

## 1. BRAND IDENTIFICATION & CORE POSITIONING

* **Brand Name:** Payskool
* **Tagline:** PAYSKOOL, the ideal solution for paying and tracking school fees for primary and secondary schools in Africa.
* **Target Audience:** School Owners/Promoters, School Directors, Cashiers, and Parents.
* **Brand Archetype:** High-Trust Fintech, Crisp, Professional, Frictionless. Inspired by Stripe, Linear, and Vercel.

---

## 2. COLOR PALETTE & TAILWIND TOKENS

The interface uses a **Light Mode First** aesthetic focused on financial security, clarity, and trust.

### Primary Color Tokens

| Semantic Role | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Page Background** | `#F8FAFC` | `bg-slate-50` | Main application background canvas |
| **Card / Surface Background** | `#FFFFFF` | `bg-white` | Surfaces for cards, tables, modals, and dropdowns |
| **Primary Brand / Navy** | `#0F172A` | `bg-slate-900` / `text-slate-900` | Headers, primary buttons, logo brand accent |
| **Secondary Neutral Text** | `#64748B` | `text-slate-500` | Subtitles, labels, metadata, muted text |
| **Borders & Dividers** | `#E2E8F0` | `border-slate-200` | Card borders, table dividers, inputs |
| **Action / Money Accent** | `#059669` | `bg-emerald-600` / `text-emerald-600` | Pay buttons, FCFA metrics, "PAID" badges |
| **Alert / Due Accent** | `#EA580C` | `bg-orange-600` / `text-orange-600` | Overdue status badges, payment alerts |

### Provider Badge Colors (Mobile Money Integrations)

* **Orange Money:** `#FF6600` background or `bg-orange-50 text-orange-600 border-orange-200`
* **MTN MoMo:** `#FFCC00` background or `bg-amber-50 text-amber-700 border-amber-200`
* **Wave:** `#1DC9CE` background or `bg-cyan-50 text-cyan-700 border-cyan-200`
* **Cash / Guichet:** `bg-slate-100 text-slate-700 border-slate-300`

---

## 3. TYPOGRAPHY & ICONOGRAPHY

* **Font Family:** `Inter`, `Geist Sans`, or system sans-serif fallback.
* **Icon Set:** Strictly use **Lucide Icons** (`lucide-react` / `lucide-vue-next`). Do not mix icon libraries.
* **Monetary Values Rules:**
  * Always format currency clearly: `50.000 FCFA` or `XAF`.
  * Money figures must be bold (`font-bold` or `font-semibold`) and use `text-slate-900` or `text-emerald-600`.

---

## 4. UI COMPONENTS DESIGN RULES

### A. Cards & Containers
* **Border Radius:** `rounded-xl` (12px) for desktop containers, `rounded-2xl` (16px) for mobile cards.
* **Borders:** Thin and crisp (`border border-slate-200`).
* **Shadows:** Minimalist (`shadow-sm`). Avoid heavy drop shadows.

### B. Buttons & Touch Targets
* **Primary Button (Navy):** `bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-4 py-2`
* **Finance Action Button (Emerald):** `bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-4 py-2 shadow-sm`
* **Mobile Touch Targets:** Minimum height of `48px` (`h-12`) for all mobile buttons.

---

## 5. ARCHITECTURAL PATTERNS & LAYOUT (OPTION A)

### A. Desktop Dashboard (School Admin & Promoter)

* **Layout:** 2-column shell with fixed left sidebar (`w-64`) and fluid main content area.
* **Sidebar Top Section — School Switcher Dropdown (Option A):**
  * Displays the currently selected school (e.g., `"CS Sainte-Marie"`).
  * Uses Shadcn `DropdownMenu` component.
  * Allows switching between schools owned by the same promoter or adding a new school.
  * Dynamically controls the context header (`X-School-Id`).
* **Main Area Grid:**
  * Top metrics bar featuring 4 stat cards (Total Revenue FCFA, Collection Rate %, Outstanding Balance, Active Students).
  * Main data table with clear payment status badges:
    * `SUCCESS / PAID`: Emerald Green badge
    * `OVERDUE / ALERT`: Orange badge
    * `PENDING / UPCOMING`: Slate/Gray badge

### B. Parent Mobile PWA (Paiement Mobile Money)

* **Viewport:** Mobile-First optimized layout (390px–412px focus).
* **Header:** Student selector tab (e.g., `"Marc K. Jr — 6ème A"`) with a notification bell.
* **Hero Card:** Dark gradient card (`bg-slate-900`) showing total balance due in large white text with a glowing Emerald Green CTA: `"Payer via Mobile Money"`.
* **Payment Timeline:** Vertical timeline showing installment steps (Tranches) with visual checkmarks and status badges.
* **Fixed Bottom Navigation:** Sticky bottom bar with 4 primary destinations (Accueil, Reçus, Élève, Support WhatsApp).

---

## 6. AI PROMPT INSTRUCTIONS / SYSTEM PROMPT ADDON

When generating code for **Payskool** interfaces:
1. Always implement light mode by default using `#F8FAFC` as canvas and `#FFFFFF` for cards.
2. Ensure monetary inputs and displays explicitly use **FCFA** formatting.
3. Integrate the **School Switcher** component inside the upper section of the Sidebar.
4. Use Tailwind CSS v3/v4 classes and Shadcn UI component structures exclusively.