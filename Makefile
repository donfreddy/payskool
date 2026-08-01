# ==============================================================================
#  PAYSKOOL — Monorepo Makefile
#  Usage: make <target>
#  Requirements: node >=20, pnpm >=9, docker (for DB targets)
# ==============================================================================

# ── Colours ────────────────────────────────────────────────────────────────────
BOLD   := \033[1m
RESET  := \033[0m
CYAN   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RED    := \033[31m

# ── pnpm filter shortcuts ──────────────────────────────────────────────────────
PNPM   := pnpm
TURBO  := pnpm turbo
FILTER := $(PNPM) --filter
PRISMA := $(FILTER) @payskool/db prisma

# ── Default target ─────────────────────────────────────────────────────────────
.DEFAULT_GOAL := help

# Mark all non-file targets as phony
.PHONY: help \
        install install-frozen \
        dev dev-api dev-marketing dev-platform dev-school dev-parent \
        build build-api build-marketing build-platform build-school build-parent \
        start-api \
        lint lint-fix format format-check \
        typecheck \
        test test-api test-api-watch test-api-cov test-api-e2e \
        db-generate db-push db-migrate db-migrate-prod db-studio db-seed db-reset \
        clean clean-dist nuke \
        check ci \
        env-check

# ==============================================================================
#  HELP
# ==============================================================================

help: ## Show this help message
	@printf "\n$(BOLD)$(CYAN)PAYSKOOL Monorepo$(RESET) — available targets:\n\n"
	@awk 'BEGIN {FS = ":.*##"} \
	     /^[a-zA-Z_-]+:.*##/ { printf "  $(GREEN)%-22s$(RESET) %s\n", $$1, $$2 } \
	     /^##/ { printf "\n  $(BOLD)%s$(RESET)\n", substr($$0, 4) }' $(MAKEFILE_LIST)
	@printf "\n"

# ==============================================================================
#  INSTALL
# ==============================================================================

## Install

install: ## Install all dependencies
	@printf "$(BOLD)Installing dependencies...$(RESET)\n"
	$(PNPM) install

install-frozen: ## Install with frozen lockfile (CI-safe)
	$(PNPM) install --frozen-lockfile

# ==============================================================================
#  DEV SERVERS
# ==============================================================================

## Development

dev: ## Start all apps in parallel (via Turbo)
	$(TURBO) run dev

dev-api: ## Start NestJS API in watch mode
	$(FILTER) api pnpm start:dev

dev-marketing: ## Start marketing Next.js app
	$(FILTER) marketing pnpm dev

dev-platform: ## Start platform Next.js app
	$(FILTER) platform pnpm dev

dev-school: ## Start school Next.js app
	$(FILTER) school pnpm dev

dev-parent: ## Start parent Vite app
	$(FILTER) parent pnpm dev

# ==============================================================================
#  BUILD
# ==============================================================================

## Build

build: ## Build all packages and apps (topological via Turbo)
	$(TURBO) run build

build-api: ## Build NestJS API only
	$(FILTER) api pnpm build

build-marketing: ## Build marketing app only
	$(FILTER) marketing pnpm build

build-platform: ## Build platform app only
	$(FILTER) platform pnpm build

build-school: ## Build school app only
	$(FILTER) school pnpm build

build-parent: ## Build parent Vite app only
	$(FILTER) parent pnpm build

# ==============================================================================
#  START (production)
# ==============================================================================

## Production

start-api: build-api ## Build then start NestJS API in production mode
	$(FILTER) api pnpm start:prod

# ==============================================================================
#  LINT & FORMAT
# ==============================================================================

## Code quality

lint: ## Run ESLint across the entire monorepo
	$(TURBO) run lint

lint-fix: ## Run ESLint with auto-fix
	$(TURBO) run lint:fix

format: ## Format all files with Prettier
	$(PNPM) run format

format-check: ## Check formatting without writing (CI)
	$(PNPM) run format:check

# ==============================================================================
#  TYPE CHECK
# ==============================================================================

typecheck: ## Run tsc --noEmit across all packages
	$(TURBO) run typecheck

# ==============================================================================
#  TESTS
# ==============================================================================

## Tests

test: test-api ## Run all tests

test-api: ## Run NestJS unit tests
	$(FILTER) api pnpm test

test-api-watch: ## Run NestJS tests in watch mode
	$(FILTER) api pnpm test:watch

test-api-cov: ## Run NestJS tests with coverage report
	$(FILTER) api pnpm test:cov

test-api-e2e: ## Run NestJS end-to-end tests
	$(FILTER) api pnpm test:e2e

# ==============================================================================
#  DATABASE (Prisma / @payskool/db)
# ==============================================================================

## Database

db-generate: ## Generate Prisma client from schema
	$(PRISMA) generate

db-push: ## Push schema changes to DB (dev only, no migration)
	$(PRISMA) db push

db-migrate: ## Create and apply a new dev migration
	@read -p "Migration name: " name; \
	$(PRISMA) migrate dev --name "$$name"

db-migrate-prod: ## Apply pending migrations (production)
	$(PRISMA) migrate deploy

db-studio: ## Open Prisma Studio in the browser
	$(PRISMA) studio

db-seed: ## Run database seed script
	$(FILTER) @payskool/db pnpm db:seed

db-reset: ## Reset DB and re-apply all migrations (⚠ destructive)
	@printf "$(RED)$(BOLD)⚠  This will drop and recreate your database!$(RESET)\n"
	@read -p "Type 'yes' to confirm: " confirm; \
	[ "$$confirm" = "yes" ] && $(PRISMA) migrate reset || echo "Aborted."

# ==============================================================================
#  CLEAN
# ==============================================================================

## Cleanup

clean: ## Remove build artefacts and Turbo cache
	$(TURBO) run clean
	rm -rf .turbo

clean-dist: ## Remove all dist/ folders (excludes node_modules)
	find . -type d -name dist \
	  -not -path '*/node_modules/*' \
	  -exec rm -rf {} + 2>/dev/null || true

nuke: clean clean-dist ## Full reset — clean + remove all node_modules
	@printf "$(YELLOW)Removing all node_modules...$(RESET)\n"
	find . -type d -name node_modules \
	  -not -path '*/node_modules/*/node_modules' \
	  -exec rm -rf {} + 2>/dev/null || true
	@printf "$(GREEN)Done. Run 'make install' to reinstall.$(RESET)\n"

# ==============================================================================
#  CI PIPELINE
# ==============================================================================

## CI / Release

check: format-check lint typecheck test ## Pre-commit gate (format + lint + types + tests)

ci: install-frozen format-check lint typecheck build test ## Full CI pipeline

# ==============================================================================
#  ENVIRONMENT
# ==============================================================================

env-check: ## Verify required tools and their versions
	@printf "$(BOLD)Checking environment...$(RESET)\n"
	@node   --version | xargs -I{} printf "  node    {}\n"
	@pnpm   --version | xargs -I{} printf "  pnpm    {}\n"
	@git    --version | xargs -I{} printf "  {}\n"
	@docker --version 2>/dev/null | xargs -I{} printf "  {}\n" \
	  || printf "  docker  $(YELLOW)not found$(RESET)\n"
	@printf "$(GREEN)All good.$(RESET)\n"
