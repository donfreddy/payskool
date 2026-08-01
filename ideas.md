Tu vas agir comme un Architecte Logiciel Senior et un Product Manager Expert SaaS. Je souhaite concevoir le Cahier des Charges Fonctionnel et Technique (BRD / PRD) complet pour une plateforme SaaS de PayTech éducative (SaaS de gestion du recouvrement de la scolarité) destinée au marché africain.

---

### 1. CONTEXTE & VISION DU PROJET
- **Nature du produit :** Ce n'est PAS un ERP scolaire ni un système de gestion des bulletins/notes. C'est un SaaS de PayTech/Fintech dédié au suivi financier, au recouvrement des scolarités et à la gestion des caisses d'établissements scolaires (maternelle, primaire, secondaire).
- **Enjeu principal :** Digitaliser et automatiser le suivi des paiements (cash, Mobile Money), éliminer les impayés et les fraudes de caisse, et offrir une expérience parent sans friction.
- **Topologie des applications :**
  1. Dashboard Web Admin / Promoteur (Desktop)
  2. Interface Web / App Mobile Caissier (Saisie rapide & Guichet)
  3. PWA / Portail Parent Mobile-First (Consultation & Paiement distant)
- **Modèle Multi-tenant & Workspaces :** Structure type Slack/Teams. Un Promoteur peut posséder un "Workspace" regroupant plusieurs écoles (établissements) et switcher de l'une à l'autre sans changer de compte.
- **Stratégie financière :** Pure SaaS technologique (aucune collecte pour compte de tiers / pas de gestion de fonds). Les écoles intègrent leurs propres clés d'API d'agrégateurs de paiement (Paystack, Flutterwave, CinetPay, Wave, Orange, MTN). Flux 100% automatisé via Webhooks HTTP.

---

### 2. CE QUE TU DOIS PRODUIRE
Génère un Cahier des Charges ultra-détaillé et structuré sous forme de document Markdown prêt à l'emploi. Le document doit contenir les sections suivantes :

#### A. Spécifications Fonctionnelles Détaillées (Scope & Workflows)
1. **Gestion des Workspaces & Multi-tenancy :**
   - Inscription Promoteur, création des établissements (écoles), invitations d'administrateurs/caissiers, mécanique du header `X-School-Id` et switching d'école.
2. **Gestion Administrative Minimale :**
   - Modélisation de l'élève (données financières et tuteurs uniquement).
   - Module d'importation Excel/CSV intelligent avec mapping dynamique de colonnes et reprise d'historique (solde antérieur / avances).
3. **Moteur d'Échéanciers & Tarification (Fee Engine) :**
   - Configuration des grilles tarifaires par classe/niveau, gestion des tranches/échéances, gestion des bourses/réductions individuelles (`StudentFeePlan`).
4. **Gestion des Caisses & Paiements (Ledger Immuable) :**
   - Saisie Caisse (Cash/Chèque) avec verrouillage audit log (Append-only / aucun `UPDATE`/`DELETE` direct sur les transactions).
   - Paiement en ligne Parent via Mobile Money avec Webhooks, idempotence et mécanismes de polling de secours.
   - Génération automatique des reçus PDF sécurisés avec QR Code.
5. **Portail Parent (Zero-Friction Onboarding) :**
   - Authentification Passwordless via OTP (SMS / WhatsApp).
   - Vue consolidée multi-enfants (même si dans des écoles différentes).
   - Paiement en 1-click via deep-links Mobile Money.
6. **Module de Communication & Notifications :**
   - Relances automatiques d'impayés et envoi de reçus via WhatsApp Business API / SMS.

#### B. Spécifications Techniques & Architecture
1. **Architecture Globale & Topologie :**
   - Diagramme logique de l'écosystème (Frontend SPA/PWA, Backend API REST/GraphQL, Workers asynchrones, Database, Aggregators).
2. **Modèle de Données Relationnel (Database Schema PostgreSQL) :**
   - Fournis l'ensemble du schéma DDL SQL complet (tables, clés primaires/étrangères, contraintes d'unicité, indexations clés).
   - Inclure obligatoirement les entités : `schools`, `users`, `memberships`, `students`, `parent_students`, `fee_structures`, `fee_installments`, `student_fee_plans`, `transactions`, `payment_webhook_logs`, `notification_logs`.
3. **Matrice de Sécurité & Droits (RBAC Matrix) :**
   - Tableau croisé des fonctionnalités vs Rôles (`SUPER_ADMIN`, `OWNER`, `SCHOOL_ADMIN`, `CASHIER`, `PARENT`).
4. **Stratégie d'Isolation Multi-tenant (Row-Level Security / Discriminator Column) :**
   - Explication de la mise en œuvre de la colonne `school_id` et sécurisation des requêtes.
5. **Fiabilité des Transactions Financières (Resilience Patterns) :**
   - Spécification de la gestion des Webhooks (Vérification de signature, Idempotence via `reference_code`, Queue / Worker Redis avec BullMQ).

---

### 3. DIRECTIVES DE STYLE DE RÉPONSE
- Sois direct, technique et exhaustif. Ne résume pas à l'excès.
- Liste pour chaque choix technique majeur un avantage et un inconvénient (ex: Isolation par RLS vs Silo BDD).
- Produis un document propre, structuré avec des titres, des tableaux et du code SQL valide.
