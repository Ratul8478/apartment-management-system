# Detailed Domain Service Layer Architecture

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Domain Service Layer Design & Business Logic Specification  
**Author:** Staff Software Architect & Lead Backend Engineer  
**Status:** Approved for Implementation  

---

## 1. Core Services & Domain Boundaries

### 1.1 `FinanceService`
- **Purpose:** Handles all financial transaction workflows, formulas, aggregations, and period rollups.
- **Dependencies:** `FinanceRepository`, `RedisCacheManager`, `AuditService`, `QueueManager`.
- **Key Business Methods:**
  - `createTransaction(dto: CreateFinanceRecordDto, actorId: string)`: Validates non-zero amounts, verifies fiscal dates, executes DB insertion within a `$transaction`, logs audit event, invalidates Redis rollup cache.
  - `getAggregatedMetrics(tenantId: string, period: 'daily'|'monthly'|'yearly', dateRange: DateRange)`: Checks Redis cache for rollup; if cache miss, queries `FinanceRepository`, computes formulas, populates Redis cache with a 3,600s TTL.
  - `processBulkCsvUpload(fileBuffer: Buffer, tenantId: string, actorId: string)`: Streams CSV rows using `Papaparse`, validates row DTOs, dispatches background `csvWorker` job to BullMQ queue.

---

### 1.2 `AIService`
- **Purpose:** Manages grounded conversational AI financial intelligence, retrieval context assembly, prompt construction, and Claude API invocation.
- **Dependencies:** `FinanceRepository`, `ClaudeAdapter`, `ChatRepository`.
- **Key Business Methods:**
  - `processUserQuery(query: string, userId: string, tenantId: string, role: SystemRole)`: Sanitizes prompt string, queries `FinanceRepository` using exact user role constraints, builds grounded system prompt, calls `ClaudeAdapter`, logs conversation pair in `ChatRepository`.

---

### 1.3 `ReportService`
- **Purpose:** Manages export studio pipelines for PowerPoint presentation slide decks and Power BI datasets.
- **Dependencies:** `FinanceService`, `ReportRepository`, `S3Adapter`, `QueueManager`.
- **Key Business Methods:**
  - `requestPptExport(templateId: string, dateRange: DateRange, actorId: string)`: Validates user permissions, enqueues background job to `pptWorker` queue, returns job tracking ID to client.
  - `compilePptFile(jobId: string)`: Executed inside background worker thread. Fetches financial metrics, renders slides using `PptxGenJS`, uploads `.pptx` buffer to AWS S3 bucket, returns 15-minute pre-signed URL.

---

### 1.4 `AuthenticationService`
- **Purpose:** User authentication, password verification, MFA challenge execution, and JWT token management.
- **Dependencies:** `UserRepository`, `SessionRepository`, `AuditService`.
- **Key Business Methods:**
  - `authenticateUser(credentials: LoginDto)`: Validates password hash via `bcrypt.compare`, checks failed attempt counter, triggers TOTP MFA if enabled, issues HttpOnly session tokens.
