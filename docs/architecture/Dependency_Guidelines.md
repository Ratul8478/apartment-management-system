# Enterprise Dependency Guidelines & Boundary Enforcement

## 1. Executive Summary & Philosophy

Tightly coupled architectures degrade rapidly into unmaintainable "spaghetti code", making parallel development across 100+ engineers impossible, hindering microservices migration, and introducing severe regression risks. This document defines the strict, non-negotiable dependency rules governing interactions between presentation, business service, infrastructure, and repository data layers in **FinTrack Pro**.

---

## 2. Layer Communication Matrix

```text
               ┌───────────────────────────────┐
               │    Presentation View Layer    │
               │   (src/app & src/components)  │
               └───────────────┬───────────────┘
                               │
                               │ (Allowed: HTTP / API Service Invocations)
                               ▼
               ┌───────────────────────────────┐
               │    Business Service Layer     │
               │    (src/server/services/)     │
               └───────────────┬───────────────┘
                               │
                               │ (Allowed: Abstract Repository Queries)
                               ▼
               ┌───────────────────────────────┐
               │    Repository Data Layer      │
               │   (src/server/repositories/)  │
               └───────────────┬───────────────┘
                               │
                               │ (Allowed: Data Access Engine)
                               ▼
               ┌───────────────────────────────┐
               │     Database / Cache Engine   │
               │     (PostgreSQL / Redis)      │
               └───────────────────────────────┘
```

---

## 3. Strict Layer Dependency Rules

| Layer Component | MAY Depend On | MUST NEVER Depend On | Architectural Justification |
| :--- | :--- | :--- | :--- |
| **App Router (`src/app/`)** | `src/components`, `src/lib`, `src/server/services`, `src/types` | Direct Prisma ORM models (`prisma.*`), raw SQL queries | HTTP handlers act purely as controllers, delegating business processing to domain services. |
| **UI Components (`src/components/`)** | `src/components/ui`, `src/lib/utils`, `src/types`, pure icons | Server-only packages (`prisma`, `bcryptjs`, `fs`, `redis`, Node OS) | Guarantees UI components remain pure and renderable across client browsers and static wrappers. |
| **Domain Services (`src/server/services/`)** | `src/server/repositories`, `src/lib`, `src/types` | React components, DOM APIs, App Router request/response objects | Domain calculations must remain 100% framework-agnostic for instant portability to microservices. |
| **Data Repositories (`src/server/repositories/`)** | `src/lib/prisma`, `src/lib/redis`, `src/types` | UI components, HTTP contexts, high-level business validation logic | Isolates database persistence mechanics cleanly from business rules. |
| **Type Layer (`src/types/`)** | Zero runtime packages (Types-only) | Executable runtime code, stateful modules, UI frameworks | Guarantees pure compile-time contract enforcement without runtime side effects. |

---

## 4. Forbidden Architectural Dependencies & Anti-Patterns

### 1. NO UI-to-Database Direct Access (Bypassing Services)
- **Forbidden Pattern:** App Router API handlers or React server components invoking `prisma.financeRecord.findMany()` directly.
- **Mandatory Correct Pattern:** Handlers invoke `financeService.getLedgerRecords()`, which delegates data access to `financeRepository.findMany()`.

### 2. NO Upward Dependencies
- **Forbidden Pattern:** Business services in `src/server/services/` importing React components or hooks from `src/components/`.
- **Mandatory Correct Pattern:** Services return pure data DTOs; presentation components render DTOs visually.

### 3. NO Circular Domain Dependencies
- **Forbidden Pattern:** Module A (`employees`) importing Module B (`finance`), while Module B simultaneously imports Module A (`employees`).
- **Mandatory Correct Pattern:** Inter-module communication occurs via asynchronous domain events (BullMQ) or decoupled shared service contracts.

### 4. Infrastructure Isolation from Business Rules
- **Forbidden Pattern:** Embedding vendor-specific cloud SDKs (e.g. AWS S3 SDK or Supabase SDK) directly inside domain service files.
- **Mandatory Correct Pattern:** Wrap external infrastructure behind abstract adapter helpers in `src/lib/export/` or `src/lib/storage/`.

---

## 5. Automated Dependency Governance

Dependency rules are continuously enforced in CI/CD via automated tooling:
1. **ESLint `no-restricted-imports` Rules:** Block import of `prisma` or `fs` inside `src/components/`.
2. **Dependency Cruiser Scans:** Automated structural validation scanning for circular imports during pull request checks.
