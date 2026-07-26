# Enterprise Naming Standards & Architectural Conventions

## 1. Executive Summary & Objective

Uniform naming conventions across 100+ engineers are critical for codebase discoverability, maintainability, cross-platform file safety, and automated static code analysis. This document defines the enterprise naming standards enforced for **FinTrack Pro**.

---

## 2. Comprehensive Naming Standard Matrix

| Artifact Category | Casing / Format Standard | Example File / Symbol | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Directories (Folders)** | `kebab-case` | `share-value/`, `ai-chat/` | URL-safe, cross-platform filesystem (Linux/Windows/macOS) safety. |
| **React Components** | `PascalCase.tsx` | `TurnoverBarChart.tsx`, `Button.tsx` | Standard React component naming convention for JSX tags. |
| **Custom Hooks** | `camelCase.ts` (`use` prefix) | `useAuthSession.ts`, `useTurnoverData.ts` | Explicit identification of React stateful hook functions. |
| **Utility Modules** | `camelCase.ts` | `passwordPolicy.ts`, `utils.ts` | Standard TypeScript utility module naming. |
| **Service Classes** | `PascalCase.ts` (`Service` suffix) | `financeService.ts` / `FinanceService` | Explicit identification of backend business service layer. |
| **Repository Classes** | `PascalCase.ts` (`Repository` suffix) | `financeRepository.ts` / `FinanceRepository` | Explicit identification of data access persistence layer. |
| **API Route Handlers** | `route.ts` | `src/app/api/employees/route.ts` | Mandatory Next.js 15 App Router standard filename. |
| **TypeScript Interfaces** | `PascalCase` | `User`, `FinanceRecord`, `ApiResponse` | Clean domain contract type definitions (No hungarian `I` prefix). |
| **TypeScript Enums** | `PascalCase` (Keys: `UPPER_SNAKE`) | `UserRole.FINANCE_MANAGER` | Immutability and explicit option enumeration. |
| **Data Transfer Objects (DTOs)** | `PascalCase` (`Dto` suffix) | `CreateRecordDto`, `UserResponseDto` | Distinguishes API wire contracts from internal database models. |
| **Global Constants** | `UPPER_SNAKE_CASE` | `DEFAULT_PAGINATION_LIMIT` | Universal indicator of immutable compile-time constants. |
| **Environment Variables** | `UPPER_SNAKE_CASE` | `DATABASE_URL`, `NEXTAUTH_SECRET` | POSIX environment variable standard compliance. |
| **Configuration Files** | `kebab-case` or framework exact | `next.config.js`, `tailwind.config.js` | Tooling & framework configuration discovery standards. |
| **Database Migrations** | `YYYYMMDDHHMMSS_kebab_case` | `20260723120000_add_audit_logs.sql` | Chronological SQL migration ordering and readability. |

---

## 3. Detailed Naming Rules & Guidance

### 1. Folder & Directory Naming
- All directories under `src/app/`, `src/components/`, `src/lib/`, and `src/server/` MUST use lower-case `kebab-case` (e.g. `audit-logs/`, `share-value/`).
- Prevents case-sensitivity issues when building between Linux CI runners and Windows/macOS local environments.

### 2. File Naming Rules
- **React Components:** Name matches component export exactly in `PascalCase.tsx` (e.g. `FinanceRecordFormModal.tsx`).
- **Services & Repositories:** Suffix file with `Service.ts` or `Repository.ts` in `camelCase` or `PascalCase` (e.g. `financeService.ts` and `financeRepository.ts`).
- **Zod Validation Schemas:** Append `Schema` suffix to schema objects (e.g. `createRecordSchema`, `loginSchema`).

### 3. Interface & Type Naming Rules
- Do NOT use `I` prefixes (e.g. use `User`, NOT `IUser`).
- Use descriptive suffixes for API contracts: `CreateUserPayload`, `UserResponseDto`, `AuditLogQueryFilters`.

### 4. Constant & Enum Naming Rules
- Enums use `PascalCase` names with `UPPER_SNAKE_CASE` members:
```typescript
export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}
```
