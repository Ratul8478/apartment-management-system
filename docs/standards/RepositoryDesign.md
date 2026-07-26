# Detailed Repository Layer Architecture & Data Access Patterns

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Data Access Layer & Repository Pattern Specification  
**Author:** Principal Database Engineer & Backend Architect  
**Status:** Approved for Implementation  

---

## 1. Repository Abstraction Strategy

The Repository Layer acts as a strict abstraction boundary over Prisma ORM database execution plans. Services interact exclusively with typed Repository classes, keeping SQL and ORM mechanics isolated.

---

## 2. Core Repositories & Execution Patterns

### 2.1 `FinanceRepository`
- **Responsibilities:** Database queries for `finance_records` table.
- **Methods:**
  - `findAggregatedMetrics(tenantId, period, startDate, endDate)`: Executes raw SQL `date_trunc` aggregations for daily, monthly, and yearly chart rollups.
  - `createRecord(recordData)`: Performs database insert with optimistic locking version counter.
  - `bulkInsertRecords(recordsList)`: Executes high-speed batch database insertion using `prisma.financeRecord.createMany()`.
  - `softDeleteRecord(id)`: Sets `deleted_at = NOW()` without removing the physical record row from PostgreSQL.

---

### 2.2 `EmployeeRepository`
- **Responsibilities:** Database queries for `employees` and `departments` tables.
- **Methods:**
  - `findDirectory(filters, pagination)`: Retrieves employee staff listings with designation and department filtering.
  - `findMaskedById(id, requesterRole)`: Dynamically masks `salary` and personal phone fields if `requesterRole` is not `ADMIN` or `SUPER_ADMIN`.

---

### 2.3 `AuditRepository`
- **Responsibilities:** Append-only database inserts into `audit_logs` table.
- **Methods:**
  - `appendLogEntry(logData)`: Inserts immutable JSONB audit payloads detailing actor ID, action type, old values, and new values.
