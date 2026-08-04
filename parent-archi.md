# Architecture — `apps/parent` (Payskool PWA)

Fondation de dossiers/fichiers pour la PWA parent (React/Vite), dans le monorepo Turborepo. Basé sur les 3 décisions actées :

| Décision | Choix |
|---|---|
| Routing | TanStack Router (file-based, loaders intégrés à TanStack Query) |
| Offline | TanStack Query persister (IndexedDB) + service worker (vite-plugin-pwa) |
| Session | Access token mémoire + refresh token cookie httpOnly cross-origin |

Contrairement à `apps/school`, il n'y a **ni Server Components ni middleware Edge** — Vite est un runtime 100% client. Le pattern "prefetch avant rendu" qui venait de la RSC côté `school` est ici reproduit par les **loaders TanStack Router**, qui jouent un rôle équivalent côté client.

---

## 1. Un changement de modèle, pas juste de framework

Deux différences structurantes avec `school`, pas seulement techniques :

- **Le parent navigue par enfant, pas par école.** Un même parent peut avoir des enfants dans des écoles différentes, potentiellement dans des Workspaces différents (BRD §2.5.2). Il n'y a donc pas de `[schoolId]` dans l'URL ici — l'unité de navigation est `$studentId`. Le backend résout l'école concernée à partir de l'élève, jamais le client (cf. §5.5).
- **Le nav "Bulletins / Élève" du brief UI contredit le PRD.** Ta section 1.1 exclut explicitement tout système de notes/bulletins. Je traite ce 4ᵉ onglet comme une page **profil administratif de l'élève** (classe, établissement, tuteurs) — pas de notes. À confirmer avant implémentation si tu veux réellement élargir le scope, sinon le nom de l'onglet mérite d'être corrigé côté design pour ne pas promettre une fonctionnalité hors périmètre.

---

## 2. Arborescence complète

```txt
apps/parent/
├── src/
│   ├── routes/                              # TanStack Router — file-based
│   │   ├── __root.tsx                       # providers, <Outlet/>
│   │   ├── login.tsx                        # public — saisie téléphone
│   │   ├── verify-otp.tsx                   # public — saisie code OTP
│   │   │
│   │   ├── _authenticated/                  # layout pathless — beforeLoad = garde de session
│   │   │   ├── route.tsx                    # header bar + bottom nav + <Outlet/>
│   │   │   ├── index.tsx                    # redirect -> premier enfant lié
│   │   │   └── child.$studentId/
│   │   │       ├── route.tsx                # resout l'enfant courant, loader ensureQueryData
│   │   │       ├── index.tsx                # Accueil : hero card + échéancier
│   │   │       ├── receipts.tsx             # Historique / Reçus
│   │   │       ├── profile.tsx              # "Bulletins/Élève" -> infos admin (cf. §1)
│   │   │       └── support.tsx              # deep-link WhatsApp Business
│   │   │
│   │   └── routeTree.gen.ts                 # généré par le plugin — ne jamais éditer à la main
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   ├── request-otp.ts
│   │   │   │   ├── verify-otp.ts
│   │   │   │   └── refresh-session.ts
│   │   │   ├── components/
│   │   │   │   ├── phone-input-form.tsx
│   │   │   │   └── otp-input.tsx
│   │   │   └── token-store.ts               # cf. §5.3
│   │   │
│   │   ├── children/
│   │   │   ├── api/
│   │   │   │   ├── get-children.ts
│   │   │   │   └── children.queries.ts
│   │   │   └── components/
│   │   │       └── child-selector.tsx       # équivalent du school-switcher, mais par enfant
│   │   │
│   │   ├── tuition/
│   │   │   ├── api/
│   │   │   │   ├── get-balance.ts
│   │   │   │   ├── get-installments.ts
│   │   │   │   └── tuition.queries.ts
│   │   │   └── components/
│   │   │       ├── hero-balance-card.tsx
│   │   │       └── installments-timeline.tsx
│   │   │
│   │   ├── payments/
│   │   │   ├── api/
│   │   │   │   ├── initiate-payment.ts
│   │   │   │   ├── get-payment-status.ts
│   │   │   │   └── payments.queries.ts      # useInitiatePayment (mutation) + usePaymentStatus (poll)
│   │   │   └── components/
│   │   │       ├── payment-method-sheet.tsx # Orange / MTN / Wave
│   │   │       └── payment-status-modal.tsx
│   │   │
│   │   └── receipts/
│   │       ├── api/
│   │       │   ├── get-receipts.ts
│   │       │   └── receipts.queries.ts
│   │       └── components/
│   │           └── receipt-list-item.tsx
│   │
│   ├── core/
│   │   ├── api/
│   │   │   ├── api-client.ts                # configure @payskool/api-client (cf. §5.5)
│   │   │   └── query-client.ts              # singleton — cf. §5.2
│   │   ├── persistence/
│   │   │   └── query-persister.ts           # IndexedDB persister (cf. §5.4)
│   │   ├── pwa/
│   │   │   └── register-sw.ts
│   │   └── config/
│   │       └── env.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header-bar.tsx               # logo, child-selector, cloche notif
│   │   │   └── bottom-nav.tsx
│   │   └── shared/
│   │       └── currency-badge.tsx
│   │
│   ├── lib/
│   │   └── utils.ts
│   ├── main.tsx                             # createRoot + RouterProvider + PersistQueryClientProvider
│   └── router.ts                            # createRouter(), déclaration de types globaux
│
├── public/
│   ├── manifest.webmanifest
│   └── icons/
├── vite.config.ts                           # + plugins TanStack Router, vite-plugin-pwa
├── tailwind.config.ts                       # extends @payskool/config-tailwind
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 3. Qui importe quoi

Identique à `apps/school` : `packages/ui`, `packages/api-client`, `packages/shared` sont consommés, jamais dupliqués. `packages/db` reste strictement réservé à `apps/api`.

---

## 4. Points communs avec `apps/school` (le pattern tient)

- **`routes/` = routing + orchestration légère**, comme `app/`. La logique métier reste dans `features/`.
- **`core/` = cross-cutting**, comme côté `school`.
- **Query keys scopées** — ici par `studentId` plutôt que par `schoolId` :
  ```ts
  export const tuitionKeys = {
    all: (studentId: string) => ["students", studentId, "tuition"] as const,
    installments: (studentId: string) => [...tuitionKeys.all(studentId), "installments"] as const,
  };
  ```

---

## 5. Points d'architecture critiques (spécifiques à `parent`)

### 5.1 Loaders TanStack Router = équivalent client du prefetch RSC

```ts
// routes/_authenticated/child.$studentId/route.tsx
export const Route = createFileRoute("/_authenticated/child/$studentId")({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(tuitionKeys.installments(params.studentId)),
  component: ChildLayout,
});
```
Le loader s'exécute avant le rendu du composant — la donnée est déjà en cache quand l'écran s'affiche, même logique de "pas de waterfall visible" que le prefetch RSC côté `school`, mais entièrement côté client.

### 5.2 QueryClient : ici, un vrai singleton (contraste volontaire avec `school`)

Le piège signalé côté `school` (§4.3 de son doc) concernait un environnement serveur multi-requêtes. Ici, Vite est un runtime client par utilisateur — un singleton module-level est **correct et voulu** :
```ts
// core/api/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});
```

### 5.3 Token store : pourquoi hors de l'arbre React

Le client API (`api-client.ts`) a besoin de lire l'access token pour chaque requête, y compris en dehors de tout rendu React (intercepteur fetch). Un `useState`/Context ne convient pas pour ça — `token-store.ts` est un module simple avec un getter/setter, mis à jour par `verify-otp.ts` et relu par `refresh-session.ts` :
```ts
// features/auth/token-store.ts
let accessToken: string | null = null;
export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => { accessToken = token; },
};
```
Le refresh token, lui, ne transite jamais par ce store — il vit uniquement dans le cookie httpOnly, invisible au JS. `apps/api` doit répondre avec `Set-Cookie: SameSite=None; Secure` et la route `refresh-session.ts` appelle `fetch(..., { credentials: "include" })`.

### 5.4 Persistance offline — prudence sur les mutations

La persistance IndexedDB couvre naturellement les *queries* (échéancier, reçus, liste d'enfants consultables hors ligne). Pour les *mutations* (paiement), TanStack Query propose de mettre en pause puis de rejouer automatiquement au retour réseau (`resumePausedMutations`) — **à éviter ici**. Même si `reference_code` garantit l'idempotence côté serveur (BRD §3.5.2), un paiement qui repart tout seul en arrière-plan après une coupure réseau est mauvais pour la confiance perçue. Mieux vaut désactiver le resume automatique sur `payments.mutations` et afficher explicitement "Le paiement n'a pas abouti, réessayer" au retour en ligne.

### 5.5 Pas de `X-School-Id` côté client

Contrairement à `school`, l'API client de `parent` n'a jamais besoin d'envoyer un identifiant d'école — le lien `parent_students` permet au backend de résoudre l'école à partir du `studentId` de chaque requête. C'est cohérent avec le principe "le parent n'a jamais conscience du multi-tenant" : l'app n'a même pas l'information à transmettre.

---

## 6. Ouvert / à trancher séparément

- **Notifications push** (la cloche avec pastille rouge du header) : nécessite Web Push + permission navigateur, hors scope de cette structure — à specer avec le module de communication du BRD (§2.6).
- **Adaptateurs par opérateur Mobile Money** (Orange / MTN / Wave) : chaque deep-link/USSD a probablement un format différent — `features/payments/` gagnera sans doute un sous-dossier `operators/` avec un adapter par opérateur une fois les intégrations connues.
- **Contenu réel de `profile.tsx`** : à valider avec toi que "Bulletins/Élève" devient bien un profil administratif (cf. §1), pas des notes.