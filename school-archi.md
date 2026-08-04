# Architecture — `apps/school` (Payskool Dashboard)

Fondation de dossiers/fichiers pour le dashboard B2B (promoteurs, admins d'école, caissiers), dans le monorepo Turborepo. Basé sur les 3 décisions actées :

| Décision | Choix |
|---|---|
| Contexte "école active" | URL — `/[schoolId]/...` |
| Data-fetching | RSC-first (fetch initial serveur, TanStack Query pour mutations/refetch client) |
| Organisation | Feature-based (colocation par domaine métier) |

Ces trois choix sont cohérents entre eux : l'URL comme source de vérité permet aux Server Components de préfetcher sans état client à synchroniser, et le feature-based colocation garde chaque domaine (cashier, students...) propriétaire de ses propres query keys.

---

## 1. Principes de fond

- **`app/` = routing pur.** Aucune logique métier, aucun fetch de données complexe directement dans un fichier `app/**/page.tsx` au-delà de l'orchestration (prefetch + hydration). La logique vit dans `features/`.
- **`features/` = un dossier par domaine métier**, propriétaire de son API layer, ses query keys, ses composants et ses types. Un dev qui travaille sur la caisse ne touche jamais à `features/students/`.
- **`core/` = cross-cutting, zéro logique métier.** Client API, config du QueryClient, session serveur. Tout ce qui est transverse et ne "sait" rien du domaine.
- **`packages/ui`, `packages/api-client`, `packages/shared`** (monorepo) sont importés, pas dupliqués. `core/api/api-client.ts` ne réimplémente pas de client HTTP — il **configure** `@payskool/api-client` avec les headers spécifiques à cette app (auth, `X-School-Id`).

---

## 2. Arborescence complète

```txt
apps/school/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   └── [schoolId]/
│   │   │       ├── layout.tsx              # Server Component — résout la membership,
│   │   │       │                           # le rôle, rend Sidebar + School Switcher
│   │   │       ├── dashboard/
│   │   │       │   ├── page.tsx            # prefetch + <HydrationBoundary>
│   │   │       │   └── _components/        # UI propre à cette page, non réutilisable
│   │   │       │       ├── metrics-grid.tsx
│   │   │       │       └── live-cash-feed.tsx
│   │   │       ├── students/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [studentId]/
│   │   │       │       └── page.tsx
│   │   │       ├── cashier/
│   │   │       │   └── page.tsx
│   │   │       ├── fee-plans/
│   │   │       │   └── page.tsx
│   │   │       ├── reports/
│   │   │       │   └── page.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   │
│   │   ├── layout.tsx                      # root layout : fonts, <Providers>
│   │   ├── providers.tsx                   # 'use client' — QueryClientProvider
│   │   └── middleware.ts                   # garde-fou grossier (cf. §4.2)
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── api/
│   │   │   │   ├── get-dashboard-metrics.ts    # fetcher safe-pour-RSC
│   │   │   │   └── dashboard.queries.ts        # queryOptions() + queryKeys
│   │   │   ├── components/
│   │   │   │   ├── metric-card.tsx
│   │   │   │   └── recent-payments-table.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── students/
│   │   │   ├── api/
│   │   │   │   ├── students.api.ts
│   │   │   │   └── students.queries.ts
│   │   │   ├── components/
│   │   │   │   ├── student-table.tsx
│   │   │   │   └── student-import-dialog.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-student-import.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── cashier/
│   │   │   ├── api/
│   │   │   │   ├── transactions.api.ts
│   │   │   │   └── transactions.queries.ts     # inclut useCreatePayment (mutation)
│   │   │   ├── components/
│   │   │   │   ├── cash-register-form.tsx
│   │   │   │   └── receipt-preview.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── fee-plans/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   │
│   │   ├── school-switcher/
│   │   │   ├── api/
│   │   │   │   └── get-user-schools.ts
│   │   │   ├── components/
│   │   │   │   └── school-switcher.tsx         # 'use client' — dropdown + router.push
│   │   │   └── school-switcher.queries.ts
│   │   │
│   │   └── auth/
│   │       ├── api/
│   │       │   └── session.ts
│   │       ├── hooks/
│   │       │   └── use-current-user.ts
│   │       └── rbac/
│   │           ├── permissions.ts              # matrice RBAC -> can(role, action)
│   │           └── nav-items.ts                # items de sidebar filtrés par rôle
│   │
│   ├── core/
│   │   ├── api/
│   │   │   ├── api-client.ts               # configure @payskool/api-client (headers)
│   │   │   ├── query-client.ts             # getQueryClient() — cf. §4.3
│   │   │   └── query-keys.ts               # racine partagée des query key factories
│   │   ├── auth/
│   │   │   └── session.server.ts           # lecture cookies() côté serveur
│   │   └── config/
│   │       └── env.ts                      # validation zod des env vars
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx                 # Server Component, reçoit nav-items déjà filtrés
│   │   │   ├── sidebar-nav.tsx
│   │   │   ├── header-bar.tsx
│   │   │   └── command-palette.tsx         # Cmd+K
│   │   └── shared/
│   │       └── currency-badge.tsx          # formatCurrency FCFA
│   │
│   └── lib/
│       └── utils.ts                        # cn(), formatCurrency(), etc.
│
├── public/
├── next.config.ts
├── tailwind.config.ts                      # extends @payskool/config-tailwind
├── tsconfig.json                           # extends @payskool/config-typescript
├── package.json
└── .env.example
```

---

## 3. Qui importe quoi (limites du monorepo)

| Package/app | Rôle | Consommé par |
|---|---|---|
| `packages/ui` | Design system (composants Shadcn de base, tokens Tailwind) | `apps/school`, `apps/parent`, `apps/platform` |
| `packages/api-client` | SDK typé (endpoints + schémas Zod), généré ou écrit à la main | Toutes les apps front |
| `packages/shared` | Types/enums transverses (`Role`, `TransactionStatus`...) | Apps front **et** `apps/api` |
| `packages/db` | Schéma Prisma + client DB | `apps/api` uniquement — **jamais** importé côté front |

`core/api/api-client.ts` dans `apps/school` ne fait qu'instancier `@payskool/api-client` avec les headers runtime de cette app précise — la logique HTTP/Zod reste dans le package partagé.

---

## 4. Points d'architecture critiques

### 4.1 Query keys scopées par école (isolation multi-tenant du cache)

TanStack Query ne connaît pas ton modèle multi-tenant — sans discipline, un cache mal scopé peut afficher les données de l'école A pendant une fraction de seconde après un switch vers l'école B. Chaque query key doit être préfixée par `schoolId` :

```ts
// features/students/api/students.queries.ts
export const studentKeys = {
  all: (schoolId: string) => ["schools", schoolId, "students"] as const,
  list: (schoolId: string, filters: StudentFilters) =>
    [...studentKeys.all(schoolId), "list", filters] as const,
  detail: (schoolId: string, id: string) =>
    [...studentKeys.all(schoolId), "detail", id] as const,
};
```

Avantage : switch d'école = nouvelle branche de cache, zéro risque de fuite cross-tenant, invalidation naturelle par `queryClient.invalidateQueries({ queryKey: studentKeys.all(schoolId) })`.
Inconvénient : une donnée réellement globale au Workspace (rare dans ton scope) demande une clé séparée hors du préfixe école — à documenter dès qu'un cas se présente pour éviter l'incohérence.

### 4.2 Deux niveaux de garde : middleware (grossier) vs layout (fin)

As-tu envisagé l'impact de tout mettre dans le middleware Edge ? Le middleware tourne sur *chaque* navigation, en edge runtime (accès limité, latence sensible) — y vérifier une membership précise par appel API alourdit toute la navigation.

- **`middleware.ts`** : uniquement "session valide ?" → sinon redirect `/login`. Rien de plus.
- **`app/(dashboard)/[schoolId]/layout.tsx`** (Server Component, runtime Node) : résout la membership + le rôle pour *cette* école précise, 404/redirect si absente, puis rend la Sidebar avec les `nav-items` déjà filtrés côté serveur.

C'est aussi la réponse à la préoccupation de surface d'attaque soulevée plus tôt sur le RBAC caissier/admin : puisque le layout est un Server Component, un caissier ne reçoit jamais dans son bundle JS le nom des routes qu'il n'est pas censé voir — le filtrage n'est plus une question de discipline du rendu client.

### 4.3 Le piège du QueryClient singleton en RSC

Sur le web, tu trouveras beaucoup d'exemples avec un `QueryClient` créé une fois au niveau module. **Ne fais pas ça côté serveur** : dans l'App Router, une instance module-level peut être partagée entre requêtes concurrentes de promoteurs différents — fuite de cache entre tenants, pas juste un bug de perf.

```ts
// core/api/query-client.ts
import { cache } from "react";
import { QueryClient } from "@tanstack/react-query";

export const getQueryClient = cache(() => new QueryClient());
// React.cache() garantit une instance par requête serveur, pas un singleton global
```

### 4.4 Injection de `X-School-Id`

Le `schoolId` vient du segment d'URL — donc du `params` de chaque page/layout, jamais d'un store global. Le client API le reçoit explicitement à chaque appel plutôt que de le lire depuis un état ambiant :

```ts
// core/api/api-client.ts
export function getApiClient(schoolId?: string) {
  return createPayskoolClient({
    baseUrl: env.NEXT_PUBLIC_API_URL,
    headers: async () => ({
      Authorization: `Bearer ${await getAccessToken()}`,
      ...(schoolId && { "X-School-Id": schoolId }),
    }),
  });
}
```

### 4.5 School Switcher — pas de state, juste une navigation

Conséquence directe du choix URL : `school-switcher.tsx` n'a besoin d'aucun store. Changer d'école = `router.push(/${newSchoolId}/dashboard)`. Le layout serveur revalide la membership, TanStack Query repart sur des clés préfixées par le nouveau `schoolId` — pas de cache stale à invalider manuellement.

---

## 5. Ouvert / à trancher séparément

- **Provider d'authentification** non figé ici (Auth.js, Clerk, ou JWT custom géré par `apps/api`) — conditionne le contenu réel de `core/auth/session.server.ts`.
- **Génération de `@payskool/api-client`** : écrit à la main vs généré depuis un schéma OpenAPI exposé par `apps/api`. Impacte directement la vitesse à laquelle ce package reste synchronisé avec le backend.
- **Séparation `apps/api` / `apps/workers`** (BullMQ) toujours en dette depuis la discussion précédente — sans lien direct avec cette structure front, mais à garder en tête pour le SLA de `cashier` (paiement en ligne → webhook → notification).