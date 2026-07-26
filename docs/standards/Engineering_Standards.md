# Enterprise Engineering Standards & Governance

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical Naming Conventions, Git Workflow & Governance Standards  
**Author:** Enterprise Engineering Manager & Quality Lead  
**Status:** Approved for Implementation  

---

## 1. Naming Conventions

- **Directory / Folder Names:** Lowercase `kebab-case` (e.g., `features/finance-entry`, `server/repositories`).
- **React Components & Files:** PascalCase (e.g., `TurnoverBarChart.tsx`, `FinanceEntryModal.tsx`).
- **Services & Repositories:** camelCase with role suffix (e.g., `financeService.ts`, `financeRepo.ts`).
- **TypeScript Interfaces & Types:** PascalCase prefixed with `I` for interfaces (e.g., `IFinanceRecord`, `IUserRepository`).
- **Constants & Enums:** UPPER_SNAKE_CASE (e.g., `MAX_CSV_UPLOAD_ROWS = 10000`).
- **Database Tables & Columns:** Lowercase `snake_case` (e.g., `finance_records`, `record_date`).
- **REST Endpoints:** Lowercase `kebab-case` plural nouns (e.g., `/api/v1/finance-records`).

---

## 2. Conventional Commit Messages
Format: `<type>(<scope>): <short description>`
- `feat(finance): implement daily/monthly/yearly rollup calculation`
- `fix(auth): enforce HttpOnly flag on refresh token cookie`
- `docs(architecture): update Mermaid diagram for BullMQ queue`
- `test(security): execute testSecurityMatrix.js in CI pipeline`

---

## 3. Git Branching Strategy
- **`main`:** Production-ready code only. Tagged with semantic versioning (`v1.0.0`).
- **`develop`:** Integration branch for upcoming release.
- **`feature/*`:** Feature development branches (e.g., `feature/FT-003-turnover-chart`).
- **`bugfix/*`:** Non-urgent bug fixes (e.g., `bugfix/FT-004-csv-validation-fix`).
- **`hotfix/*`:** Emergency production security fixes (e.g., `hotfix/mfa-bypass-fix`).
