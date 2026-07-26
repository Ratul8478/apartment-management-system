# Enterprise Feature Module Blueprint & Architecture Template

## 1. Executive Summary & Objective

To enforce complete structural uniformity across all engineering teams building domain capabilities (Authentication, Finance, Employee, Dashboard, Notifications, Reports, AI, Analytics, Forecasting, OCR, Audit Logs, Settings, Share Tracker), this document defines the official **Feature Module Blueprint Template**. Every present and future domain module MUST follow this exact directory and layer architecture.

---

## 2. Standardized Feature Module Blueprint Structure

Every domain module in **FinTrack Pro** consists of six standardized architectural layers:

```text
Feature Module Architectural Layers:
├── 1. Routing & Controller Layer  --> src/app/api/[module-name]/route.ts
├── 2. Presentation Page Layer     --> src/app/(dashboard)/[module-name]/page.tsx
├── 3. Component UI Layer          --> src/components/[module-name]/
├── 4. Domain Service Layer        --> src/server/services/[module-name]Service.ts
├── 5. Repository Data Layer       --> src/server/repositories/[module-name]Repository.ts
└── 6. Contract & Type Layer       --> src/types/[module-name].ts (or src/types/index.ts)
```

---

## 3. Standard Feature Module Directory Specification

### Example Module Blueprint: `finance-records`

```text
finance-records/
├── 1. HTTP API Controller Layer (Public Interface)
│   └── src/app/api/finance-records/
│       ├── route.ts                 # GET (List with Pagination), POST (Create Ledger Record)
│       ├── summary/route.ts         # GET (Financial Rollups & Metrics)
│       ├── upload/route.ts          # POST (Bulk CSV Data Parsing & Ingestion)
│       └── [id]/route.ts            # GET, PUT, DELETE (Single Record Management)
│
├── 2. Presentation View Layer
│   └── src/app/(dashboard)/data-entry/
│       └── page.tsx                 # Client Dashboard View Page Component
│
├── 3. Feature UI Components Layer (Internal UI Implementation)
│   └── src/components/finance/
│       ├── CsvUploadModal.tsx       # Bulk CSV Ingestion Modal Component
│       ├── FinancialSummaryCard.tsx # Turnover & Margin Indicator Card
│       ├── LedgerTable.tsx          # Paginated Financial Entry Table
│       └── RecordFormModal.tsx      # Manual Record Entry & Edit Modal
│
├── 4. Business Logic Service Layer (Internal Domain Implementation)
│   └── src/server/services/
│       └── financeService.ts        # Pure Financial Calculations, Rollups, & Audit Registration
│
├── 5. Data Access Repository Layer (Data Abstraction)
│   └── src/server/repositories/
│       └── financeRepository.ts     # Database Query Abstraction (Prisma ORM Wrappers)
│
├── 6. Testing Location
│   └── tests/unit/services/financeService.test.ts
│   └── tests/e2e/finance-ledger.spec.ts
│
└── 7. Documentation Location
    └── docs/api/finance-records.md
```

---

## 4. Feature Modules Architectural Catalog

| Domain Module | Primary Business Responsibilities | Public Interface (`API Route`) | Domain Service (`src/server/services/`) | Repository (`src/server/repositories/`) |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Password security, MFA TOTP, NextAuth session verification, JWT validation. | `/api/auth/` | `authService.ts` | `userRepository.ts` |
| **Finance** | Financial ledger, revenue rollups, profit margins, balance sheets. | `/api/finance-records/` | `financeService.ts` | `financeRepository.ts` |
| **Employee** | Corporate staff directory, department allocations, compensation benchmarks. | `/api/employees/` | `employeeService.ts` | `employeeRepository.ts` |
| **Dashboard** | Executive KPI aggregations, dashboard card ordering, multi-tenant views. | `/api/dashboard/` | `dashboardService.ts` | `financeRepository.ts` |
| **Notifications** | Alert dispatching, email notifications, priority alert routing. | `/api/notifications/` | `notificationService.ts` | `notificationRepository.ts` |
| **Reports** | Automated slide deck creation (`PptxGenJS`), Power BI CSV generation. | `/api/reports/` | `reportService.ts` | `financeRepository.ts` |
| **AI** | Claude/OpenAI grounded prompts, cost-reduction insights, anomaly detection. | `/api/ai-chat/` | `aiFinanceService.ts` | `aiInsightRepository.ts` |
| **Analytics** | Historical trend calculations, EBITDA analysis, profit benchmarking. | `/api/analytics/` | `analyticsService.ts` | `financeRepository.ts` |
| **Forecasting** | Predictive revenue modeling, cash flow forecasting, scenario simulation. | `/api/forecasting/` | `forecastingService.ts` | `forecastingRepository.ts` |
| **OCR** | Receipt scanning, invoice text parsing, automated ledger ingestion. | `/api/ocr/` | `ocrService.ts` | `ocrDocumentRepository.ts` |
| **Audit Logs** | Immutable system activity tracking, compliance auditing, security logs. | `/api/audit-logs/` | `auditLogService.ts` | `auditLogRepository.ts` |
| **Settings** | Organization details, tenant branding, RBAC configuration. | `/api/settings/` | `settingsService.ts` | `tenantRepository.ts` |
| **Share Tracker** | Share price valuation models, peer benchmark comparisons, stock metrics. | `/api/share-value/` | `shareValueService.ts` | `shareValueRepository.ts` |

---

## 5. Communication & Boundary Rules

```text
+-----------------------+      HTTP Request     +-----------------------------------+
|  Client Web / Mobile  | --------------------> | API Route Handler (Controller)    |
+-----------------------+                       | (src/app/api/finance-records/)    |
                                                +-----------------------------------+
                                                                  |
                                                                  v (Invokes Domain)
                                                +-----------------------------------+
                                                | Domain Service                    |
                                                | (src/server/services/finance)     |
                                                +-----------------------------------+
                                                                  |
                                                                  v (Invokes Repository)
                                                +-----------------------------------+
                                                | Data Repository                   |
                                                | (src/server/repositories/finance) |
                                                +-----------------------------------+
                                                                  |
                                                                  v (Executes DB Query)
                                                +-----------------------------------+
                                                | PostgreSQL / Redis Store          |
                                                +-----------------------------------+
```

### Strict Boundary Enforcement Rules:
1. **Public Interface Control:** External modules MUST communicate with a feature module ONLY through its public HTTP API route (`src/app/api/<module>/`) or exposed domain service interface (`<Module>Service`).
2. **Internal Implementation Hiding:** Internal UI sub-components inside `src/components/<module>/` must not be directly imported by unrelated feature modules.
3. **Cross-Module Mutation Block:** Module A (`finance-records`) MUST NEVER execute direct Prisma mutation queries against database tables owned by Module B (`employees`). Cross-module updates must be orchestrated via domain service methods.

---

## 6. Extension & Plugin Strategy

Every feature module is designed for future extension without mutating existing code (Open/Closed Principle):
- **Strategy Pattern for Operations:** Complex features (e.g. Export Generators or AI Providers) use pluggable strategy handlers in `src/lib/<feature>/`.
- **Event-Driven Inter-Module Communication:** Asynchronously decoupled events (via BullMQ or Node EventEmitter) allow modules like `Audit Logs` or `Notifications` to listen for domain events without tight coupling.
