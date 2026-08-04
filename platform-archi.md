# Architecture — `apps/platform` (Payskool Super Admin)

Fondation de dossiers/fichiers pour l'outil interne de l'équipe Payskool (pas une app client), dans le monorepo Turborepo. Basé sur les 3 décisions actées :

| Décision | Choix |
|---|---|
| Accès SUPER_ADMIN | Table séparée `platform_staff`, découplée de `memberships` |
| Impersonation | Oui — session temporaire signée |
| Navigation | Drill-down hiérarchique : Workspaces → Écoles → détail |

Même socle technique que `school` (Next.js App Router, RSC-first, feature-based) — ces choix ne se re-discutent pas, ils découlent directement de la stack déjà actée. Ce qui change ici, c'est le **modèle d'identité** (staff interne, pas un membre d'école) et une fonctionnalité à haut risque (**impersonation**) qui n'existe nulle part ailleurs dans le système.

---

## 1. Ce que la décision `platform_staff` change concrètement

En sortant `SUPER_ADMIN` de `memberships`, `core/auth/session.server.ts` de cette app ne résout **jamais** une ligne `memberships` — il résout `platform_staff` par `user_id`. Conséquence directe : `api-client.ts` de `platform` **n'envoie pas de `X-School-Id` par défaut**. Ce header n'apparaît que pendant une session d'impersonation active (cf. §5.1) — et dans ce cas précis, ce n'est pas un `X-School-Id` classique mais un jeton distinct signalant explicitement au backend "ceci est une action impersonée", pour ne jamais confondre une requête staff légitime avec une action au nom d'un tenant.

Ce schéma n'existe pas encore dans le DDL du BRD initial — deux tables à ajouter :

```sql
CREATE TABLE platform_staff (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id),
    role        VARCHAR(50) NOT NULL,     -- SUPER_ADMIN, SUPPORT, OPS...
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE impersonation_sessions (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_staff_id  UUID NOT NULL REFERENCES platform_staff(id),
    workspace_id       UUID NOT NULL REFERENCES workspaces(id),
    reason             TEXT NOT NULL,
    started_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at           TIMESTAMPTZ
    -- append-only comme `transactions` : jamais de UPDATE sur started_at/reason,
    -- seule ended_at se remplit à la fin de session
);
```

| Avantage | Inconvénient |
|---|---|
| Sépare nettement le cycle de vie du staff interne (onboarding/offboarding RH, MFA obligatoire imposable sans toucher au modèle client) des utilisateurs clients ; aucune pollution de `memberships` avec des lignes "fantômes". | Un même humain à la fois `OWNER` d'une école test et membre de l'équipe interne (cas de dogfooding) doit avoir deux entrées distinctes (`users` + `platform_staff`) — à documenter si ce cas existe chez vous. |

---

## 2. Arborescence complète

```txt
apps/platform/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                  # Server Component — résout platform_staff + rôle
│   │   │   ├── workspaces/
│   │   │   │   ├── page.tsx                # liste des Workspaces
│   │   │   │   └── [workspaceId]/
│   │   │   │       ├── page.tsx            # détail : écoles, owner, plan
│   │   │   │       └── schools/
│   │   │   │           └── [schoolId]/
│   │   │   │               └── page.tsx    # vue de support d'une école (lecture)
│   │   │   ├── audit-logs/
│   │   │   │   └── page.tsx                # webhook logs + notification logs + impersonations
│   │   │   ├── staff/
│   │   │   │   └── page.tsx                # gestion des comptes platform_staff
│   │   │   ├── billing/
│   │   │   │   └── page.tsx                # cf. §6 — hors scope BRD actuel, à confirmer
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   └── middleware.ts                   # coarse : session platform_staff valide ?
│   │
│   ├── features/
│   │   ├── workspaces/
│   │   │   ├── api/
│   │   │   │   ├── get-workspaces.ts
│   │   │   │   ├── get-workspace.ts
│   │   │   │   └── workspaces.queries.ts
│   │   │   └── components/
│   │   │       ├── workspace-table.tsx
│   │   │       └── workspace-detail-card.tsx
│   │   │
│   │   ├── schools/
│   │   │   ├── api/
│   │   │   │   ├── get-school-support-view.ts   # vue agrégée lecture seule (ledger, membres...)
│   │   │   │   └── schools.queries.ts
│   │   │   └── components/
│   │   │       └── school-support-panel.tsx
│   │   │
│   │   ├── impersonation/
│   │   │   ├── api/
│   │   │   │   ├── start-impersonation.ts       # mutation — crée impersonation_sessions + jeton signé
│   │   │   │   └── end-impersonation.ts
│   │   │   └── components/
│   │   │       ├── impersonate-button.tsx       # exige `reason` avant activation
│   │   │       └── impersonation-banner.tsx     # bandeau persistant, visible tant que la session est active
│   │   │
│   │   ├── audit/
│   │   │   ├── api/
│   │   │   │   ├── get-audit-logs.ts
│   │   │   │   └── audit.queries.ts
│   │   │   └── components/
│   │   │       └── audit-log-table.tsx
│   │   │
│   │   ├── staff/
│   │   │   ├── api/
│   │   │   │   ├── get-platform-staff.ts
│   │   │   │   └── staff.queries.ts
│   │   │   └── components/
│   │   │       └── staff-table.tsx
│   │   │
│   │   └── auth/
│   │       ├── api/
│   │       │   └── session.ts              # résout platform_staff, PAS memberships
│   │       └── rbac/
│   │           └── permissions.ts          # rôles internes (SUPER_ADMIN, SUPPORT, OPS) — cf. §6
│   │
│   ├── core/
│   │   ├── api/
│   │   │   ├── api-client.ts               # pas de X-School-Id par défaut — cf. §1
│   │   │   ├── query-client.ts             # getQueryClient() via React.cache() — même piège que school
│   │   │   └── query-keys.ts
│   │   ├── auth/
│   │   │   └── session.server.ts
│   │   └── config/
│   │       └── env.ts
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── sidebar.tsx
│   │       └── header-bar.tsx
│   │
│   └── lib/
│       └── utils.ts
│
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 3. Qui importe quoi

Identique aux deux autres apps : `packages/ui`, `packages/api-client`, `packages/shared` consommés, jamais dupliqués. `packages/db` reste réservé à `apps/api`.

---

## 4. Navigation : drill-down hiérarchique

Le choix suit le modèle de données existant (`workspaces` → `schools`), donc l'URL en est le reflet direct : `/workspaces/[workspaceId]/schools/[schoolId]`. Même pattern de prefetch que `school` : chaque `page.tsx` fait le `queryClient.prefetchQuery(...)` côté serveur avant de rendre le `<HydrationBoundary>` — rien de nouveau à réinventer ici, la logique du doc `school` s'applique telle quelle (§4.2 et §4.3 de ce doc-là restent valides mot pour mot pour `platform`).

---

## 5. Points d'architecture critiques (spécifiques à `platform`)

### 5.1 Impersonation — la fonctionnalité la plus sensible du système

C'est objectivement le point de plus haut privilège de toute la plateforme : un staff interne obtient un accès équivalent à un `OWNER` sur un Workspace qui n'est pas le sien. Trois garde-fous non négociables :

- **`reason` obligatoire** avant toute activation (`impersonate-button.tsx` bloque sans texte de justification) — traçabilité humaine, pas juste technique.
- **Jeton signé à durée de vie courte**, distinct d'un token de session normal, portant explicitement `impersonated_by` et `workspace_id` — jamais un simple `X-School-Id` réutilisé, pour que le backend puisse auditer chaque requête faite *pendant* l'impersonation sans ambiguïté.
- **`impersonation-banner.tsx` toujours visible** pendant la session empruntée — aucune impersonation silencieuse, y compris pour le staff lui-même (garde-fou anti-erreur autant qu'anti-abus).

`end-impersonation.ts` doit être appelé explicitement (bouton "Quitter l'impersonation") **et** automatiquement à l'expiration du jeton — les deux chemins ferment la session (`ended_at`) pour qu'aucune trace ne reste ouverte indéfiniment.

### 5.2 `audit-logs` : agrégation, pas une nouvelle source de vérité

Cette page ne stocke rien de nouveau — elle lit `payment_webhook_logs`, `notification_logs` et `impersonation_sessions`, trois tables déjà append-only. `get-audit-logs.ts` fait la jointure/union côté API (`apps/api`), `platform` ne fait qu'afficher.

### 5.3 `middleware.ts` : session staff, pas session client

Coarse-check identique dans l'esprit à `school` (session valide ? sinon `/login`), mais la vérification porte sur une session `platform_staff` — un token client (parent ou école) ne doit jamais être accepté ici, même valide par ailleurs. Vaut la peine d'un test d'intégration dédié tant l'enjeu est élevé.

---

## 6. Ouvert / à trancher séparément

- **`impersonation_sessions` et `platform_staff`** ne sont pas dans le DDL du BRD original — à ajouter formellement au schéma avant tout dev, pas seulement dans ce doc.
- **Rôles internes de `platform_staff`** (`SUPER_ADMIN`, `SUPPORT`, `OPS`...) : la matrice RBAC existante ne couvre que les rôles côté client. Une matrice équivalente pour le staff interne (qui peut lancer une impersonation ? qui peut juste consulter l'audit ?) reste à écrire.
- **`billing/`** : la stratégie financière du BRD (§1.5) dit "pure SaaS technologique" sans détailler la gestion des abonnements des Workspaces eux-mêmes (plans, facturation). Le dossier est placé dans l'arbo par anticipation mais son contenu réel n'est pas spécifié — à traiter comme un module séparé le moment venu.