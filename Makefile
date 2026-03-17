# ============================================================================
# better-starter Makefile
# Local development only — not used in production.
# All pnpm commands run inside next-app/ via --dir flag.
# ============================================================================

APP_DIR     := next-app
PNPM        := pnpm --dir $(APP_DIR)
COMPOSE     := docker compose -f docker-compose.local.yml

.DEFAULT_GOAL := help

# ----------------------------------------------------------------------------
# Development
# ----------------------------------------------------------------------------

.PHONY: dev
dev: db-up db-wait ## Start dev server (Turbopack)
	$(PNPM) dev

.PHONY: build
build: ## Production build (standalone output)
	$(PNPM) build

.PHONY: start
start: ## Start production server
	$(PNPM) start

# ----------------------------------------------------------------------------
# Code Quality
# ----------------------------------------------------------------------------

.PHONY: lint
lint: ## Run ESLint
	$(PNPM) lint

.PHONY: lint-fix
lint-fix: ## Run ESLint with auto-fix
	$(PNPM) lint:fix

.PHONY: format
format: ## Prettier write
	$(PNPM) format

.PHONY: format-check
format-check: ## Prettier check (CI uses this)
	$(PNPM) format:check

# ----------------------------------------------------------------------------
# Database — Drizzle
# ----------------------------------------------------------------------------

.PHONY: db-generate
db-generate: ## Generate Drizzle migration files
	$(PNPM) db:generate

.PHONY: db-migrate
db-migrate: ## Run Drizzle migrations
	$(PNPM) db:migrate

.PHONY: db-push
db-push: ## Push schema directly (no migration file)
	$(PNPM) db:push

.PHONY: db-studio
db-studio: ## Open Drizzle Studio
	$(PNPM) db:studio

# ----------------------------------------------------------------------------
# Docker — Local PostgreSQL
# ----------------------------------------------------------------------------

.PHONY: db-up
db-up: ## Start local PostgreSQL container
	$(COMPOSE) up -d

.PHONY: db-down
db-down: ## Stop local PostgreSQL container
	$(COMPOSE) down

.PHONY: db-logs
db-logs: ## Tail PostgreSQL container logs
	$(COMPOSE) logs -f postgres

.PHONY: db-wait
db-wait: ## Wait for PostgreSQL to accept connections
	@echo "Waiting for PostgreSQL to be ready..."
	@until docker exec local_postgres pg_isready -U user -d betterstarter > /dev/null 2>&1; do \
		sleep 1; \
	done
	@echo "PostgreSQL is ready."

# ----------------------------------------------------------------------------
# Dependencies
# ----------------------------------------------------------------------------

.PHONY: install
install: ## Install pnpm dependencies
	$(PNPM) install

# ----------------------------------------------------------------------------
# Compound / Convenience
# ----------------------------------------------------------------------------

.PHONY: setup
setup: db-up install db-wait db-migrate ## Full local setup: DB + deps + migrations
	@echo "Setup complete. Run 'make dev' to start the dev server."

# ----------------------------------------------------------------------------
# Help
# ----------------------------------------------------------------------------

.PHONY: help
help: ## Show available make targets
	@printf "\n\033[1mUsage:\033[0m make <target>\n\n"
	@printf "\033[1m%-20s %s\033[0m\n" "Target" "Description"
	@printf "%-20s %s\n" "------" "-----------"
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*## "}; {printf "%-20s %s\n", $$1, $$2}'
	@printf "\n"
