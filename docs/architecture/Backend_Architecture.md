# Enterprise Backend Architecture & Systems Design Specification

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Master Backend Architecture, Service Layer & API Gateway Specification  
**Author:** Distinguished Software Architect & Principal Backend Engineer  
**Target Audience:** Backend Engineers, System Architects, DevOps Engineers, QA Automation Leads  
**Status:** Approved for Backend Implementation  
**Version:** 2.0.0 (Enterprise Production Grade)

---

## SECTION 1: BACKEND PHILOSOPHY & ARCHITECTURAL PATTERNS

### 1.1 Architectural Vision
The backend of FinTrack Pro is engineered as a **Clean, Layered Hexagonal Modular Monolith** built on top of Next.js 14 Route Handlers, TypeScript, Prisma ORM, Redis, BullMQ, and Socket.IO. It provides a strict separation between HTTP transport logic, domain business calculations, persistence abstractions, background processing queues, and real-time event streaming.

```
       +-------------------------------------------------------+
       |   Presentation / Transport Layer (Next.js Handlers)   |
       +---------------------------+---------------------------+
                                   | (DTO Validation via Zod)
                                   v
       +-------------------------------------------------------+
       |   Application & Domain Service Layer (Service Layer)  |
       +---------------------------+---------------------------+
                                   | (Repository Interfaces)
                                   v
       +-------------------------------------------------------+
       |   Persistence Abstraction Layer (Repository Pattern)  |
       +---------------------------+---------------------------+
                                   | (Prisma Client Singleton)
                                   v
       +-------------------------------------------------------+
       |   Infrastructure Layer (Postgres, Redis, BullMQ, S3)  |
       +-------------------------------------------------------+
```

### 1.2 Core Architectural Principles & Trade-off Rationale

1. **Service Layer Pattern:** Encapsulates all domain formulas, financial business validation, transactional guarantees, and workflow orchestration. HTTP Route Handlers NEVER execute SQL, access Prisma directly, or compute financial formulas.
2. **Repository Pattern:** Provides an abstraction boundary over Prisma ORM database queries. If the underlying data store or ORM changes in future enterprise versions, the domain services remain completely unaffected.
3. **Dependency Injection (DI):** Services and repositories accept interface dependencies via constructors or factory injection, enabling fast, isolated unit testing without spinning up live database instances or external services.
4. **Separation of Concerns (SoC):** Middleware handles security and authentication; Controllers handle request parsing and response mapping; Services execute business logic; Repositories perform database operations; Workers process background queues.
5. **Clean & Hexagonal Architecture (Ports and Adapters):** Domain logic relies on abstract interfaces ("Ports"). External services (AWS S3, Anthropic Claude API, SendGrid, BullMQ, Redis) implement these interfaces ("Adapters"), ensuring zero vendor lock-in.

---

## SECTION 2: COMPLETE BACKEND FOLDER STRUCTURE

The backend codebase adheres strictly to the following domain-decoupled directory layout:

```
src/
├── app/                              # Presentation / HTTP Transport Layer
│   └── api/                          # Next.js 14 Route Handlers (Controllers)
│       ├── auth/                     # Auth & Session Endpoints
│       ├── finance-records/          # Financial Data Endpoints
│       ├── employees/                # Employee Directory Endpoints
│       ├── share-value/              # Share Value & Market Feed Endpoints
│       ├── reports/                  # Report Studio & Presentation Endpoints
│       ├── ai-chat/                  # Grounded AI Assistant Endpoints
│       ├── notifications/            # Alert & Notification Endpoints
│       └── admin/                    # System Admin & Audit Log Endpoints
├── server/                           # Core Backend Application Layer
│   ├── controllers/                  # Controller Request Handlers & Response Formatters
│   ├── services/                     # Business Logic Services & Domain Calculations
│   ├── repositories/                 # Data Access Repositories (Prisma Abstraction)
│   ├── middlewares/                  # Auth Guards, RBAC, Rate-Limiting, Error Handling
│   ├── validators/                   # Input/Output DTO Validation Schemas (Zod)
│   ├── events/                       # Event Emitters & Internal Domain Event Handlers
│   ├── workers/                      # BullMQ Queue Processors & Job Workers
│   ├── queues/                       # BullMQ Queue Initializers & Definitions
│   ├── jobs/                         # Periodic Background Task Definitions
│   ├── cron/                         # Vercel Cron / Scheduled Job Trigger Definitions
│   ├── cache/                        # Redis Cache Managers & Invalidation Hooks
│   ├── auth/                         # NextAuth Configuration, JWT & TOTP Helpers
│   ├── permissions/                  # RBAC Role Matrix & RLS Context Providers
│   └── lib/                          # Infrastructure SDK Wrappers & API Clients
│       ├── ai/                       # Anthropic Claude & OpenAI SDK Adapters
│       ├── export/                   # PptxGenJS & Power BI Exporter Modules
│       ├── storage/                  # AWS S3 & Supabase Storage Drivers
│       └── realtime/                 # Socket.IO Gateway & WebSocket Handlers
├── config/                           # Environment Configuration & Secret Loading
├── constants/                        # System Constants, Error Codes, Metric Enums
├── types/                            # Shared DTOs, Domain Models, Response Specs
└── utils/                            # Helper Functions, Math Utilities, Date Formatter
```

---

## SECTION 3: BACKEND MODULE DESIGN & RESPONSIBILITIES

### 3.1 Authentication & Identity Module (`MOD-01`)
- **Responsibilities:** Credentials validation, bcrypt password hashing, HttpOnly JWT token issuance, session refresh rotation, TOTP MFA challenge verification, password reset flows.
- **Dependencies:** User Repository, Session Repository, Redis Cache, Email Dispatcher.
- **Interfaces:** `IAuthenticationService`, `IUserRepository`, `ISessionRepository`.
- **Future Extensions:** Enterprise SAML 2.0 / Okta / Azure AD OIDC Single Sign-On (SSO).

### 3.2 Finance & Turnover Analytics Module (`MOD-04`)
- **Responsibilities:** Financial transaction validation, non-zero amount checks, daily/monthly/yearly date aggregations, period rollups, metric calculation formulas.
- **Dependencies:** Finance Repository, Redis Cache, Audit Logger, Worker Queue.
- **Interfaces:** `IFinanceService`, `IFinanceRepository`, `ICacheService`.
- **Future Extensions:** Multi-currency exchange engine, automated ERP live sync (Tally, SAP).

### 3.3 AI Conversational Intelligence Module (`MOD-05`)
- **Responsibilities:** User query sanitization, retrieval-augmented context building, Claude API prompt construction, token optimization, inline chart metadata injection.
- **Dependencies:** Finance Repository, Claude SDK Client, Redis Memory Cache.
- **Interfaces:** `IAIService`, `IContextBuilder`, `ILLMProvider`.
- **Future Extensions:** Autonomous anomaly flagging worker, predictive scenario modeling.

### 3.4 Automated Report Studio Module (`MOD-06`)
- **Responsibilities:** Asynchronous PPT slide deck generation (`PptxGenJS`), Power BI push-dataset formatting, AWS S3 upload handling, pre-signed URL generation.
- **Dependencies:** Finance Service, BullMQ Queue, S3 Storage Client, Notification Service.
- **Interfaces:** `IReportService`, `IReportRepository`, `IStorageService`, `IJobQueue`.
- **Future Extensions:** Drag-and-drop presentation template designer.

---

## SECTION 4: LAYERED ARCHITECTURE & INTER-LAYER COMMUNICATION

```
+-------------------------------------------------------------------------------+
| PRESENTATION LAYER: HTTP Route Handlers / Socket.IO Gateway                   |
| - Extracts Headers, Parameters, Cookies                                      |
| - Calls Zod Validators for DTO sanitization                                   |
| - Delegates execution to Application Layer                                    |
+---------------------------------------+---------------------------------------+
                                        | (Passes Validated DTO)
                                        v
+-------------------------------------------------------------------------------+
| APPLICATION & BUSINESS LAYER: Domain Services & Workflow Orchestrators        |
| - Executes Domain Formulas, Business Validation, State Transitions           |
| - Coordinates Transactions across multiple repositories                       |
| - Dispatches Audit Events and Background Queue Jobs                           |
+---------------------------------------+---------------------------------------+
                                        | (Calls Abstract Repository Ports)
                                        v
+-------------------------------------------------------------------------------+
| REPOSITORY LAYER: Data Access Abstractions & ORM Wrappers                     |
| - Translates Domain Queries into Prisma ORM Execution Plans                   |
| - Enforces Database Row Level Security (RLS) Context                          |
| - Returns Typed Domain Entities to Service Layer                              |
+---------------------------------------+---------------------------------------+
                                        | (Generates SQL Execution Plan)
                                        v
+-------------------------------------------------------------------------------+
| DATABASE & INFRASTRUCTURE LAYER: PostgreSQL 16, Redis, BullMQ, AWS S3         |
| - ACID Database Storage & Row Locking                                         |
| - Distributed In-Memory Caching & Rate Limiting                               |
| - Asynchronous Queue Processing & Persistent Media Storage                    |
+-------------------------------------------------------------------------------+
```

---

## SECTION 5: REPOSITORY DESIGN SPECIFICATIONS

All data access operations are isolated behind explicit Repository classes. Raw Prisma calls inside route handlers or services are strictly prohibited.

- **`FinanceRepository`:** Wraps Prisma queries for `finance_records`. Exposes `findAggregatedMetrics(tenantId, dateRange, metricType)`, `insertTransaction(dto)`, `bulkInsertTransactions(dtos[])`, `softDeleteRecord(id)`.
- **`UserRepository`:** Wraps Prisma queries for `users`. Exposes `findByEmail(email)`, `findById(id)`, `updateFailedLogins(id, count)`, `setMfaSecret(id, secret)`.
- **`EmployeeRepository`:** Wraps Prisma queries for `employees`. Exposes `findDirectory(filters, pagination)`, `findWithMaskedSalary(role, id)`.
- **`ReportRepository`:** Wraps Prisma queries for `reports`. Exposes `saveReportMetadata(reportDto)`, `getUserReportsHistory(userId)`.
- **`AuditRepository`:** Wraps Prisma queries for `audit_logs`. Exposes `appendAuditLog(entryDto)` (Append-only insert operation).

---

## SECTION 6: SERVICE LAYER SPECIFICATIONS & BUSINESS FORMULAS

### 6.1 `FinanceService` Rules & Formulas
- **Net Margin Calculation:**
  $$\text{Net Margin \%} = \left( \frac{\text{Total Turnover} - \text{Total Expenses}}{\text{Total Turnover}} \right) \times 100$$
- **Revenue Growth Rate:**
  $$\text{Growth \%} = \left( \frac{\text{Turnover}_{\text{Current Period}} - \text{Turnover}_{\text{Previous Period}}}{\text{Turnover}_{\text{Previous Period}}} \right) \times 100$$
- **Transactional Guarantees:** Any transaction write operation MUST execute inside a Prisma `$transaction` block, ensuring that financial record mutations and `audit_log` appends commit or rollback atomically.

### 6.2 `AIService` Context Scoping & Safety Rules
- **Anti-Hallucination Rule:** Prompt payloads MUST include explicit instructions restricting answers strictly to the provided retrieval context block.
- **Data Filtering Rule:** The service queries `FinanceRepository` using the logged-in user's exact tenant and role constraints before context assembly.

---

## SECTION 7: VALIDATION LAYER & ERROR SANITIZATION

Validation is enforced across three defensive perimeters using **Zod**:

1. **Input Validation (Edge Perimeter):** Route middleware validates HTTP request headers, query parameters, and JSON request bodies against Zod schemas. Invalid payloads return HTTP `422 Unprocessable Entity` containing field-level error messages.
2. **Business Validation (Domain Perimeter):** Domain services enforce non-zero amounts, valid fiscal date boundaries, non-overlapping date ranges, and duplicate date warnings.
3. **Output Sanitization (Presentation Perimeter):** Data returned to client applications passes through output schemas that strip sensitive internal fields (`password_hash`, `mfa_secret`, internal database foreign keys).

---

## SECTION 8: AUTHENTICATION & AUTHORIZATION ARCHITECTURE

### 8.1 Authentication Lifecycle
```
User Login Request ---> [Rate Limiter Check] ---> [Verify Password via Bcrypt]
                                                         │
                                    ┌────────────────────┴────────────────────┐
                                    ▼                                         ▼
                         [MFA Enabled == True]                      [MFA Enabled == False]
                                    │                                         │
                         [Return MFA Challenge Token]               [Issue HttpOnly JWT Session]
                                    │                                         │
                         [Verify 6-Digit TOTP Token] ─────────────────────────┘
```

### 8.2 Authorization & Role-Based Access Control (RBAC) Matrix

| Endpoint Route Group | Super Admin | Admin | Finance Manager | Finance Analyst | External Auditor |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/admin/*` | Full Access | Full Access | Denied (403) | Denied (403) | Denied (403) |
| `/api/finance-records` (GET)| Full Access | Full Access | Full Access | Full Access | Date-Restricted |
| `/api/finance-records` (POST)| Full Access | Denied (403) | Full Access | Denied (403) | Denied (403) |
| `/api/employees` (Salary)| Full Access | Full Access | Masked Field | Masked Field | Masked Field |
| `/api/reports/generate-*` | Full Access | Full Access | Full Access | Draft Only | Read Only |

---

## SECTION 9: CACHING & REAL-TIME QUEUE ARCHITECTURE

### 9.1 Redis Caching Strategy
- **Dashboard Rollups:** Key format `cache:tenant:{id}:analytics:{period}:{dateHash}`. TTL: 3,600 seconds. Invalidation trigger: `FINANCE_RECORD_MUTATED` domain event.
- **Stock Market Feed:** Key format `cache:shares:ticker:{symbol}`. TTL: 60 seconds during market hours.
- **User Sessions:** Key format `cache:session:{tokenHash}`. TTL: 900 seconds.

### 9.2 BullMQ Background Processing Queues

```
[API Endpoint] ---> [Enqueue Job to BullMQ] ---> [Redis Job Queue]
                                                      │
                                                      v
                                        [Background Worker Pool]
                                                      │
                                    ┌─────────────────┴─────────────────┐
                                    ▼                                   ▼
                         [Generate PPTX via PptxGenJS]        [Upload File to AWS S3]
                                    │                                   │
                                    └─────────────────┬─────────────────┘
                                                      v
                                        [Emit Socket.IO Success Event]
```

---

## SECTION 10: BACKEND READINESS CHECKLIST

Before frontend developers begin connecting UI components to backend endpoints, the following verification steps MUST be complete:

- [x] Folder structure fully initialized adhering to Layered Hexagonal architecture.
- [x] `FinanceService`, `UserService`, `AIService`, and `ReportService` business logic specified.
- [x] All database queries encapsulated behind typed Repository classes.
- [x] Input, business, and output validation enforced using Zod DTO schemas.
- [x] Authentication pipeline implementing HttpOnly JWT tokens, TOTP MFA, and account lockouts.
- [x] Role-Based Access Control (RBAC) middleware verifying user claims on every endpoint.
- [x] Redis caching layer active with automated invalidation hooks on financial write operations.
- [x] Asynchronous BullMQ background worker queue handling document exports.
- [x] Centralized Winston/Pino logger emitting structured JSON logs with transaction tracking IDs.
- [x] Global error handler catching unhandled exceptions and returning sanitized HTTP response objects.

---

## ARCHITECTURAL CONCLUDING DIRECTIVE

This Backend Architecture Specification is **complete, production-ready, and binding**. All API handlers, business services, background queues, and repository abstractions must strictly follow the patterns, security boundaries, and engineering principles defined herein.
