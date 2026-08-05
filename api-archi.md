# Architecture — `apps/api` (Payskool Backend)

Fondation de dossiers/fichiers pour le backend NestJS servant les trois apps front + les workers. Basé sur les 3 décisions actées :

| Décision | Choix |
|---|---|
| Workers BullMQ | Module séparé (`WorkersModule`), même process NestJS |
| Accès aux données | Repository pattern avec interfaces/ports (architecture hexagonale) |
| Contexte tenant | AsyncLocalStorage via `nestjs-cls` |

C'est le module le plus sensible du monorepo : RBAC, isolation multi-tenant, ledger append-only et résilience webhook (BRD §3) y vivent tous. Le choix "repository + ports" pousse naturellement vers une architecture hexagonale par module (Domain / Application / Infrastructure / Presentation) — c'est le fil conducteur de tout ce doc.

---

## 1. Le gabarit de module (montré une fois, appliqué partout)

```txt
modules/<nom-du-module>/
├── domain/
│   ├── entities/                  # objets métier, aucune dépendance NestJS/Prisma
│   └── ports/                     # interfaces (ex: TransactionRepositoryPort) — jamais d'implémentation
├── application/
│   └── *.use-case.ts              # orchestration métier, dépend des ports, jamais de Prisma direct
├── infrastructure/
│   └── prisma-*.repository.ts     # implémente les ports domain/, seul endroit qui parle Prisma
├── presentation/
│   ├── *.controller.ts
│   └── dto/
└── <nom>.module.ts                # wiring : provide { PORT: IMPLEMENTATION }
```

Règle de dépendance stricte : `presentation` → `application` → `domain` ← `infrastructure`. `domain/` ne dépend de rien d'externe — ni Prisma, ni NestJS, ni `nestjs-cls` (cf. §5.1, c'est le piège le plus probable).

---

## 2. Arborescence complète

```txt
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── modules/
│   │   ├── auth/                   # login staff, OTP parent, refresh, sessions
│   │   ├── workspaces/             # Workspace, création, owner
│   │   ├── schools/                # School, memberships, invitations, switch d'école
│   │   ├── students/               # Student, parent_students, import CSV/Excel
│   │   ├── fee-engine/             # fee_structures, fee_installments, student_fee_plans
│   │   ├── ledger/                 # transactions — append-only (cf. §5.4)
│   │   ├── payments/               # initiation paiement + webhooks (cf. §5.3) — structure ci-dessous
│   │   ├── receipts/               # génération PDF + QR
│   │   ├── notifications/          # SMS / WhatsApp, notification_logs
│   │   ├── platform-staff/         # staff interne (cf. doc apps/platform)
│   │   ├── impersonation/          # impersonation_sessions (cf. doc apps/platform)
│   │   ├── audit/                  # lecture agrégée des logs (webhook/notif/impersonation)
│   │   │
│   │   ├── payments/                          # détail — illustre les ports & adapters
│   │   │   ├── domain/
│   │   │   │   └── ports/
│   │   │   │       └── payment-aggregator.port.ts
│   │   │   ├── application/
│   │   │   │   ├── initiate-payment.use-case.ts
│   │   │   │   └── handle-webhook.use-case.ts     # signature + idempotence (BRD §3.5)
│   │   │   ├── infrastructure/
│   │   │   │   ├── adapters/
│   │   │   │   │   ├── paystack.adapter.ts
│   │   │   │   │   ├── flutterwave.adapter.ts
│   │   │   │   │   ├── cinetpay.adapter.ts
│   │   │   │   │   ├── wave.adapter.ts
│   │   │   │   │   ├── orange-money.adapter.ts
│   │   │   │   │   └── mtn-momo.adapter.ts
│   │   │   │   └── prisma-webhook-log.repository.ts
│   │   │   ├── presentation/
│   │   │   │   └── webhooks.controller.ts         # un endpoint par provider
│   │   │   └── payments.module.ts
│   │   │
│   │   └── workers/                            # ne suit PAS le gabarit domain/application/... (cf. §5.5)
│   │       ├── processors/
│   │       │   ├── webhook-processing.processor.ts
│   │       │   ├── notification.processor.ts
│   │       │   ├── receipt-generation.processor.ts
│   │       │   └── reconciliation.processor.ts     # @nestjs/schedule — polling de secours
│   │       ├── queues/
│   │       │   └── queue.constants.ts
│   │       └── workers.module.ts
│   │
│   ├── shared-kernel/
│   │   ├── domain/
│   │   │   └── domain-error.ts                  # base pour les erreurs métier (pas de HttpException ici)
│   │   ├── tenant-context/
│   │   │   ├── tenant-context.module.ts         # global
│   │   │   ├── tenant.middleware.ts             # extrait X-School-Id, valide, remplit le CLS (cf. §5.1)
│   │   │   └── tenant-context.service.ts        # wrapper typé au-dessus de ClsService
│   │   ├── database/
│   │   │   ├── prisma.service.ts
│   │   │   └── tenant-scoped-prisma.ts          # withTenantScope() — SET LOCAL (cf. §5.2)
│   │   ├── guards/
│   │   │   ├── roles.guard.ts
│   │   │   └── platform-staff.guard.ts
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── domain-exception.filter.ts
│   │   └── config/
│   │       └── env.validation.ts                # zod — fail-fast au boot si env invalide
│   │
│   └── (main.ts déjà listé plus haut)
│
├── prisma/
│   └── schema.prisma
├── test/
│   ├── unit/            # domain + application — mocks des ports, zéro DB
│   └── integration/     # infrastructure — Testcontainers PostgreSQL
├── nest-cli.json
├── tsconfig.json
├── package.json
└── .env.example
```

Chaque module de la première liste (`auth/`, `workspaces/`, `schools/`, `students/`, `fee-engine/`, `ledger/`, `receipts/`, `notifications/`, `platform-staff/`, `impersonation/`, `audit/`) suit le gabarit du §1 — je ne les ré-étale pas individuellement pour garder ce doc lisible.

---

## 3. Qui importe quoi

Seule app qui importe réellement `packages/db` (schéma Prisma + client) — les trois apps front ne le touchent jamais. `packages/api-client` **dépend de** `apps/api` (généré depuis son spec OpenAPI, cf. §7), pas l'inverse. `packages/shared` fournit les enums (`Role`, `TransactionStatus`...) utilisés à la fois ici et côté front.

---

## 4. Trade-offs des 3 décisions

| Décision | Avantage | Inconvénient |
|---|---|---|
| Workers dans le même process | Un seul pipeline CI/CD, les processors injectent directement les mêmes repositories/use-cases que l'API HTTP sans dupliquer ni publier de package interne. | Un pic de charge webhook (ex. rentrée scolaire, toutes les écoles encaissent le même jour) partage le CPU/mémoire avec l'API HTTP — pas de scale indépendant sans scaler tout le pod. Migration vers `apps/workers` séparé reste possible plus tard *sans réécrire la logique métier* puisque `WorkersModule` n'a que des `processors/` fins qui appellent les `use-cases` existants. |
| Repository + ports | Tests unitaires du domaine sans DB (mock du port en 3 lignes) ; changer d'ORM ou de DB reste confiné à `infrastructure/`. | Chaque entité coûte un fichier d'interface + une implémentation Prisma + un mapping — plus de boilerplate qu'un `PrismaService` injecté partout. |
| `nestjs-cls` pour le tenant | Aucun `schoolId` trainé en paramètre à travers 4-5 couches d'appel ; réduit le risque d'oubli. | État implicite : un test de service doit désormais fournir un contexte CLS explicite, et une revue de code doit vérifier que CLS ne franchit jamais la frontière vers `domain/` (cf. §5.1). |

---

## 5. Points d'architecture critiques

### 5.1 La frontière CLS ↔ domaine — le piège le plus probable de toute cette architecture

`nestjs-cls` est un outil d'**infrastructure NestJS**. Le domaine ne doit jamais l'importer directement — sinon on recrée exactement le couplage au framework que le repository pattern vient de supprimer côté Prisma. La règle : CLS est lu **une seule fois**, à la frontière (`tenant.middleware.ts` ou un guard), puis transmis comme un paramètre normal aux `use-cases`.

```ts
// shared-kernel/tenant-context/tenant.middleware.ts
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService, private readonly memberships: MembershipsRepositoryPort) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const schoolId = req.header("X-School-Id");
    const membership = schoolId && await this.memberships.findActive(req.user.id, schoolId);
    if (schoolId && !membership) throw new ForbiddenException();
    this.cls.set("schoolId", schoolId ?? null);
    this.cls.set("role", membership?.role ?? null);
    next();
  }
}
```

```ts
// modules/students/presentation/students.controller.ts — la SEULE couche autorisée à lire le CLS
@Get()
list(@TenantSchoolId() schoolId: string) {           // décorateur custom qui lit le CLS
  return this.listStudents.execute({ schoolId });    // schoolId devient un paramètre normal du use-case
}
```

`listStudents.execute()` ne sait pas que `schoolId` vient de CLS — il pourrait tout aussi bien venir d'un test unitaire qui le passe en dur.

### 5.2 RLS avec Prisma — `SET LOCAL` doit vivre dans la même transaction

Prisma pool ses connexions ; un `$executeRaw` isolé n'a aucune garantie de toucher la même connexion que la requête suivante. La policy RLS du BRD (§3.4) n'a d'effet que si `SET LOCAL app.current_school_id` et la requête métier partagent la même transaction :

```ts
// shared-kernel/database/tenant-scoped-prisma.ts
async function withTenantScope<T>(prisma: PrismaClient, schoolId: string, fn: (tx: Prisma.TransactionClient) => Promise<T>) {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SET LOCAL app.current_school_id = ${schoolId}`;
    return fn(tx);
  });
}
```

Chaque repository Prisma appelle ce wrapper plutôt que `this.prisma` directement — coût : chaque requête scoping-école devient une transaction, mesurable sous forte charge mais c'est le prix de la défense en profondeur déjà actée dans le BRD.

### 5.3 Ports & Adapters pour les agrégateurs de paiement

C'est l'endroit où le pattern hexagonal apporte le plus de valeur concrète : six agrégateurs, un seul contrat.

```ts
// modules/payments/domain/ports/payment-aggregator.port.ts
export interface PaymentAggregatorPort {
  initiate(input: { amount: number; reference: string; phone: string }): Promise<{ redirectUrl: string }>;
  verifySignature(payload: unknown, signature: string): boolean;
}
```

`handle-webhook.use-case.ts` dépend uniquement de `PaymentAggregatorPort` — ajouter un 7ᵉ agrégateur n'implique aucune modification de l'`application/`, seulement un nouvel `adapter` + son binding dans `payments.module.ts`.

### 5.4 Le ledger : immutabilité forcée au niveau du type, pas juste par convention

Le BRD (§2.4.1) interdit `UPDATE`/`DELETE` sur `transactions` "au niveau applicatif". Avec le repository pattern, cette règle devient vérifiable à la compilation :

```ts
// modules/ledger/domain/ports/transaction.repository.port.ts
export interface TransactionRepositoryPort {
  create(tx: NewTransaction): Promise<Transaction>;
  reverse(originalId: string, tx: NewTransaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  // pas de update() — un dev ne peut pas "juste" corriger une ligne, même par erreur
}
```

À doubler côté DB : le rôle applicatif Postgres devrait avoir `REVOKE UPDATE, DELETE ON transactions FROM app_role` — troisième ligne de défense après le type et la RLS.

### 5.5 `workers/` casse volontairement le gabarit

Les `processors/` ne sont pas une couche métier — ce sont de fins déclencheurs qui appellent les `use-cases` déjà définis dans `modules/payments/application/`, `modules/notifications/application/`, etc. Un processor ne contient jamais de logique métier propre, seulement : désérialiser le job, appeler le use-case, gérer retry/dead-letter. C'est ce qui permettra une extraction vers `apps/workers` plus tard sans toucher à `application/`.

---

## 6. Notes de scalabilité (courtes — hors scope détaillé de ce doc)

- L'API HTTP est stateless par design (CLS est per-requête, pas d'état partagé entre requêtes) — scale horizontal trivial.
- Chaque queue BullMQ (`webhook-processing`, `notifications`, `receipts`, `reconciliation`) a sa propre concurrency configurable indépendamment.
- Pooling de connexions PostgreSQL (PgBouncer ou équivalent) recommandé dès que `withTenantScope` généralise les transactions par requête (cf. §5.2).
- `@nestjs/terminus` pour les health checks (liveness/readiness) si déploiement conteneurisé.

---

## 7. Ouvert / à trancher séparément

- **Génération OpenAPI** (`@nestjs/swagger`) pour synchroniser automatiquement `packages/api-client` — répond à la question laissée ouverte dans le doc `apps/parent`.
- **Migration `apps/workers`** : chemin de sortie déjà préparé par §5.5 si la charge webhook devient un problème, mais pas déclenché maintenant.
- **RBAC interne `platform_staff`** (`SUPER_ADMIN`, `SUPPORT`, `OPS`) : `roles.guard.ts` existant gère le RBAC client — à confirmer s'il doit être étendu ou dupliqué (`platform-staff.guard.ts` séparé, déjà dans l'arbo) pour ne jamais mélanger les deux matrices.