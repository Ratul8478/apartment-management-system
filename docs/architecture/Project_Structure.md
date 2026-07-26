# Enterprise Project Structure & Root Directory Architecture Specification

## 1. Executive Summary & Architectural Vision

This document serves as the canonical enterprise architectural specification for the root project structure of **FinTrack Pro (Enterprise AI Finance Management System)**. Engineered to support **100+ software engineers** across multiple cross-functional feature teams (Frontend, Backend, AI/ML, DevOps, QA, Security, Mobile, Product), this repository layout enforces **Domain-Driven Design (DDD)**, **Clean Architecture**, **SOLID principles**, and **Dependency Inversion**.

This project structure guarantees that business rules remain completely decoupled from presentation frameworks, database engines, and external cloud infrastructure. It provides immediate readiness for future monorepo migration, microservices decomposition, white-label multi-tenancy, and third-party plugin extension.

---

## 2. Comprehensive Root Directory Architecture Map

```text
fintrack-pro-enterprise/
├── .agents/                 # AI Agent instructions, skill configurations, and workspace rules
├── .github/                 # GitHub Workflows (CI/CD), PR templates, CODEOWNERS, security policies
├── .vscode/                 # IDE workspace settings, recommended extensions, launch configurations
├── docs/                    # Centralized enterprise documentation repository
│   ├── api/                 # OpenAPI specs, REST endpoint contracts, error standards
│   ├── architecture/        # System architectural handbooks, layer rules, structural blueprints
│   ├── design-system/       # UI tokens, color scales, typography, component standards
│   ├── planning/            # Engineering roadmaps, ERDs, data dictionaries, migration plans
│   ├── setup/               # Developer onboarding, local environment specs, Docker guidelines
│   ├── standards/           # Coding guidelines, linting policies, threat modeling
│   └── ux/                  # Screen hierarchies, user flows, accessibility specifications
├── documents/               # Business specification PDFs, PRD addendums, feature tickets
├── prisma/                  # Prisma ORM schema, DB migration history, seed scripts
├── public/                  # Static public assets (brand SVGs, favicons, static images)
├── scripts/                 # Maintenance utilities, database backups, security audit scripts
├── src/                     # Core application source code (Clean Layered Architecture)
│   ├── app/                 # Next.js 15 App Router (Pages, layouts, API route handlers)
│   ├── components/          # React 19 visual UI components (Atomic UI & Feature modules)
│   ├── lib/                 # Cross-cutting utilities, export engines, security helpers
│   ├── server/              # Backend services, repository abstractions, domain logic (DDD)
│   └── types/               # TypeScript domain interfaces, API DTOs, enum contracts
├── tests/                   # End-to-End (E2E) & integration test suites (Playwright/Jest)
├── .editorconfig            # Cross-IDE indentation & line ending defaults
├── .env.example             # Template for required environment variables (Zero Secrets Policy)
├── .env.local               # Local environment override (Git-ignored)
├── .gitignore               # Git file exclusion rules
├── .prettierrc              # Prettier code formatting rules
├── docker-compose.yml       # Infrastructure orchestration (PostgreSQL 16 & Redis 7)
├── next.config.js           # Next.js framework configuration & header security
├── package.json             # Root dependency manifests & npm execution scripts
├── pnpm-lock.yaml           # Immutable package lockfile
├── postcss.config.js        # PostCSS configuration for Tailwind CSS compilation
├── tailwind.config.js       # Tailwind CSS design system token mapping
└── tsconfig.json            # Strict TypeScript compiler configuration & path aliases
```

---

## 3. Detailed Root Directory Specifications

### 1. `.agents/` (AI Assistant Rules & Prompt Configurations)
- **Engineering Purpose:** Houses workspace customization rules, AI skill definitions, prompt templates, and coding guidelines enforced by AI assistant agents (e.g., Google Antigravity, GitHub Copilot).
- **Files Allowed:** `AGENTS.md`, skill directories containing `SKILL.md`, agent instructions, and context metadata.
- **Allowed Accessing Layers:** Read-only by AI developer tooling and automated AI code review bots.
- **Forbidden Dependencies:** Application runtime code (`src/`) must NEVER import from `.agents/`.
- **Scalability & Technical Debt:** Standardizes AI generation patterns across 100+ engineers, ensuring AI-assisted code adheres strictly to team guidelines.
- **Future Expansion:** Supports automated AI agents for automated PR reviews, vulnerability scanning, and documentation generation.

### 2. `.github/` (CI/CD, Workflows & Engineering Governance)
- **Engineering Purpose:** Encapsulates Continuous Integration / Continuous Delivery (CI/CD) pipelines, pull request templates, issue forms, and explicit ownership mapping (`CODEOWNERS`).
- **Files Allowed:** `.github/workflows/*.yml`, `PULL_REQUEST_TEMPLATE.md`, `ISSUE_TEMPLATE/*.md`, `CODEOWNERS`.
- **Allowed Accessing Layers:** GitHub Action runners, Git hooks, automated release bots.
- **Forbidden Dependencies:** Application source code (`src/`) must NEVER depend on `.github/`.
- **Scalability & Technical Debt:** Enforces automated linting, type checks, build validation, and mandatory code owner sign-offs on every pull request.
- **Future Expansion:** Seamlessly scales to multi-environment deployment (Staging, Production, Multi-Region Cloud).

### 3. `.vscode/` (Developer Environment Standardization)
- **Engineering Purpose:** Standardizes text editor behavior, workspace settings, extension recommendations, and debug configurations across all developers.
- **Files Allowed:** `settings.json`, `extensions.json`, `launch.json`, `tasks.json`.
- **Allowed Accessing Layers:** VS Code IDE engine.
- **Forbidden Dependencies:** Zero runtime dependencies allowed.
- **Scalability & Technical Debt:** Eliminates "works on my machine" formatting and linting discrepancies across diverse development OS environments.

### 4. `docs/` (Centralized Architectural Documentation)
- **Engineering Purpose:** Single source of truth for engineering handbooks, architectural specs, API contracts, database schemas, and onboarding guides.
- **Files Allowed:** Markdown (`.md`) files organized into domain subdirectories (`api/`, `architecture/`, `design-system/`, `planning/`, `setup/`, `standards/`, `ux/`).
- **Allowed Accessing Layers:** All engineers, technical writers, security auditors, and onboarding team members.
- **Forbidden Dependencies:** Zero runtime code imports.
- **Scalability & Technical Debt:** Ensures architectural decisions are documented before implementation, preventing design decay over time.

### 5. `documents/` (PRDs & Product Specifications)
- **Engineering Purpose:** Stores business-level requirements, PRD addendums, feature tickets, and financial compliance documents.
- **Files Allowed:** Versioned PDF specifications, product diagrams, and specification revisions.
- **Allowed Accessing Layers:** Product Managers, Architects, Lead Engineers.
- **Forbidden Dependencies:** Zero runtime code imports.

### 6. `prisma/` (Database Persistence & Schema Definition)
- **Engineering Purpose:** Contains the Prisma ORM relational database schema, SQL migration scripts, database seed routines, and mock data generators.
- **Files Allowed:** `schema.prisma`, `migrations/*/migration.sql`, `seed.ts`.
- **Allowed Accessing Layers:** Accessed via `src/lib/prisma.ts` and server repositories (`src/server/repositories/`).
- **Forbidden Dependencies:** Presentation components (`src/components/`) and Client App Router pages MUST NEVER import Prisma schema or models directly.
- **Scalability & Technical Debt:** Isolates database migrations and structural DDL changes from business domain logic.

### 7. `public/` (Public Static Web Assets)
- **Engineering Purpose:** Serves uncompiled static visual assets, brand icons, site manifest files, and public fonts.
- **Files Allowed:** `.svg`, `.png`, `.jpg`, `.ico`, `manifest.json`, `robots.txt`.
- **Allowed Accessing Layers:** Next.js static asset server, web browser clients.
- **Forbidden Dependencies:** Business logic and private keys must NEVER reside in `public/`.

### 8. `scripts/` (Automated Operations & Maintenance Utilities)
- **Engineering Purpose:** Houses administrative maintenance scripts, database backup tools, seed automation, and security audit runners.
- **Files Allowed:** TypeScript/Node scripts (`.ts`), Shell scripts (`.sh`).
- **Allowed Accessing Layers:** DevOps, System Administrators, CI/CD automated job runners.
- **Forbidden Dependencies:** Client-side runtime code must NEVER import from `scripts/`.

### 9. `src/` (Core Application Source Code)
- **Engineering Purpose:** Houses 100% of application logic, structured cleanly into presentation (`app/`, `components/`), infrastructure (`lib/`), backend business logic (`server/`), and domain contract types (`types/`).
- **Files Allowed:** Clean TypeScript (`.ts`, `.tsx`) files following strict layer separation rules.
- **Allowed Accessing Layers:** Next.js compilation engine and runtime Node.js/Browser processes.
- **Forbidden Dependencies:** Must NEVER import test files or root build tools directly into application logic.

---

## 4. Root Layer Interaction & Scalability Summary

| Top-Level Directory | Primary Responsibility | Primary Consumer | Microservice Decomposition Readiness |
| :--- | :--- | :--- | :--- |
| `src/app` | Presentation & HTTP Orchestration | Client Browsers & API Clients | High (Decoupled Route Handlers) |
| `src/components` | Visual Component Rendering | Presentation Pages | Complete (Standalone UI Package) |
| `src/lib` | Cross-Cutting & Security Helpers | All Application Layers | Complete (Isolated Core Utilities) |
| `src/server` | Domain Business Rules & Data Access | Route Handlers & Worker Queues | **100% Ready** (Plug-and-play Microservice Core) |
| `src/types` | Enterprise Domain Contracts | All Codebase Modules | Complete (NPM Shared Package Ready) |
| `prisma/` | Data Storage Engine Mapping | Data Repositories | Ready (Database-per-Service Ready) |
| `docs/` | Architectural Single Source of Truth | Engineering & Product Teams | N/A (Repository Governance) |
