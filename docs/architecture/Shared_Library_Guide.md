# Enterprise Shared Library Architecture Guide

## 1. Executive Summary & Design Philosophy

The **Shared Library Layer** provides enterprise cross-cutting infrastructure utilities, design system visual primitives, security helpers, validation schemas, and domain type contracts reused across all feature modules in **FinTrack Pro**. 

To prevent code duplication while guarding against bloated, tightly coupled "dumping ground" shared folders, this guide specifies what belongs in shared libraries, which layers may consume them, and what is strictly prohibited.

---

## 2. Shared Library Directory Breakdown

```text
src/
├── components/ui/                   # Atomic UI Design System Primitives
│   ├── Badge.tsx                    # Category & Status Badges
│   ├── Button.tsx                   # Accessible Action Control Primitive
│   ├── Card.tsx                     # Content Container Box Primitive
│   ├── Input.tsx                    # Form Text & Number Input Field
│   ├── Modal.tsx                    # Accessible Overlay Dialog Primitive
│   ├── Select.tsx                   # Custom Dropdown Select Primitive
│   └── Table.tsx                    # Pure Visual Data Table Primitive
├── lib/                             # Utility & Infrastructure Shared Libraries
│   ├── ai/                          # Grounded AI Prompt Utilities & Model Wrappers
│   ├── api-client/                  # Fetch API Wrapper & Universal HTTP Client
│   ├── export/                      # PowerPoint Deck & Power BI CSV Engine Helpers
│   ├── security/                    # Bcrypt Password & MFA TOTP Security Utilities
│   ├── validation/                  # Shared Zod Validation Schemas
│   ├── auth.ts                      # NextAuth Session Middleware & Configuration
│   ├── prisma.ts                    # Global Prisma Database Client Pool Singleton
│   ├── redis.ts                     # Global Redis Connection Pool Singleton
│   └── utils.ts                     # Tailwind Class Merger (`cn()`) & Formatters
└── types/                           # Enterprise Contract & Type Specifications
    ├── api.ts                       # Standardized REST Payload Specifications
    ├── domain.ts                    # Enterprise Domain Model Interfaces
    └── index.ts                     # Single Source of Truth Barrel Type Specification
```

---

## 3. Detailed Shared Package Specifications

### 1. Atomic UI Design System (`src/components/ui/`)
- **Engineering Purpose:** Standardized visual design primitives built on React 19, Tailwind CSS, and shadcn/ui.
- **Allowed Contents:** Pure presentation controls (`Button`, `Card`, `Modal`, `Input`, `Badge`, `Dropdown`, `Table`).
- **Allowed Consuming Layers:** `src/app/`, `src/components/`.
- **Forbidden Dependencies:** Server-only drivers (`prisma`, `redis`, `fs`, `bcryptjs`), backend services, or specific domain rules.
- **Debt Mitigation:** Enforces UI consistency across 100+ engineers and prevents duplicate button/modal components.

### 2. Infrastructure & Utility Libraries (`src/lib/`)
- **Engineering Purpose:** Infrastructure singletons, encryption tools, export generators, and parsing utilities.
- **Allowed Contents:**
  - **Shared Utilities (`utils.ts`):** Formatting functions (currency, date, numbers), Tailwind class merger `cn()`.
  - **Shared Validation (`lib/validation/`):** Generic Zod payload validation schemas (`emailSchema`, `paginationQuerySchema`).
  - **Security Helpers (`lib/security/`):** Password hashing (`passwordPolicy.ts`), TOTP generation, token generators.
  - **Export Generators (`lib/export/`):** Generic PowerPoint (`PptxGenJS`) slide builder and CSV stringifiers.
  - **API Client (`lib/api-client/`):** Standardized fetch client with header injection, timeout handling, and error parsing.
  - **Database Connection Pools (`prisma.ts`, `redis.ts`):** Singleton client connection pool wrappers.
- **Allowed Consuming Layers:** Presentation routes (`src/app/`), UI components (`src/components/`), Backend services (`src/server/services/`).
- **Forbidden Dependencies:** Client-side presentation hooks or specific page layouts.

### 3. Enterprise Type Specifications (`src/types/`)
- **Engineering Purpose:** Central repository for all TypeScript interfaces, DTOs, API payloads, and enums.
- **Allowed Contents:** Pure TypeScript declaration files (`.ts`). Zero runtime logic.
- **Allowed Consuming Layers:** **ALL** project layers (`src/app`, `src/components`, `src/lib`, `src/server`).
- **Forbidden Dependencies:** MUST NEVER import executable runtime JavaScript or stateful objects.

---

## 4. What MUST NEVER Be Placed in Shared Libraries

To prevent shared library bloat and coupling anti-patterns, the following are strictly forbidden from `src/lib/` or `src/components/ui/`:

> [!CAUTION]
> **Strict Inclusion Exclusions:**
> 1. **Domain-Specific Business Logic:** Financial calculation algorithms, employee payroll rules, share valuation math. (Belongs in `src/server/services/`).
> 2. **Hardcoded Enterprise Secrets:** Database passwords, JWT secret keys, API credentials. (Belongs in `.env.local` / Environment variables).
> 3. **Stateful Feature Modals:** Forms containing domain business fields (e.g. `FinanceRecordFormModal.tsx`). (Belongs in `src/components/finance/`).
> 4. **Feature-Specific API Routes:** REST controllers handling domain HTTP logic. (Belongs in `src/app/api/<feature>/`).

---

## 5. Technical Debt & Circular Dependency Mitigation Rules

1. **Single Responsibility:** Each shared file must handle exactly one technical concern (e.g. `passwordPolicy.ts` handles password strength validation exclusively).
2. **Zero Upward Imports:** Files in `src/lib/` or `src/components/ui/` MUST NEVER import from `src/app/` or `src/server/services/`.
3. **Explicit Type Barrel Exports:** All domain types are exported cleanly from `src/types/index.ts`, avoiding deep nested type import paths.
