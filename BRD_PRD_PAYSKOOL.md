# PAYSKOOL — Cahier des Charges Fonctionnel & Technique (BRD / PRD)

**Plateforme SaaS de PayTech Éducative — Recouvrement de la Scolarité**
**Marché cible : Afrique Subsaharienne Francophone & Anglophone**

> Version 1.0 — Juillet 2026

---

## Table des Matières

1. [Contexte & Vision](#1-contexte--vision)
2. [Glossaire](#2-glossaire)
3. [Spécifications Fonctionnelles](#3-spécifications-fonctionnelles)
   - 3.1 Gestion des Workspaces & Multi-tenancy
   - 3.2 Gestion Administrative Minimale
   - 3.3 Moteur d'Échéanciers & Tarification (Fee Engine)
   - 3.4 Gestion des Caisses & Paiements (Ledger Immuable)
   - 3.5 Portail Parent (Zero-Friction)
   - 3.6 Module de Communication & Notifications
4. [Spécifications Techniques & Architecture](#4-spécifications-techniques--architecture)
   - 4.1 Architecture Globale & Topologie
   - 4.2 Modèle de Données Relationnel (DDL PostgreSQL)
   - 4.3 Matrice de Sécurité & Droits (RBAC)
   - 4.4 Stratégie d'Isolation Multi-tenant (RLS)
   - 4.5 Fiabilité des Transactions Financières (Resilience Patterns)
5. [Module de Financement & Scoring (Financial Enablement)](#5-module-de-financement--scoring-financial-enablement)
6. [Workflow d'Avance de Trésorerie (Spécifications Métier)](#6-workflow-davance-de-trésorerie-spécifications-métier)
7. [Impact sur le Schéma de Données (Prisma Schema Data Models)](#7-impact-sur-le-schéma-de-données-prisma-schema-data-models)
8. [Matrice des Rôles & Permissions (RBAC) - Financement](#8-matrice-des-rôles--permissions-rbac---financement)
9. [Annexes](#9-annexes)

---

## 1. Contexte & Vision

### 1.1 Nature du Produit

PAYSKOOL est un **SaaS PayTech/Fintech vertical** dédié exclusivement au :

- **Suivi financier** des élèves (maternelle → terminale)
- **Recouvrement automatisé** des frais de scolarité
- **Gestion des caisses** (cash, chèque, Mobile Money)
- **Transparence financière** pour les promoteurs et les parents

> [!IMPORTANT]
> PAYSKOOL n'est **PAS** un ERP scolaire. Il ne gère ni les bulletins, ni les notes, ni les emplois du temps. Son périmètre est strictement financier.

### 1.2 Problèmes Adressés

| Problème | Impact | Solution PAYSKOOL |
|---|---|---|
| Suivi des paiements sur registres papier | Pertes, erreurs, fraudes | Ledger numérique immuable (append-only) |
| Impayés non détectés avant fin d'année | Trésorerie défaillante | Alertes automatiques + échéanciers configurables |
| Fraude de caisse (détournement) | Perte financière directe | Chaque transaction est signée, horodatée, non modifiable |
| Parents sans visibilité | Conflits, double paiement | Portail parent mobile-first avec historique temps réel |
| Collecte Mobile Money manuelle | Lent, pas de réconciliation | Intégration directe Paystack/Flutterwave/CinetPay/Wave |

### 1.3 Topologie des Applications

```
┌─────────────────────────────────────────────────────────────┐
│                      PAYSKOOL PLATFORM                         │
├──────────────────┬──────────────────┬───────────────────────┤
│  Dashboard Web   │  App Caissier    │  Portail Parent       │
│  Admin/Promoteur │  (Web/Mobile)    │  PWA Mobile-First     │
│  ─────────────── │  ─────────────── │  ───────────────────  │
│  • Vue globale   │  • Saisie rapide │  • Auth OTP           │
│  • Config tarifs │  • Encaissement  │  • Vue multi-enfants  │
│  • Analytics     │  • Reçus PDF     │  • Paiement 1-click   │
│  • RBAC          │  • Hors-ligne    │  • Historique/Reçus   │
│  • Import CSV    │    (cache)       │  • Notifications      │
└──────────────────┴──────────────────┴───────────────────────┘
                            │
                    ┌───────┴────────┐
                    │  API REST/JSON │
                    │  + WebSockets  │
                    └───────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        ┌─────┴─────┐ ┌────┴────┐ ┌──────┴──────┐
        │ PostgreSQL │ │  Redis  │ │   Workers   │
        │  (Data)    │ │ (Queue) │ │  (BullMQ)   │
        └────────────┘ └─────────┘ └─────────────┘
```

### 1.4 Stratégie Financière

PAYSKOOL opère comme **pure SaaS technologique** :

- ❌ Aucune collecte de fonds pour compte de tiers
- ❌ Aucun transit de fonds via la plateforme
- ✅ Les écoles configurent leurs **propres clés API** d'agrégateurs
- ✅ Les fonds vont **directement** sur le compte marchand de l'école
- ✅ PAYSKOOL se rémunère par **abonnement mensuel** (SaaS fee)

**Agrégateurs supportés (V1) :**

| Agrégateur | Couverture Géographique | Canaux |
|---|---|---|
| Paystack | Nigeria, Ghana, Afrique du Sud, Kenya | Cards, Bank Transfer, Mobile Money |
| Flutterwave | 34+ pays africains | Cards, Mobile Money, Bank Transfer |
| CinetPay | Côte d'Ivoire, Sénégal, Cameroun, Togo, Bénin, Mali, Burkina, RDC | Mobile Money, Cards |
| Wave | Sénégal, Côte d'Ivoire, Mali, Burkina, Gambie, Ouganda | Wallet-to-Wallet |
| Orange Money API | Côte d'Ivoire, Sénégal, Cameroun, Mali, Burkina, Guinée | USSD / API |
| MTN MoMo API | Cameroun, Côte d'Ivoire, Ghana, Ouganda, Rwanda, Bénin, RDC | USSD / API |

---

## 2. Glossaire

| Terme | Définition |
|---|---|
| **Workspace** | Conteneur logique regroupant un ou plusieurs établissements scolaires, détenu par un Promoteur |
| **Promoteur (Owner)** | Personne physique ou morale propriétaire d'un ou plusieurs établissements |
| **Établissement (School)** | Entité scolaire individuelle (un campus, une école) au sein d'un Workspace |
| **Fee Structure** | Grille tarifaire annuelle par niveau/classe (ex : 6e = 250 000 FCFA) |
| **Fee Installment** | Tranche de paiement définie dans une Fee Structure (ex : Tranche 1 — Inscription — 75 000 FCFA — Échéance 15 Oct) |
| **Student Fee Plan** | Instance personnalisée d'une Fee Structure pour un élève donné (peut inclure bourses/réductions) |
| **Transaction** | Enregistrement immuable d'un mouvement financier (paiement ou avoir) |
| **Ledger** | Registre append-only de toutes les transactions — aucun UPDATE, aucun DELETE |
| **RLS** | Row-Level Security — politique PostgreSQL filtrant les lignes par `school_id` |
| **Idempotence** | Garantie qu'une même opération exécutée N fois produit le même résultat (critique pour les Webhooks) |
| **OTP** | One-Time Password — code à usage unique envoyé par SMS/WhatsApp |
| **PWA** | Progressive Web App — application web installable sur mobile |

---

## 3. Spécifications Fonctionnelles

### 3.1 Gestion des Workspaces & Multi-tenancy

#### 3.1.1 Inscription Promoteur & Création du Workspace

**Flux d'inscription :**

```
[Promoteur] ──► Formulaire d'inscription
                 │
                 ├─ Nom, Prénom, Email, Téléphone
                 ├─ Mot de passe (min 8 chars, 1 majuscule, 1 chiffre)
                 └─ Nom du Workspace (ex: "Groupe Scolaire Excellence")
                 │
                 ▼
              Vérification Email (lien magic link)
                 │
                 ▼
              Workspace créé (statut: TRIAL)
                 │
                 ▼
              Onboarding Wizard
                 ├─ Étape 1: Créer le 1er établissement
                 ├─ Étape 2: Configurer l'année scolaire
                 ├─ Étape 3: Importer ou créer les élèves
                 └─ Étape 4: Configurer la grille tarifaire
```

**Règles métier :**

- Un Promoteur peut créer **1 Workspace** gratuitement (plan Trial — 30 jours, 1 école, 50 élèves max).
- Un Workspace possède un `slug` unique (ex: `excellence-group`) utilisé dans l'URL : `app.payskool.africa/excellence-group`.
- Le Promoteur reçoit automatiquement le rôle `OWNER` sur son Workspace.

#### 3.1.2 Gestion des Établissements (Schools)

Chaque école au sein d'un Workspace possède :

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `name` | `VARCHAR(255)` | ✅ | Nom de l'établissement |
| `slug` | `VARCHAR(100)` | ✅ | Identifiant URL-friendly (unique dans le Workspace) |
| `type` | `ENUM` | ✅ | `MATERNELLE`, `PRIMAIRE`, `SECONDAIRE`, `COMPLEXE` |
| `address` | `TEXT` | ❌ | Adresse physique |
| `city` | `VARCHAR(100)` | ✅ | Ville |
| `country_code` | `CHAR(2)` | ✅ | Code ISO 3166-1 (ex : `CI`, `SN`, `CM`) |
| `currency` | `CHAR(3)` | ✅ | Devise ISO 4217 (ex : `XOF`, `XAF`, `NGN`) |
| `phone` | `VARCHAR(20)` | ❌ | Téléphone principal |
| `logo_url` | `TEXT` | ❌ | URL du logo (stocké sur S3/Cloudflare R2) |
| `academic_year` | `VARCHAR(9)` | ✅ | Année scolaire active (ex : `2026-2027`) |
| `timezone` | `VARCHAR(50)` | ✅ | Fuseau horaire (ex : `Africa/Abidjan`) |
| `payment_config` | `JSONB` | ❌ | Clés API agrégateurs (chiffrées at-rest) |
| `status` | `ENUM` | ✅ | `ACTIVE`, `SUSPENDED`, `ARCHIVED` |

**Règles métier :**

- Le `payment_config` est un objet JSONB chiffré via AES-256-GCM avant stockage. Structure :
  ```json
  {
    "provider": "cinetpay",
    "api_key": "enc:xxxx",
    "site_id": "enc:xxxx",
    "secret_key": "enc:xxxx",
    "webhook_secret": "enc:xxxx",
    "mode": "live"
  }
  ```
- Le switching d'école se fait via le header HTTP `X-School-Id` (UUID) envoyé à chaque requête API.
- Le backend valide que l'utilisateur authentifié a bien un `membership` actif pour le `school_id` demandé.

#### 3.1.3 Invitations & Gestion des Membres

**Flux d'invitation :**

```
[Owner/Admin] ──► Formulaire d'invitation
                   │
                   ├─ Email ou Téléphone du destinataire
                   ├─ Rôle assigné: SCHOOL_ADMIN ou CASHIER
                   └─ École(s) concernée(s)
                   │
                   ▼
                Envoi invitation (Email + SMS)
                   │
                   ▼
                [Invité] clique le lien ──► Création de compte
                   │
                   ▼
                Membership créé (statut: ACTIVE)
```

**Rôles disponibles :**

| Rôle | Scope | Description |
|---|---|---|
| `SUPER_ADMIN` | Plateforme | Administrateur PAYSKOOL (support, billing) |
| `OWNER` | Workspace | Promoteur — accès total à toutes les écoles du Workspace |
| `SCHOOL_ADMIN` | École | Administrateur d'une école — config, rapports, gestion utilisateurs |
| `CASHIER` | École | Caissier — saisie des paiements cash uniquement |
| `PARENT` | Cross-school | Parent — vue lecture seule sur ses enfants |

**Règles métier :**

- Un utilisateur peut avoir **différents rôles dans différentes écoles** (ex : `SCHOOL_ADMIN` dans École A et `CASHIER` dans École B).
- Un `OWNER` a implicitement les droits `SCHOOL_ADMIN` sur toutes les écoles de son Workspace.
- Un `CASHIER` ne peut voir que les élèves et les transactions de l'école à laquelle il est affecté.
- Un `PARENT` est lié à ses enfants via la table `parent_students` et peut voir tous ses enfants, même s'ils sont dans des écoles différentes (cross-workspace possible si invité).

---

### 3.2 Gestion Administrative Minimale

#### 3.2.1 Modèle Élève (Student)

> [!NOTE]
> Le modèle élève est volontairement minimal : il ne contient que les données nécessaires à l'identification financière. Aucune donnée pédagogique (notes, bulletins, absences).

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `matricule` | `VARCHAR(50)` | ✅ | Matricule interne (unique par école) |
| `first_name` | `VARCHAR(100)` | ✅ | Prénom |
| `last_name` | `VARCHAR(100)` | ✅ | Nom de famille |
| `gender` | `ENUM` | ❌ | `M`, `F` |
| `date_of_birth` | `DATE` | ❌ | Date de naissance |
| `class_level` | `VARCHAR(50)` | ✅ | Niveau/Classe (ex : `6ème A`, `CM2`, `Terminale D`) |
| `academic_year` | `VARCHAR(9)` | ✅ | Année scolaire d'inscription |
| `status` | `ENUM` | ✅ | `ENROLLED`, `TRANSFERRED`, `GRADUATED`, `EXPELLED` |
| `previous_balance` | `BIGINT` | ✅ (défaut 0) | Solde antérieur en centimes (arriéré < 0, avance > 0) |
| `photo_url` | `TEXT` | ❌ | Photo de l'élève |

**Règles métier :**

- `previous_balance` permet la reprise d'historique lors d'une migration. Un solde négatif signifie un arriéré de l'année précédente. Un solde positif signifie une avance.
- Le matricule est unique par couple `(school_id, academic_year)`.
- Un élève peut être lié à **plusieurs tuteurs/parents** via `parent_students`.

#### 3.2.2 Module d'Importation Excel/CSV

**Workflow d'import :**

```
[Admin] ──► Upload fichier (.xlsx ou .csv)
              │
              ▼
           Parsing & Détection des colonnes
              │
              ▼
           Écran de Mapping Dynamique
           ┌────────────────────────────────────┐
           │  Colonne Fichier  →  Champ PAYSKOOL   │
           │  ─────────────────────────────────  │
           │  "Nom"            →  last_name      │
           │  "Prenom"         →  first_name     │
           │  "Classe"         →  class_level    │
           │  "N° Matricule"   →  matricule      │
           │  "Montant Payé"   →  previous_bal.  │
           │  "Tel Parent"     →  parent_phone   │
           └────────────────────────────────────┘
              │
              ▼
           Prévisualisation (20 premières lignes)
           + Rapport de validation
           ┌────────────────────────────────────┐
           │  ✅ 245 lignes valides              │
           │  ⚠️  3 doublons détectés (matricule)│
           │  ❌ 2 lignes sans nom               │
           └────────────────────────────────────┘
              │
              ▼
           Confirmation ──► Import en batch (transaction DB)
              │
              ▼
           Rapport final (téléchargeable)
```

**Règles métier :**

- L'import est **transactionnel** : soit toutes les lignes valides passent, soit aucune (avec option « ignorer les erreurs »).
- Les doublons sont détectés par le couple `(matricule, school_id)`. En cas de doublon, l'admin choisit : `IGNORER`, `ÉCRASER`, `FUSIONNER`.
- Le mapping de colonnes est **sauvegardé** par école pour les imports suivants.
- Formats supportés : `.xlsx` (OpenXML), `.csv` (UTF-8, séparateur `;` ou `,` auto-détecté).
- Taille maximale : 10 000 lignes par import, fichier ≤ 5 Mo.
- L'import crée automatiquement les liens `parent_students` si un numéro de téléphone parent est fourni.

---

### 3.3 Moteur d'Échéanciers & Tarification (Fee Engine)

#### 3.3.1 Fee Structure (Grille Tarifaire)

Une `Fee Structure` définit les frais annuels pour un niveau/classe donné.

**Exemple :**

```
Fee Structure: "Frais de Scolarité 6ème — 2026-2027"
├── Niveau: 6ème
├── Montant Total: 350 000 XOF
├── Tranches:
│   ├── Tranche 1 — Inscription — 100 000 XOF — Échéance: 15 Sep 2026
│   ├── Tranche 2 — 1er Trimestre — 125 000 XOF — Échéance: 15 Nov 2026
│   └── Tranche 3 — 2ème Trimestre — 125 000 XOF — Échéance: 15 Fév 2027
└── Frais annexes:
    ├── Tenue scolaire — 25 000 XOF — Échéance: 15 Sep 2026
    └── Transport — 15 000 XOF/mois — Récurrent (10 mois)
```

**Règles métier :**

- Une école peut avoir **plusieurs Fee Structures** actives (une par niveau, ou par filière).
- Les tranches (`fee_installments`) ont chacune une date d'échéance. Au-delà de cette date, la tranche est considérée en retard.
- Les frais peuvent être de type `ONE_TIME` (inscription, tenue) ou `RECURRING` (transport, cantine).
- Le montant total d'une Fee Structure est la **somme de toutes ses tranches** — le système valide la cohérence.
- Une Fee Structure peut être **clonée** d'une année sur l'autre avec ajustement des montants et dates.

#### 3.3.2 Student Fee Plan (Plan Personnalisé)

Un `Student Fee Plan` est l'**instance** d'une Fee Structure appliquée à un élève spécifique. Il permet les ajustements individuels.

**Cas d'usage :**

| Scénario | Mécanisme |
|---|---|
| Élève boursier (50%) | `discount_type: PERCENTAGE`, `discount_value: 50` |
| Fratrie (2ème enfant -10%) | `discount_type: PERCENTAGE`, `discount_value: 10` |
| Réduction fixe (partenariat) | `discount_type: FIXED`, `discount_value: 50000` |
| Exonération totale | `discount_type: PERCENTAGE`, `discount_value: 100` |
| Frais supplémentaire (redoublant) | Ajout d'un `fee_installment` spécifique |

**Workflow :**

```
[Fee Structure créée pour "6ème"]
         │
         ▼
[Admin] clique "Appliquer aux élèves de 6ème"
         │
         ▼
Génération automatique de StudentFeePlan pour chaque élève de 6ème
         │
         ▼
[Admin] peut ensuite ajuster individuellement
(bourse, réduction, exemption)
```

**Règles métier :**

- Lors de la création d'un `StudentFeePlan`, le `previous_balance` de l'élève est automatiquement intégré :
  - Si `previous_balance < 0` (arriéré) → ajouté comme tranche "Arriéré année précédente" en première position.
  - Si `previous_balance > 0` (avance) → crédité comme paiement anticipé.
- Le montant dû d'un `StudentFeePlan` = `Σ tranches` − `réductions` − `Σ paiements effectués`.
- Un `StudentFeePlan` ne peut pas être supprimé s'il a des transactions liées. Il peut être `CANCELLED` (soft delete).

#### 3.3.3 Calcul du Solde Élève

```
solde_total_dû = Σ(installments.amount) - discount_amount + previous_balance_négatif
solde_payé     = Σ(transactions.amount WHERE status = 'CONFIRMED')
solde_restant  = solde_total_dû - solde_payé
```

**Statuts dérivés :**

| Statut | Condition |
|---|---|
| `FULLY_PAID` | `solde_restant == 0` |
| `OVERPAID` | `solde_restant < 0` (trop-perçu) |
| `PARTIALLY_PAID` | `0 < solde_payé < solde_total_dû` |
| `UNPAID` | `solde_payé == 0` |
| `OVERDUE` | `solde_restant > 0` ET au moins une tranche a dépassé sa date d'échéance |

---

### 3.4 Gestion des Caisses & Paiements (Ledger Immuable)

#### 3.4.1 Principes Fondamentaux du Ledger

> [!CAUTION]
> Le Ledger est la pièce maîtresse du système. Toute compromission de son intégrité invalide la confiance dans la plateforme. Les règles suivantes sont **non négociables**.

| Règle | Détail |
|---|---|
| **Append-only** | Les transactions sont uniquement `INSERT`. Aucun `UPDATE` ni `DELETE` n'est autorisé sur la table `transactions`. |
| **Immuabilité** | Un enregistrement de transaction ne peut jamais être modifié après création. |
| **Correction par contre-écriture** | Pour annuler un paiement erroné, on crée une transaction de type `REVERSAL` (montant négatif) avec `reference` pointant vers la transaction originale. |
| **Audit Trail** | Chaque transaction enregistre : `created_by` (user_id), `created_at` (timestamp UTC), `ip_address`, `user_agent`. |
| **Double-entry ready** | Chaque transaction possède un `reference_code` unique et un `idempotency_key` pour prévenir les doublons. |

#### 3.4.2 Saisie Caisse (Cash / Chèque)

**Flux Caissier :**

```
[Caissier] ──► Recherche élève (par matricule, nom, ou scan QR)
                │
                ▼
             Affichage du solde et des tranches
                │
                ▼
             Saisie du montant reçu
             + Sélection du mode: CASH ou CHEQUE
             + (Si chèque: n° chèque, banque, date)
                │
                ▼
             Confirmation (double validation)
             "Confirmez l'encaissement de 75 000 XOF
              en ESPÈCES pour KONÉ Aminata (6ème A)"
                │
                ▼
             Transaction créée (statut: CONFIRMED)
                │
                ▼
             Allocation automatique aux tranches
             (FIFO: la tranche la plus ancienne d'abord)
                │
                ▼
             Génération du reçu PDF
                │
                ▼
             Notification parent (WhatsApp/SMS)
```

**Allocation FIFO :**

Quand un paiement est reçu, il est alloué automatiquement aux tranches dans l'ordre chronologique :

```
Exemple: Élève doit 3 tranches
├── Tranche 1: 100 000 XOF (échéance passée) — Reste dû: 50 000
├── Tranche 2: 125 000 XOF (échéance passée) — Reste dû: 125 000
└── Tranche 3: 125 000 XOF (future)           — Reste dû: 125 000

Paiement reçu: 200 000 XOF

Allocation:
├── 50 000 → Tranche 1 (solde: 0 ✅ — PAID)
├── 125 000 → Tranche 2 (solde: 0 ✅ — PAID)
└── 25 000 → Tranche 3 (solde: 100 000 — PARTIAL)
```

La table `transaction_allocations` stocke le détail de chaque ventilation :

| `transaction_id` | `installment_id` | `amount` |
|---|---|---|
| `txn_abc123` | `inst_001` | `50 000` |
| `txn_abc123` | `inst_002` | `125 000` |
| `txn_abc123` | `inst_003` | `25 000` |

#### 3.4.3 Paiement en Ligne Parent (Mobile Money)

**Flux de Paiement Online :**

```
[Parent] ──► Portail Parent → Sélectionne enfant
              │
              ▼
           Affiche solde + tranches dues
              │
              ▼
           Clique "Payer" (montant libre ou tranche spécifique)
              │
              ▼
           Sélection du moyen de paiement
           (Orange Money, MTN MoMo, Wave, Carte)
              │
              ▼
           [Backend] Crée une transaction (statut: PENDING)
           + Génère un `reference_code` unique
           + Appel API agrégateur (initialize payment)
              │
              ▼
           [Agrégateur] Redirect ou USSD push
              │
              ▼
           [Parent] Confirme sur son téléphone
              │
              ▼
           [Agrégateur] ──► Webhook POST /api/webhooks/{provider}
              │
              ▼
           [Backend] Vérifie signature + idempotence
              │
              ▼
           Transaction mise à jour: PENDING → CONFIRMED
              │
              ▼
           Allocation FIFO + Reçu PDF + Notification
```

**Mécanisme de Polling de Secours :**

En cas de Webhook manqué (réseau, downtime), un **worker CRON** poll les transactions `PENDING` âgées de plus de 5 minutes :

```
[Worker CRON] toutes les 2 minutes
     │
     ▼
  SELECT * FROM transactions
  WHERE status = 'PENDING'
    AND channel = 'ONLINE'
    AND created_at < NOW() - INTERVAL '5 minutes'
    AND polling_attempts < 5
     │
     ▼
  Pour chaque transaction:
     GET /api/aggregator/verify/{reference_code}
     │
     ├─ Si SUCCESS → Confirmer la transaction
     ├─ Si FAILED  → Marquer FAILED
     └─ Si PENDING → Incrémenter polling_attempts
```

#### 3.4.4 Génération de Reçus PDF

Chaque transaction `CONFIRMED` génère automatiquement un reçu PDF contenant :

| Élément | Détail |
|---|---|
| En-tête | Logo école, nom, adresse, téléphone |
| Numéro de reçu | Format : `REC-{SCHOOL_SLUG}-{YYYYMMDD}-{SEQ}` |
| Élève | Nom complet, matricule, classe |
| Montant | En chiffres et en lettres |
| Mode de paiement | Cash, Chèque (n°), Mobile Money (opérateur) |
| Date & Heure | Horodatage UTC converti en timezone locale |
| Caissier | Nom du caissier (si paiement cash) |
| QR Code | Contient l'URL de vérification : `https://app.payskool.africa/verify/{receipt_id}` |
| Détail allocation | Ventilation par tranche |

Le QR Code permet à quiconque de **vérifier l'authenticité** du reçu en scannant — la page de vérification affiche les mêmes informations et confirme la validité.

---

### 3.5 Portail Parent (Zero-Friction Onboarding)

#### 3.5.1 Authentification Passwordless

> [!TIP]
> Le choix du Passwordless (OTP) est critique pour le marché africain : beaucoup de parents n'ont pas d'email, utilisent des smartphones basiques, et oublient facilement les mots de passe.

**Flux d'authentification :**

```
[Parent] ──► Page de connexion
              │
              ▼
           Saisie du numéro de téléphone
           (format international: +225 07 XX XX XX XX)
              │
              ▼
           [Backend] Génère un OTP à 6 chiffres
           + Stocke dans Redis (TTL: 5 minutes)
           + Envoie via SMS ou WhatsApp
              │
              ▼
           [Parent] Saisit le code OTP
              │
              ▼
           [Backend] Vérifie l'OTP
           + Crée/retrouve le compte parent
           + Génère un JWT (access_token: 15min, refresh_token: 30j)
              │
              ▼
           Redirigé vers le Dashboard Parent
```

**Règles métier :**

- Le numéro de téléphone est l'**identifiant unique** du parent.
- Maximum **3 tentatives OTP** par session. Après 3 échecs → blocage 15 minutes.
- Maximum **5 envois OTP** par numéro par heure (anti-spam / anti-coût).
- Le lien parent ↔ enfant est pré-configuré par l'école (via import ou saisie manuelle). Le parent ne peut pas s'auto-ajouter un enfant.
- Premier login : le parent voit automatiquement ses enfants (pré-liés par l'école).

#### 3.5.2 Vue Consolidée Multi-Enfants

```
┌─────────────────────────────────────────────────┐
│  Bonjour, Mme KOUASSI 👋                        │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  👦 KOUASSI Yao — 6ème A                │    │
│  │  📍 Groupe Scolaire Excellence          │    │
│  │  💰 Solde: 125 000 XOF restant          │    │
│  │  ⚠️ Tranche 2 en retard (15 Nov)        │    │
│  │  [Voir détails]  [Payer maintenant]     │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  👧 KOUASSI Ama — CM2                   │    │
│  │  📍 École Primaire Les Étoiles          │    │
│  │  💰 Solde: 0 XOF ✅ À jour             │    │
│  │  [Voir détails]                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Historique des paiements                       │
│  ├─ 25 Oct 2026 — 100 000 XOF — Cash ✅        │
│  ├─ 15 Sep 2026 — 75 000 XOF — Wave ✅         │
│  └─ 10 Sep 2026 — 50 000 XOF — Orange Money ✅ │
│                                                 │
│  📄 Télécharger tous les reçus                  │
└─────────────────────────────────────────────────┘
```

**Fonctionnalités :**

- Vue cross-school : les enfants peuvent être dans des écoles différentes.
- Paiement direct via deep-link Mobile Money (1-click).
- Historique chronologique de tous les paiements (tous enfants confondus).
- Téléchargement des reçus PDF.
- Notifications push (si PWA installée).

#### 3.5.3 Paiement 1-Click via Deep-Link Mobile Money

Pour les opérateurs supportant les deep-links USSD ou les app-links :

```
[Parent clique "Payer 75 000 XOF via Wave"]
         │
         ▼
     Backend génère le lien de paiement
     (ex: Wave checkout URL)
         │
         ▼
     Redirect vers l'app Wave / Orange Money
         │
         ▼
     Parent confirme avec son PIN
         │
         ▼
     Webhook reçu → Transaction confirmée
         │
         ▼
     Parent redirigé vers PAYSKOOL avec confirmation
```

---

### 3.6 Module de Communication & Notifications

#### 3.6.1 Types de Notifications

| Type | Déclencheur | Canal | Destinataire |
|---|---|---|---|
| **Reçu de paiement** | Transaction `CONFIRMED` | WhatsApp + SMS | Parent(s) de l'élève |
| **Relance d'impayé (J+1)** | Tranche échue, non payée | SMS | Parent(s) |
| **Relance d'impayé (J+7)** | Tranche échue depuis 7j | WhatsApp | Parent(s) |
| **Relance d'impayé (J+30)** | Tranche échue depuis 30j | WhatsApp + SMS | Parent(s) |
| **Rappel avant échéance** | 3 jours avant une échéance | WhatsApp | Parent(s) |
| **Confirmation d'inscription** | Élève créé | SMS | Parent(s) |
| **Rapport quotidien** | Fin de journée (18h locale) | Email | Owner, School Admin |
| **Alerte anomalie** | Montant inhabituel, multi-paiement même jour | Email + Dashboard | Owner, School Admin |

#### 3.6.2 Templates de Messages

**Relance WhatsApp (J+7) :**

```
Bonjour {parent_name},

Ceci est un rappel concernant le paiement de la scolarité de 
{student_name} ({class_level}) à {school_name}.

💰 Montant dû : {amount} {currency}
📅 Échéance dépassée : {due_date}

Pour payer maintenant :
👉 {payment_link}

Merci de votre confiance.
— {school_name}
```

**Reçu de paiement SMS :**

```
{school_name}: Paiement de {amount} {currency} reçu pour 
{student_name}. Reçu: {receipt_number}. 
Solde restant: {remaining_balance} {currency}.
```

#### 3.6.3 Configuration des Relances

L'admin peut configurer par école :

| Paramètre | Défaut | Configurable |
|---|---|---|
| Relance J+1 | ✅ Activée | Oui (on/off, canal) |
| Relance J+7 | ✅ Activée | Oui |
| Relance J+30 | ✅ Activée | Oui |
| Rappel pré-échéance | ✅ 3 jours avant | Oui (1, 3, 5, 7 jours) |
| Heures d'envoi autorisées | 8h-20h locale | Oui |
| Jours d'envoi autorisés | Lun-Sam | Oui |
| Message personnalisé | Template par défaut | Oui (avec variables) |

**Règles métier :**

- Les messages sont envoyés uniquement pendant les heures autorisées (respect de la vie privée).
- Un parent ne reçoit **pas plus de 2 relances par semaine** par enfant (anti-harcèlement).
- L'admin peut **suspendre les relances** pour un élève spécifique (cas social, arrangement de paiement).
- Chaque notification envoyée est loguée dans `notification_logs` avec statut de délivrance.

#### 3.6.4 Intégration WhatsApp Business API

```
[Worker BullMQ] ──► Queue: notification_queue
                     │
                     ▼
                  Récupère le template + variables
                     │
                     ▼
                  POST /v17.0/{phone_number_id}/messages
                  (Meta Cloud API)
                  {
                    "messaging_product": "whatsapp",
                    "to": "{parent_phone}",
                    "type": "template",
                    "template": {
                      "name": "payment_reminder",
                      "language": { "code": "fr" },
                      "components": [...]
                    }
                  }
                     │
                     ▼
                  Webhook callback: DELIVERED / READ / FAILED
                     │
                     ▼
                  Mise à jour notification_logs
```

---

## 4. Spécifications Techniques & Architecture

### 4.1 Architecture Globale & Topologie

#### 4.1.1 Diagramme Logique de l'Écosystème

```
                            ┌──────────────────┐
                            │   CDN / Edge     │
                            │  (Cloudflare)    │
                            └────────┬─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
           ┌───────┴──────┐ ┌──────┴───────┐ ┌──────┴───────┐
           │  SPA Admin   │ │  SPA Cashier │ │  PWA Parent  │
           │  (React/Next)│ │  (React/Next)│ │  (React/Next)│
           │  Desktop-opt │ │  Mobile-opt  │ │  Mobile-1st  │
           └───────┬──────┘ └──────┬───────┘ └──────┬───────┘
                   │               │                │
                   └───────────────┼────────────────┘
                                   │
                          ┌────────┴────────┐
                          │   API Gateway   │
                          │   (nginx/traefik│
                          │   + rate limit) │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
           ┌───────┴──────┐      │       ┌──────┴───────┐
           │   REST API   │      │       │  Webhook     │
           │   Server     │      │       │  Receiver    │
           │  (Node.js /  │      │       │  (isolated)  │
           │   Fastify)   │      │       └──────┬───────┘
           └───────┬──────┘      │              │
                   │             │              │
                   │      ┌──────┴──────┐       │
                   │      │   Redis     │◄──────┘
                   │      │  (BullMQ    │
                   │      │   queues)   │
                   │      └──────┬──────┘
                   │             │
                   │      ┌──────┴──────┐
                   │      │  Workers    │
                   │      │  (BullMQ)   │
                   │      │  ────────── │
                   │      │  • PDF Gen  │
                   │      │  • Notifs   │
                   │      │  • Polling  │
                   │      │  • Import   │
                   │      └─────────────┘
                   │
            ┌──────┴──────┐
            │ PostgreSQL  │
            │  (Primary)  │
            │  + RLS      │
            │  + Read     │
            │    Replicas │
            └──────┬──────┘
                   │
            ┌──────┴──────┐
            │  Object     │
            │  Storage    │
            │ (S3 / R2)   │
            │  ─────────  │
            │  • Logos    │
            │  • Reçus   │
            │  • Photos  │
            │  • Imports │
            └─────────────┘

                    ┌─────────────────────────────┐
                    │     External Services        │
                    │  ───────────────────────────  │
                    │  • Paystack / Flutterwave    │
                    │  • CinetPay / Wave           │
                    │  • Orange Money / MTN MoMo   │
                    │  • WhatsApp Business API     │
                    │  • SMS Gateway (Twilio/Vonage)│
                    │  • Email (SES / Resend)      │
                    └─────────────────────────────┘
```

#### 4.1.2 Stack Technologique

| Couche | Technologie | Justification |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | SSR pour SEO, RSC pour perfs, même framework pour les 3 apps |
| **UI Library** | Shadcn/ui + Tailwind CSS | Components accessibles, thématisation facile |
| **State** | TanStack Query (React Query) | Cache intelligent, mutations optimistes |
| **Backend** | Node.js + Fastify | Performances supérieures à Express, schema validation native (Ajv) |
| **ORM** | Drizzle ORM | TypeSafe, SQL-first, migrations déclaratives, supporte RLS |
| **Auth** | JWT (access + refresh tokens) | Stateless, scalable — OTP custom pour parents |
| **Database** | PostgreSQL 16 | RLS natif, JSONB, excellent pour la multi-tenancy |
| **Queue** | Redis + BullMQ | Queues robustes, retry, backoff, dead letter |
| **PDF** | @react-pdf/renderer ou Puppeteer | Templates React pour les reçus |
| **Storage** | Cloudflare R2 (S3-compatible) | Pas de frais d'egress, edge-native |
| **Hosting** | Railway / Render / Fly.io | PaaS managed, simple scaling |
| **Monitoring** | Sentry + Axiom | Error tracking + logs structurés |

> **Choix architectural : Monorepo Turborepo**
>
> | Avantage | Inconvénient |
> |---|---|
> | Code partagé entre les 3 apps (types, validateurs, utils) | Complexité CI/CD accrue |
> | Versioning unique | Build times plus longs (atténué par le cache Turborepo) |
> | Refactoring global facilité | Courbe d'apprentissage pour les nouveaux développeurs |

**Structure du Monorepo :**

```
payskool/
├── apps/
│   ├── admin/          # Next.js — Dashboard Admin/Promoteur
│   ├── cashier/        # Next.js — Interface Caissier
│   ├── parent/         # Next.js — PWA Parent
│   └── api/            # Fastify — API REST
├── packages/
│   ├── db/             # Drizzle schema, migrations, seeds
│   ├── shared/         # Types TS partagés, validators (Zod)
│   ├── ui/             # Composants UI partagés (Shadcn)
│   └── config/         # ESLint, TypeScript, Tailwind configs
├── workers/
│   ├── pdf-generator/  # Worker BullMQ — Génération PDF
│   ├── notifier/       # Worker BullMQ — Notifications
│   ├── payment-poller/ # Worker BullMQ — Polling agrégateurs
│   └── importer/       # Worker BullMQ — Import CSV/Excel
├── turbo.json
├── package.json
└── docker-compose.yml
```

---

### 4.2 Modèle de Données Relationnel (DDL PostgreSQL)

#### 4.2.1 Schéma DDL Complet

```sql
-- ============================================================
-- PAYSKOOL — DDL PostgreSQL 16
-- Plateforme SaaS PayTech Éducative
-- ============================================================

-- Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TYPES ENUM
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',
    'OWNER',
    'SCHOOL_ADMIN',
    'CASHIER',
    'PARENT'
);

CREATE TYPE school_type AS ENUM (
    'MATERNELLE',
    'PRIMAIRE',
    'SECONDAIRE',
    'COMPLEXE'
);

CREATE TYPE school_status AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'ARCHIVED'
);

CREATE TYPE student_status AS ENUM (
    'ENROLLED',
    'TRANSFERRED',
    'GRADUATED',
    'EXPELLED'
);

CREATE TYPE gender_type AS ENUM ('M', 'F');

CREATE TYPE fee_type AS ENUM (
    'ONE_TIME',
    'RECURRING'
);

CREATE TYPE installment_status AS ENUM (
    'PENDING',
    'PARTIAL',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);

CREATE TYPE transaction_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'FAILED',
    'REVERSED'
);

CREATE TYPE transaction_channel AS ENUM (
    'CASH',
    'CHEQUE',
    'ONLINE',
    'BANK_TRANSFER'
);

CREATE TYPE transaction_type AS ENUM (
    'PAYMENT',
    'REVERSAL',
    'REFUND',
    'ADJUSTMENT'
);

CREATE TYPE payment_provider AS ENUM (
    'NONE',
    'PAYSTACK',
    'FLUTTERWAVE',
    'CINETPAY',
    'WAVE',
    'ORANGE_MONEY',
    'MTN_MOMO'
);

CREATE TYPE notification_channel AS ENUM (
    'SMS',
    'WHATSAPP',
    'EMAIL',
    'PUSH'
);

CREATE TYPE notification_status AS ENUM (
    'QUEUED',
    'SENT',
    'DELIVERED',
    'READ',
    'FAILED'
);

CREATE TYPE membership_status AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'REVOKED'
);

CREATE TYPE invitation_status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'EXPIRED',
    'REVOKED'
);

CREATE TYPE workspace_plan AS ENUM (
    'TRIAL',
    'STARTER',
    'PRO',
    'ENTERPRISE'
);

-- ============================================================
-- TABLE: workspaces
-- Conteneur logique pour un promoteur (multi-école)
-- ============================================================

CREATE TABLE workspaces (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    owner_id        UUID NOT NULL,           -- FK → users.id (set after users table)
    plan            workspace_plan NOT NULL DEFAULT 'TRIAL',
    max_schools     INT NOT NULL DEFAULT 1,
    max_students    INT NOT NULL DEFAULT 50,
    trial_ends_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);

-- ============================================================
-- TABLE: users
-- Tous les utilisateurs de la plateforme
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE,
    phone           VARCHAR(20) UNIQUE,
    phone_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash   VARCHAR(255),            -- NULL pour les parents (passwordless)
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    avatar_url      TEXT,
    global_role     user_role NOT NULL DEFAULT 'PARENT',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;

-- FK: workspaces.owner_id → users.id
ALTER TABLE workspaces
    ADD CONSTRAINT fk_workspaces_owner
    FOREIGN KEY (owner_id) REFERENCES users(id);

-- ============================================================
-- TABLE: schools
-- Établissements scolaires au sein d'un Workspace
-- ============================================================

CREATE TABLE schools (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    type            school_type NOT NULL,
    address         TEXT,
    city            VARCHAR(100) NOT NULL,
    country_code    CHAR(2) NOT NULL,        -- ISO 3166-1 alpha-2
    currency        CHAR(3) NOT NULL,        -- ISO 4217
    phone           VARCHAR(20),
    logo_url        TEXT,
    academic_year   VARCHAR(9) NOT NULL,     -- ex: '2026-2027'
    timezone        VARCHAR(50) NOT NULL DEFAULT 'Africa/Abidjan',
    payment_config  BYTEA,                   -- AES-256-GCM encrypted JSONB
    status          school_status NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_school_slug_workspace UNIQUE (workspace_id, slug)
);

CREATE INDEX idx_schools_workspace ON schools(workspace_id);
CREATE INDEX idx_schools_status ON schools(status);

-- ============================================================
-- TABLE: memberships
-- Relation User ↔ School avec rôle
-- ============================================================

CREATE TABLE memberships (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    role            user_role NOT NULL,
    status          membership_status NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_membership UNIQUE (user_id, school_id)
);

CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_school ON memberships(school_id);
CREATE INDEX idx_memberships_role ON memberships(role);

-- ============================================================
-- TABLE: invitations
-- Invitations envoyées (avant acceptation)
-- ============================================================

CREATE TABLE invitations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    invited_by      UUID NOT NULL REFERENCES users(id),
    email           VARCHAR(255),
    phone           VARCHAR(20),
    role            user_role NOT NULL,
    token           VARCHAR(255) NOT NULL UNIQUE,
    status          invitation_status NOT NULL DEFAULT 'PENDING',
    expires_at      TIMESTAMPTZ NOT NULL,
    accepted_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_invitation_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_school ON invitations(school_id);

-- ============================================================
-- TABLE: students
-- Élèves (données financières uniquement)
-- ============================================================

CREATE TABLE students (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    matricule       VARCHAR(50) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    gender          gender_type,
    date_of_birth   DATE,
    class_level     VARCHAR(50) NOT NULL,
    academic_year   VARCHAR(9) NOT NULL,
    status          student_status NOT NULL DEFAULT 'ENROLLED',
    previous_balance BIGINT NOT NULL DEFAULT 0,  -- centimes (négatif = arriéré)
    photo_url       TEXT,
    metadata        JSONB DEFAULT '{}',          -- champs libres (ex: filière)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_student_matricule UNIQUE (school_id, matricule, academic_year)
);

CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_class ON students(school_id, class_level);
CREATE INDEX idx_students_name ON students(school_id, last_name, first_name);
CREATE INDEX idx_students_status ON students(school_id, status);

-- ============================================================
-- TABLE: parent_students
-- Relation Parent (user) ↔ Élève (many-to-many)
-- ============================================================

CREATE TABLE parent_students (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship    VARCHAR(50) DEFAULT 'PARENT', -- PARENT, TUTEUR, ONCLE, etc.
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE, -- contact principal?
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_parent_student UNIQUE (parent_id, student_id)
);

CREATE INDEX idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX idx_parent_students_student ON parent_students(student_id);

-- ============================================================
-- TABLE: fee_structures
-- Grilles tarifaires par niveau/classe
-- ============================================================

CREATE TABLE fee_structures (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    class_level     VARCHAR(50) NOT NULL,      -- niveau ciblé
    academic_year   VARCHAR(9) NOT NULL,
    total_amount    BIGINT NOT NULL,            -- centimes, calculé = Σ installments
    fee_type        fee_type NOT NULL DEFAULT 'ONE_TIME',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_fee_structure UNIQUE (school_id, class_level, academic_year, name)
);

CREATE INDEX idx_fee_structures_school ON fee_structures(school_id);
CREATE INDEX idx_fee_structures_class ON fee_structures(school_id, class_level);

-- ============================================================
-- TABLE: fee_installments
-- Tranches de paiement au sein d'une Fee Structure
-- ============================================================

CREATE TABLE fee_installments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    label           VARCHAR(255) NOT NULL,     -- ex: "Tranche 1 — Inscription"
    amount          BIGINT NOT NULL,           -- centimes
    due_date        DATE NOT NULL,             -- date d'échéance
    sort_order      INT NOT NULL DEFAULT 0,    -- ordre d'affichage et d'allocation FIFO
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_installments_structure ON fee_installments(fee_structure_id);
CREATE INDEX idx_fee_installments_school ON fee_installments(school_id);
CREATE INDEX idx_fee_installments_due ON fee_installments(due_date);

-- ============================================================
-- TABLE: student_fee_plans
-- Instance personnalisée d'une Fee Structure pour un élève
-- ============================================================

CREATE TABLE student_fee_plans (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    discount_type   VARCHAR(20) DEFAULT 'NONE',  -- NONE, PERCENTAGE, FIXED
    discount_value  BIGINT DEFAULT 0,            -- pourcentage (0-100) ou montant fixe (centimes)
    discount_reason TEXT,                         -- ex: "Bourse mérite", "Fratrie"
    net_amount      BIGINT NOT NULL,             -- montant final après réduction (centimes)
    amount_paid     BIGINT NOT NULL DEFAULT 0,   -- cache dénormalisé, mis à jour par trigger
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, CANCELLED
    academic_year   VARCHAR(9) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_student_fee_plan UNIQUE (student_id, fee_structure_id),
    CONSTRAINT chk_discount_type CHECK (discount_type IN ('NONE', 'PERCENTAGE', 'FIXED')),
    CONSTRAINT chk_discount_percentage CHECK (
        discount_type != 'PERCENTAGE' OR (discount_value >= 0 AND discount_value <= 100)
    )
);

CREATE INDEX idx_student_fee_plans_student ON student_fee_plans(student_id);
CREATE INDEX idx_student_fee_plans_school ON student_fee_plans(school_id);
CREATE INDEX idx_student_fee_plans_status ON student_fee_plans(status);

-- ============================================================
-- TABLE: student_fee_plan_installments
-- Copie des tranches pour un StudentFeePlan (permet suivi individuel)
-- ============================================================

CREATE TABLE student_fee_plan_installments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_fee_plan_id UUID NOT NULL REFERENCES student_fee_plans(id) ON DELETE CASCADE,
    fee_installment_id  UUID REFERENCES fee_installments(id),  -- NULL si tranche custom (arriéré)
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    label               VARCHAR(255) NOT NULL,
    amount              BIGINT NOT NULL,                       -- centimes (peut différer de l'original si remise)
    amount_paid         BIGINT NOT NULL DEFAULT 0,             -- cache dénormalisé
    due_date            DATE NOT NULL,
    sort_order          INT NOT NULL DEFAULT 0,
    status              installment_status NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sfp_installments_plan ON student_fee_plan_installments(student_fee_plan_id);
CREATE INDEX idx_sfp_installments_school ON student_fee_plan_installments(school_id);
CREATE INDEX idx_sfp_installments_status ON student_fee_plan_installments(status);
CREATE INDEX idx_sfp_installments_due ON student_fee_plan_installments(due_date, status);

-- ============================================================
-- TABLE: transactions
-- Ledger immuable — AUCUN UPDATE / DELETE
-- ============================================================

CREATE TABLE transactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id           UUID NOT NULL REFERENCES schools(id),
    student_id          UUID NOT NULL REFERENCES students(id),
    student_fee_plan_id UUID REFERENCES student_fee_plans(id),
    reference_code      VARCHAR(100) NOT NULL UNIQUE,          -- ex: TXN-EXC-20261015-00042
    idempotency_key     VARCHAR(255) NOT NULL UNIQUE,          -- clé unique pour éviter doublons
    type                transaction_type NOT NULL DEFAULT 'PAYMENT',
    channel             transaction_channel NOT NULL,
    provider            payment_provider NOT NULL DEFAULT 'NONE',
    amount              BIGINT NOT NULL,                       -- centimes (positif=paiement, négatif=reversal)
    currency            CHAR(3) NOT NULL,
    status              transaction_status NOT NULL DEFAULT 'PENDING',
    
    -- Détails paiement
    provider_reference  VARCHAR(255),                          -- ID de la transaction chez l'agrégateur
    cheque_number       VARCHAR(50),
    cheque_bank         VARCHAR(100),
    
    -- Metadata
    description         TEXT,
    metadata            JSONB DEFAULT '{}',
    
    -- Correction/Reversal
    reversed_txn_id     UUID REFERENCES transactions(id),     -- pointe vers la txn originale si reversal
    reversal_reason     TEXT,
    
    -- Audit
    created_by          UUID NOT NULL REFERENCES users(id),
    confirmed_at        TIMESTAMPTZ,
    ip_address          INET,
    user_agent          TEXT,
    
    -- Polling (online payments)
    polling_attempts    INT NOT NULL DEFAULT 0,
    last_polled_at      TIMESTAMPTZ,
    
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- PAS de updated_at — immuable
);

-- Index critique pour performance
CREATE INDEX idx_transactions_school ON transactions(school_id);
CREATE INDEX idx_transactions_student ON transactions(student_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_reference ON transactions(reference_code);
CREATE INDEX idx_transactions_created ON transactions(school_id, created_at DESC);
CREATE INDEX idx_transactions_pending_poll ON transactions(status, channel, created_at)
    WHERE status = 'PENDING' AND channel = 'ONLINE';
CREATE INDEX idx_transactions_plan ON transactions(student_fee_plan_id)
    WHERE student_fee_plan_id IS NOT NULL;

-- Protection: empêcher UPDATE et DELETE via trigger
CREATE OR REPLACE FUNCTION prevent_transaction_mutation()
RETURNS TRIGGER AS $$
BEGIN
    -- Seule exception: PENDING → CONFIRMED/FAILED (paiements online)
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'PENDING' AND NEW.status IN ('CONFIRMED', 'FAILED') THEN
            -- Autorisé: mise à jour du statut d'un paiement en attente
            IF NEW.amount != OLD.amount
                OR NEW.school_id != OLD.school_id
                OR NEW.student_id != OLD.student_id
                OR NEW.reference_code != OLD.reference_code
                OR NEW.channel != OLD.channel
                OR NEW.type != OLD.type
            THEN
                RAISE EXCEPTION 'Transaction mutation forbidden: only status, confirmed_at, provider_reference, polling_attempts, and last_polled_at can be updated on PENDING transactions';
            END IF;
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'Transaction mutation forbidden: cannot update a non-PENDING transaction';
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Transaction deletion is forbidden';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_transaction_mutation
    BEFORE UPDATE OR DELETE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION prevent_transaction_mutation();

-- ============================================================
-- TABLE: transaction_allocations
-- Ventilation d'une transaction sur les tranches (FIFO)
-- ============================================================

CREATE TABLE transaction_allocations (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id              UUID NOT NULL REFERENCES transactions(id),
    student_fee_plan_installment_id UUID NOT NULL REFERENCES student_fee_plan_installments(id),
    school_id                   UUID NOT NULL REFERENCES schools(id),
    amount                      BIGINT NOT NULL,           -- centimes alloués à cette tranche
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_allocations_transaction ON transaction_allocations(transaction_id);
CREATE INDEX idx_allocations_installment ON transaction_allocations(student_fee_plan_installment_id);
CREATE INDEX idx_allocations_school ON transaction_allocations(school_id);

-- ============================================================
-- TABLE: payment_webhook_logs
-- Log brut de tous les webhooks reçus (audit & debugging)
-- ============================================================

CREATE TABLE payment_webhook_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID REFERENCES schools(id),
    provider        payment_provider NOT NULL,
    event_type      VARCHAR(100),                -- ex: 'charge.success', 'payment.completed'
    reference_code  VARCHAR(255),                -- pour matcher avec transactions
    raw_payload     JSONB NOT NULL,              -- payload brut reçu
    headers         JSONB,                       -- headers HTTP reçus
    signature_valid BOOLEAN,                     -- résultat de la vérification de signature
    processed       BOOLEAN NOT NULL DEFAULT FALSE,
    processing_error TEXT,
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_reference ON payment_webhook_logs(reference_code);
CREATE INDEX idx_webhook_logs_provider ON payment_webhook_logs(provider, created_at DESC);
CREATE INDEX idx_webhook_logs_unprocessed ON payment_webhook_logs(processed)
    WHERE processed = FALSE;

-- ============================================================
-- TABLE: notification_logs
-- Log de toutes les notifications envoyées
-- ============================================================

CREATE TABLE notification_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id),
    student_id      UUID REFERENCES students(id),
    parent_id       UUID REFERENCES users(id),
    channel         notification_channel NOT NULL,
    type            VARCHAR(50) NOT NULL,        -- 'PAYMENT_RECEIPT', 'OVERDUE_REMINDER', etc.
    recipient       VARCHAR(255) NOT NULL,       -- phone number or email
    template_name   VARCHAR(100),
    template_vars   JSONB,
    provider_id     VARCHAR(255),                -- ID du message chez le provider (WhatsApp/SMS)
    status          notification_status NOT NULL DEFAULT 'QUEUED',
    error_message   TEXT,
    sent_at         TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_logs_school ON notification_logs(school_id);
CREATE INDEX idx_notification_logs_student ON notification_logs(student_id);
CREATE INDEX idx_notification_logs_parent ON notification_logs(parent_id);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_type ON notification_logs(type, created_at DESC);

-- ============================================================
-- TABLE: receipts
-- Reçus PDF générés
-- ============================================================

CREATE TABLE receipts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id),
    transaction_id  UUID NOT NULL REFERENCES transactions(id) UNIQUE,
    receipt_number  VARCHAR(100) NOT NULL UNIQUE,  -- REC-EXC-20261015-00042
    pdf_url         TEXT NOT NULL,                  -- URL S3/R2
    qr_code_data    TEXT NOT NULL,                  -- URL de vérification
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_receipts_school ON receipts(school_id);
CREATE INDEX idx_receipts_number ON receipts(receipt_number);

-- ============================================================
-- TABLE: audit_logs
-- Journal d'audit général (actions non-financières)
-- ============================================================

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID REFERENCES schools(id),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,        -- 'STUDENT_CREATED', 'FEE_UPDATED', etc.
    entity_type     VARCHAR(50),                  -- 'student', 'fee_structure', etc.
    entity_id       UUID,
    old_values      JSONB,
    new_values      JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_school ON audit_logs(school_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- TABLE: otp_codes
-- Codes OTP pour authentification parent
-- ============================================================

CREATE TABLE otp_codes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone           VARCHAR(20) NOT NULL,
    code            VARCHAR(6) NOT NULL,
    attempts        INT NOT NULL DEFAULT 0,
    is_used         BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_codes_phone ON otp_codes(phone, created_at DESC);
CREATE INDEX idx_otp_codes_expiry ON otp_codes(expires_at)
    WHERE is_used = FALSE;

-- ============================================================
-- TABLE: import_jobs
-- Jobs d'importation CSV/Excel
-- ============================================================

CREATE TABLE import_jobs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id),
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    file_name       VARCHAR(255) NOT NULL,
    file_url        TEXT NOT NULL,
    file_size       INT NOT NULL,
    total_rows      INT,
    valid_rows      INT,
    error_rows      INT,
    column_mapping  JSONB,                       -- mapping sauvegardé
    status          VARCHAR(20) NOT NULL DEFAULT 'UPLOADED',
    -- UPLOADED → PARSING → MAPPED → PREVIEWING → IMPORTING → COMPLETED / FAILED
    error_report    JSONB,                       -- détail des erreurs par ligne
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_import_jobs_school ON import_jobs(school_id);

-- ============================================================
-- TABLE: notification_settings
-- Configuration des relances par école
-- ============================================================

CREATE TABLE notification_settings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) UNIQUE,
    reminder_d1     BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_d7     BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_d30    BOOLEAN NOT NULL DEFAULT TRUE,
    pre_due_days    INT NOT NULL DEFAULT 3,
    allowed_hours   JSONB NOT NULL DEFAULT '{"start": "08:00", "end": "20:00"}',
    allowed_days    JSONB NOT NULL DEFAULT '["MON","TUE","WED","THU","FRI","SAT"]',
    max_per_week    INT NOT NULL DEFAULT 2,
    sms_enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_enabled   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: daily_cash_summaries
-- Résumé de caisse quotidien (matérialisé par cron)
-- ============================================================

CREATE TABLE daily_cash_summaries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id),
    date            DATE NOT NULL,
    total_cash      BIGINT NOT NULL DEFAULT 0,
    total_cheque    BIGINT NOT NULL DEFAULT 0,
    total_online    BIGINT NOT NULL DEFAULT 0,
    total_reversals BIGINT NOT NULL DEFAULT 0,
    transaction_count INT NOT NULL DEFAULT 0,
    cashier_breakdown JSONB,                     -- { "user_id": amount, ... }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_daily_summary UNIQUE (school_id, date)
);

CREATE INDEX idx_daily_summaries_school_date ON daily_cash_summaries(school_id, date DESC);
```

#### 4.2.2 Diagramme Entité-Relation (Résumé)

```
workspaces ──1:N──► schools ──1:N──► students
     │                 │                  │
     │                 │                  ├──N:M──► users (via parent_students)
     │                 │                  │
     │                 ├──1:N──► fee_structures ──1:N──► fee_installments
     │                 │                  │
     │                 │                  └──1:N──► student_fee_plans
     │                 │                                 │
     │                 │                                 └──1:N──► student_fee_plan_installments
     │                 │
     │                 ├──1:N──► memberships ◄──N:1── users
     │                 │
     │                 ├──1:N──► transactions ──1:N──► transaction_allocations
     │                 │              │
     │                 │              └──1:1──► receipts
     │                 │
     │                 ├──1:N──► notification_logs
     │                 ├──1:N──► payment_webhook_logs
     │                 ├──1:N──► audit_logs
     │                 ├──1:1──► notification_settings
     │                 └──1:N──► daily_cash_summaries
     │
     └──1:1──► users (owner)
```

---

### 4.3 Matrice de Sécurité & Droits (RBAC)

#### 4.3.1 Matrice Complète

| Fonctionnalité | `SUPER_ADMIN` | `OWNER` | `SCHOOL_ADMIN` | `CASHIER` | `PARENT` |
|---|:---:|:---:|:---:|:---:|:---:|
| **Workspace** | | | | | |
| Créer un Workspace | — | ✅ | — | — | — |
| Modifier un Workspace | 🔧 | ✅ | — | — | — |
| Supprimer un Workspace | 🔧 | ✅ | — | — | — |
| **Écoles** | | | | | |
| Créer une école | — | ✅ | — | — | — |
| Modifier une école | 🔧 | ✅ | ✅ | — | — |
| Configurer paiement (API keys) | — | ✅ | ✅ | — | — |
| Voir la liste des écoles | 🔧 | ✅ (toutes) | ✅ (la sienne) | ✅ (la sienne) | — |
| **Utilisateurs & Rôles** | | | | | |
| Inviter un SCHOOL_ADMIN | — | ✅ | ✅ | — | — |
| Inviter un CASHIER | — | ✅ | ✅ | — | — |
| Révoquer un membre | 🔧 | ✅ | ✅ (sauf Owner) | — | — |
| Voir les membres | 🔧 | ✅ | ✅ | — | — |
| **Élèves** | | | | | |
| Créer / Importer des élèves | — | ✅ | ✅ | — | — |
| Modifier un élève | — | ✅ | ✅ | — | — |
| Voir la liste des élèves | 🔧 | ✅ | ✅ | ✅ (lecture seule) | — |
| Voir le détail financier d'un élève | — | ✅ | ✅ | ✅ | ✅ (ses enfants) |
| Lier un parent à un élève | — | ✅ | ✅ | — | — |
| **Fee Engine** | | | | | |
| Créer / Modifier une Fee Structure | — | ✅ | ✅ | — | — |
| Appliquer aux élèves (bulk) | — | ✅ | ✅ | — | — |
| Gérer les réductions / bourses | — | ✅ | ✅ | — | — |
| Voir les grilles tarifaires | — | ✅ | ✅ | ✅ | ✅ (ses enfants) |
| **Transactions** | | | | | |
| Saisir un paiement cash/chèque | — | ✅ | ✅ | ✅ | — |
| Effectuer un paiement en ligne | — | — | — | — | ✅ |
| Créer un reversal (annulation) | — | ✅ | ✅ | — | — |
| Voir les transactions | 🔧 | ✅ (toutes) | ✅ (toutes) | ✅ (les siennes) | ✅ (ses enfants) |
| Exporter les transactions | — | ✅ | ✅ | — | — |
| **Reçus** | | | | | |
| Générer / Régénérer un reçu | — | ✅ | ✅ | ✅ | — |
| Télécharger un reçu | — | ✅ | ✅ | ✅ | ✅ (ses enfants) |
| Vérifier un reçu (QR) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Rapports & Analytics** | | | | | |
| Dashboard financier global | — | ✅ | ✅ | — | — |
| Rapport de caisse quotidien | — | ✅ | ✅ | ✅ (le sien) | — |
| Rapport d'impayés | — | ✅ | ✅ | — | — |
| Export comptable | — | ✅ | ✅ | — | — |
| **Notifications** | | | | | |
| Configurer les relances | — | ✅ | ✅ | — | — |
| Envoyer une relance manuelle | — | ✅ | ✅ | — | — |
| Voir les logs de notification | — | ✅ | ✅ | — | — |
| **Administration Plateforme** | | | | | |
| Voir tous les Workspaces | ✅ | — | — | — | — |
| Suspendre un Workspace | ✅ | — | — | — | — |
| Gérer la facturation SaaS | ✅ | ✅ (le sien) | — | — | — |

**Légende :**
- ✅ = Accès complet
- 🔧 = Accès technique/support (SUPER_ADMIN uniquement, via interface d'administration interne)
- — = Aucun accès

#### 4.3.2 Implémentation RBAC dans le Backend

```typescript
// middleware/authorize.ts
import { FastifyRequest, FastifyReply } from 'fastify';

type Permission = {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export';
};

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  OWNER: [
    { resource: 'schools', action: 'create' },
    { resource: 'schools', action: 'read' },
    { resource: 'schools', action: 'update' },
    { resource: 'students', action: 'create' },
    { resource: 'students', action: 'read' },
    { resource: 'students', action: 'update' },
    { resource: 'transactions', action: 'create' },
    { resource: 'transactions', action: 'read' },
    { resource: 'transactions', action: 'export' },
    { resource: 'fee_structures', action: 'create' },
    { resource: 'fee_structures', action: 'read' },
    { resource: 'fee_structures', action: 'update' },
    { resource: 'reports', action: 'read' },
    // ... all permissions
  ],
  CASHIER: [
    { resource: 'students', action: 'read' },
    { resource: 'transactions', action: 'create' },
    { resource: 'transactions', action: 'read' }, // own only
    { resource: 'receipts', action: 'read' },
  ],
  // ...
};

export function authorize(resource: string, action: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { user, schoolId } = request;
    
    // SUPER_ADMIN bypass
    if (user.globalRole === 'SUPER_ADMIN') return;
    
    // Get user's role for the current school
    const membership = await getMembership(user.id, schoolId);
    if (!membership || membership.status !== 'ACTIVE') {
      return reply.code(403).send({ error: 'No active membership for this school' });
    }
    
    // OWNER has implicit access to all schools in their workspace
    if (user.globalRole === 'OWNER') {
      const school = await getSchool(schoolId);
      const workspace = await getWorkspace(school.workspaceId);
      if (workspace.ownerId !== user.id) {
        return reply.code(403).send({ error: 'Not the workspace owner' });
      }
      return; // Owner has full access
    }
    
    // Check role permissions
    const permissions = ROLE_PERMISSIONS[membership.role] || [];
    const hasPermission = permissions.some(
      p => p.resource === resource && p.action === action
    );
    
    if (!hasPermission) {
      return reply.code(403).send({ error: 'Insufficient permissions' });
    }
  };
}
```

---

### 4.4 Stratégie d'Isolation Multi-tenant (RLS)

#### 4.4.1 Approche Choisie : Row-Level Security (RLS) par `school_id`

| Critère | RLS (Discriminator Column) | Silo BDD (1 DB par école) |
|---|---|---|
| **Isolation** | Logique (même DB, filtrage par `school_id`) | Physique (bases séparées) |
| **Coût infra** | ✅ Faible (1 seule DB) | ❌ Élevé (N bases) |
| **Migrations** | ✅ Une seule migration pour tous | ❌ N migrations à appliquer |
| **Complexité** | ✅ Modérée | ❌ Élevée (connection pooling, routing) |
| **Risque de data leak** | ⚠️ Si RLS mal configurée | ✅ Impossible par design |
| **Scalabilité** | ✅ Jusqu'à ~10K écoles | ✅ Illimitée |
| **Backup/Restore** | ⚠️ Granularité = toute la DB | ✅ Par école |

**Choix : RLS** — pour le marché cible (écoles africaines, volume modéré), le rapport coût/complexité est largement favorable. Le risque de data leak est mitigé par des tests automatisés et un audit du schéma RLS.

#### 4.4.2 Implémentation RLS PostgreSQL

```sql
-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- Chaque requête est filtrée par school_id via le paramètre
-- de session app.current_school_id
-- ============================================================

-- Activer RLS sur toutes les tables tenant-scoped
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_plan_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;

-- Créer un rôle applicatif (non-superuser) pour l'API
CREATE ROLE payskool_api LOGIN PASSWORD 'changeme';

-- Politique générique: filtrage par school_id
-- (appliquée à chaque table tenant-scoped)

CREATE POLICY rls_students ON students
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_fee_structures ON fee_structures
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_fee_installments ON fee_installments
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_student_fee_plans ON student_fee_plans
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_sfp_installments ON student_fee_plan_installments
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_transactions ON transactions
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_transaction_allocations ON transaction_allocations
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_webhook_logs ON payment_webhook_logs
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_notification_logs ON notification_logs
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_receipts ON receipts
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_audit_logs ON audit_logs
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_memberships ON memberships
    USING (school_id = current_setting('app.current_school_id')::UUID);

CREATE POLICY rls_import_jobs ON import_jobs
    USING (school_id = current_setting('app.current_school_id')::UUID);

-- Grants pour le rôle applicatif
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO payskool_api;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO payskool_api;
```

#### 4.4.3 Middleware de Contexte Tenant

```typescript
// middleware/tenant.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@payskool/db';

export async function tenantMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const schoolId = request.headers['x-school-id'] as string;
  
  if (!schoolId) {
    return reply.code(400).send({ error: 'X-School-Id header is required' });
  }
  
  // Validate UUID format
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(schoolId)) {
    return reply.code(400).send({ error: 'Invalid school ID format' });
  }
  
  // Verify user has access to this school
  const membership = await db.query.memberships.findFirst({
    where: (m, { and, eq }) => and(
      eq(m.userId, request.user.id),
      eq(m.schoolId, schoolId),
      eq(m.status, 'ACTIVE')
    ),
  });
  
  // Allow OWNER to access any school in their workspace
  if (!membership && request.user.globalRole === 'OWNER') {
    const school = await db.query.schools.findFirst({
      where: (s, { eq }) => eq(s.id, schoolId),
      with: { workspace: true },
    });
    
    if (!school || school.workspace.ownerId !== request.user.id) {
      return reply.code(403).send({ error: 'Access denied to this school' });
    }
  } else if (!membership) {
    return reply.code(403).send({ error: 'Access denied to this school' });
  }
  
  // Set RLS context for this request
  request.schoolId = schoolId;
  request.membership = membership;
}

// Database query wrapper that sets RLS context
export async function withTenant<T>(
  schoolId: string,
  callback: () => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    // Set the session variable for RLS
    await tx.execute(
      `SET LOCAL app.current_school_id = '${schoolId}'`
    );
    return callback();
  });
}
```

#### 4.4.4 Tests Automatisés de l'Isolation

```typescript
// tests/rls.test.ts
describe('Row-Level Security', () => {
  it('should not allow School A to see School B students', async () => {
    // Create two schools
    const schoolA = await createSchool({ name: 'School A' });
    const schoolB = await createSchool({ name: 'School B' });
    
    // Create students in each
    await createStudent({ schoolId: schoolA.id, name: 'Alice' });
    await createStudent({ schoolId: schoolB.id, name: 'Bob' });
    
    // Query as School A
    const students = await withTenant(schoolA.id, async () => {
      return db.query.students.findMany();
    });
    
    expect(students).toHaveLength(1);
    expect(students[0].firstName).toBe('Alice');
    // Bob should NOT be visible
    expect(students.find(s => s.firstName === 'Bob')).toBeUndefined();
  });
  
  it('should prevent cross-tenant transaction creation', async () => {
    const schoolA = await createSchool({ name: 'School A' });
    const schoolB = await createSchool({ name: 'School B' });
    const studentB = await createStudent({ schoolId: schoolB.id });
    
    // Try to create a transaction for School B student while in School A context
    await expect(
      withTenant(schoolA.id, async () => {
        return createTransaction({
          schoolId: schoolB.id, // Attempted cross-tenant write
          studentId: studentB.id,
          amount: 50000,
        });
      })
    ).rejects.toThrow();
  });
});
```

---

### 4.5 Fiabilité des Transactions Financières (Resilience Patterns)

#### 4.5.1 Cycle de Vie d'un Paiement Online

```
                    ┌──────────────┐
                    │   PENDING    │
                    │  (created)   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
     ┌────────▼──────┐    │    ┌───────▼────────┐
     │  Webhook OK   │    │    │  Webhook FAIL  │
     │  (signature   │    │    │  (timeout,     │
     │   valid)      │    │    │   network)     │
     └────────┬──────┘    │    └───────┬────────┘
              │            │            │
              │     ┌──────▼──────┐     │
              │     │   Polling   │     │
              │     │   Worker    │◄────┘
              │     │  (backup)   │
              │     └──────┬──────┘
              │            │
              ├────────────┤
              │            │
     ┌────────▼──────┐   ┌▼──────────────┐
     │  CONFIRMED    │   │    FAILED     │
     │  ───────────  │   │  ───────────  │
     │  • Allocate   │   │  • Log error  │
     │  • Receipt    │   │  • Notify     │
     │  • Notify     │   │    admin      │
     └───────────────┘   └──────────────┘
              │
              │ (si erreur détectée)
              │
     ┌────────▼──────┐
     │  REVERSED     │
     │  ───────────  │
     │  • New txn    │
     │    (negative) │
     │  • Deallocate │
     └───────────────┘
```

#### 4.5.2 Vérification de Signature Webhook

Chaque agrégateur signe ses webhooks différemment. Le système implémente un **adaptateur par provider** :

```typescript
// webhooks/signature-verifier.ts
import crypto from 'crypto';

interface WebhookVerifier {
  verify(payload: string, signature: string, secret: string): boolean;
}

const verifiers: Record<string, WebhookVerifier> = {
  
  // Paystack: HMAC-SHA512
  PAYSTACK: {
    verify(payload, signature, secret) {
      const hash = crypto
        .createHmac('sha512', secret)
        .update(payload)
        .digest('hex');
      return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(signature)
      );
    },
  },
  
  // Flutterwave: HMAC-SHA256 + verif-hash header
  FLUTTERWAVE: {
    verify(payload, signature, secret) {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(secret) // Flutterwave uses secret directly as hash
      );
    },
  },
  
  // CinetPay: IP whitelist + API verification
  CINETPAY: {
    verify(payload, signature, secret) {
      // CinetPay recommends API re-verification rather than signature
      // We whitelist IPs and re-verify via GET /check
      return true; // Verified via IP + re-verification call
    },
  },
  
  // Wave: HMAC-SHA256
  WAVE: {
    verify(payload, signature, secret) {
      const hash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(signature)
      );
    },
  },
};

export function verifyWebhookSignature(
  provider: string,
  payload: string,
  signature: string,
  secret: string
): boolean {
  const verifier = verifiers[provider];
  if (!verifier) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return verifier.verify(payload, signature, secret);
}
```

#### 4.5.3 Idempotence via `reference_code`

```typescript
// services/payment.ts
export async function processWebhookPayment(
  event: WebhookEvent
): Promise<void> {
  const { referenceCode, amount, providerReference } = event;
  
  // 1. Idempotence check — le reference_code est UNIQUE dans la DB
  const existingTxn = await db.query.transactions.findFirst({
    where: (t, { eq }) => eq(t.referenceCode, referenceCode),
  });
  
  if (!existingTxn) {
    // Transaction non trouvée — webhook invalide ou orphelin
    logger.warn('Webhook received for unknown reference', { referenceCode });
    return;
  }
  
  if (existingTxn.status === 'CONFIRMED') {
    // Déjà confirmé — idempotence : on ne fait rien
    logger.info('Duplicate webhook ignored', { referenceCode });
    return;
  }
  
  if (existingTxn.status !== 'PENDING') {
    // Statut inattendu
    logger.error('Webhook for non-pending transaction', {
      referenceCode,
      currentStatus: existingTxn.status,
    });
    return;
  }
  
  // 2. Vérification du montant (anti-tampering)
  if (existingTxn.amount !== amount) {
    logger.error('Amount mismatch in webhook', {
      referenceCode,
      expected: existingTxn.amount,
      received: amount,
    });
    await updateTransactionStatus(existingTxn.id, 'FAILED');
    return;
  }
  
  // 3. Confirmer la transaction
  await db.transaction(async (tx) => {
    // Update status (le trigger autorise PENDING → CONFIRMED)
    await tx
      .update(transactions)
      .set({
        status: 'CONFIRMED',
        providerReference,
        confirmedAt: new Date(),
      })
      .where(eq(transactions.id, existingTxn.id));
    
    // 4. Allocation FIFO
    await allocatePaymentFIFO(tx, existingTxn);
    
    // 5. Queue receipt generation
    await receiptQueue.add('generate', {
      transactionId: existingTxn.id,
    });
    
    // 6. Queue parent notification
    await notificationQueue.add('payment-confirmed', {
      transactionId: existingTxn.id,
      studentId: existingTxn.studentId,
    });
  });
}
```

#### 4.5.4 Queue & Worker Architecture (BullMQ + Redis)

```typescript
// workers/setup.ts
import { Queue, Worker, QueueScheduler } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL!);

// ── Queues ──────────────────────────────────────────────────

export const paymentQueue = new Queue('payment', {
  connection,
  defaultJobOptions: {
    removeOnComplete: { age: 7 * 24 * 3600 },  // 7 jours
    removeOnFail: { age: 30 * 24 * 3600 },     // 30 jours
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000,  // 5s, 10s, 20s, 40s, 80s
    },
  },
});

export const receiptQueue = new Queue('receipt', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 },
  },
});

export const notificationQueue = new Queue('notification', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 10000 },
  },
});

export const importQueue = new Queue('import', {
  connection,
  defaultJobOptions: {
    attempts: 1,  // Pas de retry sur les imports
  },
});

// ── Workers ─────────────────────────────────────────────────

// Payment Polling Worker
const pollingWorker = new Worker(
  'payment-polling',
  async (job) => {
    const { transactionId } = job.data;
    await pollPaymentStatus(transactionId);
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,  // 10 req/s max vers les agrégateurs
    },
  }
);

// Receipt Generation Worker
const receiptWorker = new Worker(
  'receipt',
  async (job) => {
    const { transactionId } = job.data;
    await generateReceipt(transactionId);
  },
  {
    connection,
    concurrency: 3,
  }
);

// Notification Worker
const notificationWorker = new Worker(
  'notification',
  async (job) => {
    const { type, ...data } = job.data;
    switch (type) {
      case 'payment-confirmed':
        await sendPaymentConfirmation(data);
        break;
      case 'overdue-reminder':
        await sendOverdueReminder(data);
        break;
      case 'pre-due-reminder':
        await sendPreDueReminder(data);
        break;
    }
  },
  {
    connection,
    concurrency: 10,
    limiter: {
      max: 30,
      duration: 1000,  // 30 notifs/s (WhatsApp rate limit)
    },
  }
);

// ── Scheduled Jobs (CRON) ───────────────────────────────────

// Polling des paiements PENDING toutes les 2 minutes
paymentQueue.add(
  'poll-pending',
  {},
  {
    repeat: { pattern: '*/2 * * * *' },
    jobId: 'poll-pending-cron',
  }
);

// Relances d'impayés quotidiennes à 9h UTC
notificationQueue.add(
  'daily-reminders',
  {},
  {
    repeat: { pattern: '0 9 * * *' },
    jobId: 'daily-reminders-cron',
  }
);

// Résumé de caisse quotidien à 20h UTC
paymentQueue.add(
  'daily-summary',
  {},
  {
    repeat: { pattern: '0 20 * * *' },
    jobId: 'daily-summary-cron',
  }
);
```

#### 4.5.5 Dead Letter Queue & Alerting

```typescript
// workers/dead-letter.ts

// Quand un job échoue après toutes ses tentatives,
// il est envoyé dans la Dead Letter Queue (DLQ)

paymentQueue.on('failed', async (job, error) => {
  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    // Job définitivement échoué → DLQ
    logger.error('Job permanently failed — sent to DLQ', {
      queue: 'payment',
      jobId: job.id,
      data: job.data,
      error: error.message,
      attempts: job.attemptsMade,
    });
    
    // Alerte Slack / Email pour l'équipe ops
    await sendOpsAlert({
      severity: 'HIGH',
      title: `Payment job failed: ${job.id}`,
      details: {
        transactionId: job.data.transactionId,
        error: error.message,
        attempts: job.attemptsMade,
      },
    });
  }
});
```

#### 4.5.6 Allocation FIFO — Implémentation

```typescript
// services/allocation.ts
import { eq, asc } from 'drizzle-orm';

export async function allocatePaymentFIFO(
  tx: Transaction,
  txn: TransactionRecord
): Promise<void> {
  // Récupérer les tranches de l'élève, ordonnées par sort_order (FIFO)
  const installments = await tx.query.studentFeePlanInstallments.findMany({
    where: (i, { and, eq, lt }) => and(
      eq(i.studentFeePlanId, txn.studentFeePlanId!),
      // Ne pas allouer aux tranches déjà payées ou annulées
      lt(i.amountPaid, i.amount)
    ),
    orderBy: (i) => [asc(i.sortOrder), asc(i.dueDate)],
  });
  
  let remaining = txn.amount;
  
  for (const installment of installments) {
    if (remaining <= 0) break;
    
    const due = installment.amount - installment.amountPaid;
    const allocated = Math.min(remaining, due);
    
    // Créer l'allocation
    await tx.insert(transactionAllocations).values({
      transactionId: txn.id,
      studentFeePlanInstallmentId: installment.id,
      schoolId: txn.schoolId,
      amount: allocated,
    });
    
    // Mettre à jour le montant payé de la tranche
    const newAmountPaid = installment.amountPaid + allocated;
    const newStatus = newAmountPaid >= installment.amount ? 'PAID' : 'PARTIAL';
    
    await tx
      .update(studentFeePlanInstallments)
      .set({
        amountPaid: newAmountPaid,
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(studentFeePlanInstallments.id, installment.id));
    
    remaining -= allocated;
  }
  
  // Mettre à jour le cache amount_paid du StudentFeePlan
  await tx.execute(sql`
    UPDATE student_fee_plans
    SET amount_paid = (
      SELECT COALESCE(SUM(amount_paid), 0)
      FROM student_fee_plan_installments
      WHERE student_fee_plan_id = ${txn.studentFeePlanId}
    ),
    updated_at = NOW()
    WHERE id = ${txn.studentFeePlanId}
  `);
  
  // Si remaining > 0 → trop-perçu, loguer pour traitement manuel
  if (remaining > 0) {
    logger.warn('Overpayment detected', {
      transactionId: txn.id,
      studentId: txn.studentId,
      overpaymentAmount: remaining,
    });
  }
}
```

---

## 5. Module de Financement & Scoring (Financial Enablement)

### 5.1 Vision & Objectifs
L'objectif de ce module est de transformer les données de recouvrement (Mobile Money et Cash) en un véritable **actif financier** pour l'école. En certifiant l'historique de trésorerie, la plateforme permet de calculer un score de crédit fiable, facilitant ainsi l'accès à des micro-crédits ou avances de trésorerie via nos partenaires financiers.

### 5.2 Définition des Indicateurs Clés (KPIs) Financiers
Le système agrège les données transactionnelles immuables du Ledger pour calculer en temps réel les KPIs suivants par établissement :

*   **Taux de recouvrement global (%) :** Ratio entre les montants encaissés et le total des tranches échues.
*   **Régularité des flux Mobile Money :** Fréquence et volume des paiements digitaux par rapport aux paiements en espèces (les flux digitaux étant considérés comme plus sécurisés et traçables par les prêteurs).
*   **Volatilité des impayés :** Écart-type des retards de paiement mois par mois, mesurant la prévisibilité des flux de trésorerie.
*   **Volume annuel certifié :** Chiffre d'affaires total de l'établissement réconcilié et tracé sur la plateforme sur une année scolaire complète.

### 5.3 Algorithme de Financial Scoring (Grade A à F)
Basé sur les KPIs ci-dessus, un moteur de règles calcule un **Score d'Éligibilité Crédit** pour chaque établissement. Ce score est recalculé mensuellement.

*   **Grade A (Excellent) :** Taux de recouvrement > 95%, > 60% de paiements Mobile Money, Volatilité faible. Éligible aux montants maximaux et meilleurs taux.
*   **Grade B (Très Bon) :** Taux de recouvrement > 85%, historique certifié sur au moins 6 mois. Éligible aux avances de trésorerie standards.
*   **Grade C (Bon) :** Taux de recouvrement > 75%, avec un volume de transactions digitaux en croissance. Éligible aux micro-prêts court terme.
*   **Grade D à F (Risqué) :** Taux de recouvrement < 75% ou historique insuffisant (< 3 mois). Accès au crédit restreint ou conditionné à une période d'observation.

---

## 6. Workflow d'Avance de Trésorerie (Spécifications Métier)

### 6.1 Processus de Retenue à la Source (Split Payment)
Lorsqu'un crédit est octroyé à une école par un partenaire financier, le remboursement s'effectue de manière indolore et automatique via une retenue à la source sur les flux digitaux (Mobile Money/Cartes).

**Workflow de remboursement :**
1.  **Octroi du Prêt :** Le partenaire valide le prêt via le profil de crédit de l'école. Les conditions (ex: 15% de retenue) sont enregistrées dans `CreditApplication`.
2.  **Paiement Parent :** Un parent paie 100 000 FCFA via Wave.
3.  **Split Automatique (Routing) :**
    *   L'API de paiement (ex: Paystack/CinetPay) ou le backend de Payskool route **15% (15 000 FCFA)** vers le wallet du partenaire financier (Remboursement).
    *   Les **85% restants (85 000 FCFA)** sont transférés sur le compte marchand de l'école.
4.  **Réconciliation Ledger :** La transaction parente est enregistrée intégralement (100 000 FCFA alloués à la scolarité de l'élève). Une `RepaymentTransaction` parallèle de -15 000 FCFA est générée pour imputer le solde du prêt de l'école.

---

## 7. Impact sur le Schéma de Données (Prisma Schema Data Models)

Pour supporter le module de financement sans altérer le Ledger existant, de nouvelles entités isolées sont introduites :

```prisma
// Profil financier et scoring d'un établissement
model CreditProfile {
  id                String   @id @default(uuid())
  schoolId          String   @unique
  school            School   @relation(fields: [schoolId], references: [id])
  
  recoveryRate      Float    // ex: 92.5
  digitalRatio      Float    // ex: 65.0 (% de Mobile Money)
  certifiedVolume   BigInt   // Volume total en centimes
  creditScore       String   // Grade: 'A', 'B', 'C', 'D', 'E', 'F'
  
  lastCalculatedAt  DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

// Demande et contrat de prêt avec un partenaire
model CreditApplication {
  id                String   @id @default(uuid())
  schoolId          String
  school            School   @relation(fields: [schoolId], references: [id])
  partnerId         String   // ID de l'institution financière
  
  status            CreditStatus @default(PENDING) // PENDING, APPROVED, ACTIVE, COMPLETED, DEFAULTED
  requestedAmount   BigInt
  approvedAmount    BigInt?
  
  splitPercentage   Float?   // % de retenue sur les flux digitaux (ex: 15.0)
  totalRepaid       BigInt   @default(0)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  repayments        RepaymentTransaction[]
}

// Historique immuable des remboursements automatiques
model RepaymentTransaction {
  id                  String   @id @default(uuid())
  creditApplicationId String
  creditApplication   CreditApplication @relation(fields: [creditApplicationId], references: [id])
  
  parentTransactionId String   // Lien vers la transaction de scolarité originale
  amount              BigInt   // Montant prélevé (ex: 15% du parentTransaction)
  status              RepaymentStatus @default(COMPLETED)
  
  createdAt           DateTime @default(now())
}
```

---

## 8. Matrice des Rôles & Permissions (RBAC) - Financement

La sécurité des données financières est critique. Les accès au module de financement suivent le principe de moindre privilège :

| Rôle | Accès Module Financement | Description des privilèges |
| :--- | :--- | :--- |
| **`PROMOTER`** (Owner) | **Complet (Lecture/Écriture)** | Peut consulter le `CreditProfile`, le Score (A-F) de ses écoles, simuler des demandes d'avances, accepter les conditions de `splitPercentage`, et visualiser l'historique des remboursements (`RepaymentTransaction`). |
| **`SCHOOL_ADMIN`** | **Lecture Seule (Optionnel)** | Selon configuration du Workspace, peut consulter le taux de recouvrement et le score pour pilotage, mais ne peut initier ou signer une demande de crédit. |
| **`CASHIER`** | **Aucun Accès** | Accès strictement limité au guichet d'encaissement et à la recherche d'élèves. Totale opacité sur le scoring, les prêts en cours et les retenues à la source. |
| **`PLATFORM_SUPERADMIN`** | **Gestion & Exports** | Supervision globale du risque (Risk Management). Gestion des exports financiers anonymisés ou spécifiques pour les organismes prêteurs (Partenaires de microfinance). Ne peut pas modifier les scores (calculés par algo). |

---

## 9. Annexes

### 9.1 Endpoints API — Vue d'Ensemble

| Méthode | Endpoint | Description | Auth | Rôle Min |
|---|---|---|---|---|
| **Auth** | | | | |
| `POST` | `/api/auth/register` | Inscription promoteur | ❌ | — |
| `POST` | `/api/auth/login` | Connexion email/password | ❌ | — |
| `POST` | `/api/auth/otp/send` | Envoi OTP parent | ❌ | — |
| `POST` | `/api/auth/otp/verify` | Vérification OTP | ❌ | — |
| `POST` | `/api/auth/refresh` | Rafraîchir le token | ✅ | — |
| **Workspaces** | | | | |
| `GET` | `/api/workspaces` | Liste des workspaces | ✅ | OWNER |
| `POST` | `/api/workspaces` | Créer un workspace | ✅ | — |
| `PATCH` | `/api/workspaces/:id` | Modifier un workspace | ✅ | OWNER |
| **Schools** | | | | |
| `GET` | `/api/schools` | Liste des écoles (du workspace) | ✅ | CASHIER |
| `POST` | `/api/schools` | Créer une école | ✅ | OWNER |
| `GET` | `/api/schools/:id` | Détail d'une école | ✅ | CASHIER |
| `PATCH` | `/api/schools/:id` | Modifier une école | ✅ | SCHOOL_ADMIN |
| `PUT` | `/api/schools/:id/payment-config` | Configurer les paiements | ✅ | SCHOOL_ADMIN |
| **Members** | | | | |
| `GET` | `/api/members` | Liste des membres | ✅ | SCHOOL_ADMIN |
| `POST` | `/api/invitations` | Inviter un membre | ✅ | SCHOOL_ADMIN |
| `POST` | `/api/invitations/:token/accept` | Accepter une invitation | ❌ | — |
| `DELETE` | `/api/members/:id` | Révoquer un membre | ✅ | SCHOOL_ADMIN |
| **Students** | | | | |
| `GET` | `/api/students` | Liste des élèves | ✅ | CASHIER |
| `POST` | `/api/students` | Créer un élève | ✅ | SCHOOL_ADMIN |
| `GET` | `/api/students/:id` | Détail d'un élève | ✅ | CASHIER |
| `PATCH` | `/api/students/:id` | Modifier un élève | ✅ | SCHOOL_ADMIN |
| `GET` | `/api/students/:id/balance` | Solde d'un élève | ✅ | CASHIER |
| `POST` | `/api/students/import` | Import CSV/Excel | ✅ | SCHOOL_ADMIN |
| **Fee Engine** | | | | |
| `GET` | `/api/fee-structures` | Liste des grilles | ✅ | CASHIER |
| `POST` | `/api/fee-structures` | Créer une grille | ✅ | SCHOOL_ADMIN |
| `POST` | `/api/fee-structures/:id/apply` | Appliquer aux élèves | ✅ | SCHOOL_ADMIN |
| `POST` | `/api/student-fee-plans/:id/discount` | Appliquer une réduction | ✅ | SCHOOL_ADMIN |
| **Transactions** | | | | |
| `GET` | `/api/transactions` | Liste des transactions | ✅ | CASHIER |
| `POST` | `/api/transactions/cash` | Paiement cash/chèque | ✅ | CASHIER |
| `POST` | `/api/transactions/online/init` | Initialiser paiement en ligne | ✅ | PARENT |
| `GET` | `/api/transactions/:id` | Détail d'une transaction | ✅ | CASHIER |
| `POST` | `/api/transactions/:id/reverse` | Annuler (reversal) | ✅ | SCHOOL_ADMIN |
| **Webhooks** | | | | |
| `POST` | `/api/webhooks/paystack` | Webhook Paystack | ❌* | — |
| `POST` | `/api/webhooks/flutterwave` | Webhook Flutterwave | ❌* | — |
| `POST` | `/api/webhooks/cinetpay` | Webhook CinetPay | ❌* | — |
| `POST` | `/api/webhooks/wave` | Webhook Wave | ❌* | — |
| `POST` | `/api/webhooks/orange` | Webhook Orange Money | ❌* | — |
| `POST` | `/api/webhooks/mtn` | Webhook MTN MoMo | ❌* | — |
| **Receipts** | | | | |
| `GET` | `/api/receipts/:id/pdf` | Télécharger le reçu PDF | ✅ | CASHIER |
| `GET` | `/api/verify/:receiptId` | Vérifier un reçu (public) | ❌ | — |
| **Reports** | | | | |
| `GET` | `/api/reports/dashboard` | KPIs du dashboard | ✅ | SCHOOL_ADMIN |
| `GET` | `/api/reports/daily-summary` | Résumé de caisse | ✅ | CASHIER |
| `GET` | `/api/reports/overdue` | Élèves en impayé | ✅ | SCHOOL_ADMIN |
| `GET` | `/api/reports/export` | Export comptable (CSV) | ✅ | SCHOOL_ADMIN |
| **Parent Portal** | | | | |
| `GET` | `/api/parent/children` | Liste des enfants du parent | ✅ | PARENT |
| `GET` | `/api/parent/children/:id/balance` | Solde d'un enfant | ✅ | PARENT |
| `GET` | `/api/parent/payments` | Historique de paiements | ✅ | PARENT |

> **❌*** : Pas d'auth JWT — sécurisé par signature webhook + IP whitelist

### 5.2 KPIs Dashboard Admin

| KPI | Calcul | Visualisation |
|---|---|---|
| **Taux de recouvrement** | `Σ payé / Σ dû × 100` | Jauge circulaire (%) |
| **Montant total encaissé** | `Σ transactions CONFIRMED` | Nombre + sparkline |
| **Montant total dû** | `Σ net_amount des StudentFeePlans` | Nombre |
| **Impayés** | `Σ (net_amount - amount_paid) WHERE overdue` | Nombre en rouge |
| **Élèves à jour** | `COUNT WHERE status = FULLY_PAID` | Nombre + % |
| **Élèves en retard** | `COUNT WHERE status = OVERDUE` | Nombre + % |
| **Encaissements du jour** | `Σ transactions WHERE today` | Nombre |
| **Répartition par canal** | `GROUP BY channel` | Donut chart |
| **Évolution mensuelle** | `GROUP BY month` | Bar chart |
| **Top 10 impayés** | `ORDER BY remaining_balance DESC LIMIT 10` | Table |

### 5.3 Sécurité — Checklist

| Mesure | Implémentation |
|---|---|
| Chiffrement at-rest (API keys) | AES-256-GCM via `pgcrypto`, clé dans env var |
| Chiffrement in-transit | TLS 1.3 obligatoire (HTTPS) |
| Hachage mots de passe | Argon2id (coût mémoire: 64 Mo, itérations: 3) |
| Rate limiting | Fastify rate-limit: 100 req/min/IP (auth), 10 req/min/IP (OTP) |
| CORS | Whitelist stricte des domaines app.payskool.africa |
| CSP | Content-Security-Policy strict (no inline scripts) |
| SQL Injection | ORM (Drizzle) — requêtes paramétrées uniquement |
| XSS | React (auto-escape) + CSP |
| CSRF | SameSite=Strict cookies + JWT Bearer |
| Webhook replay | Idempotence + timestamp validation (rejeter si > 5min) |
| Brute force OTP | Rate limit + blocage 15min après 3 échecs |
| Audit trail | Toutes les actions sensibles loguées dans `audit_logs` |
| Data isolation | RLS PostgreSQL + middleware tenant |
| Secret management | Variables d'environnement (jamais dans le code) |
| Dependency scanning | Snyk / npm audit en CI |

### 5.4 Plan de Facturation SaaS (Pricing)

| Plan | Prix/mois | Écoles | Élèves | Fonctionnalités |
|---|---|---|---|---|
| **Trial** | Gratuit (30j) | 1 | 50 | Caisse cash, reçus, 1 admin |
| **Starter** | 15 000 XOF (~$24) | 1 | 300 | + Mobile Money, relances SMS |
| **Pro** | 35 000 XOF (~$56) | 3 | 1 000 | + WhatsApp, analytics, multi-admin |
| **Enterprise** | Sur devis | Illimité | Illimité | + API, SSO, support dédié, SLA |

---

> **Document généré le 31 Juillet 2026 — Version 1.0**
> **Prochaines étapes :** Validation fonctionnelle → Prototypage UI (Figma) → Sprint 0 (scaffolding monorepo) → MVP en 12 semaines.
