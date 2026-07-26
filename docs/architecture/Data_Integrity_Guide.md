# Enterprise Data Integrity & Invariants Specification

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Data Integrity & Business Invariants Specification  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Integrity Mandate

In **FinTrack Pro**, data integrity is enforced programmatically at the relational database engine level rather than relying solely on application-level checks. 

In financial software processing balance sheets, multi-currency turnover records, and corporate payroll data, silent data corruption or orphaned records are catastrophic. This specification documents database referential constraints, cascade behaviors, optimistic locking rules, and core business invariants.

---

## 2. Foreign Key Referential Action Strategy

The schema enforces three explicit foreign key deletion policies:

```text
┌────────────────────────────────────────────────────────┐
│            Foreign Key Deletion Policies               │
├───────────────────┬───────────────────┬────────────────┤
│ 1. CASCADE        │ 2. RESTRICT       │ 3. SET NULL    │
│ (Dependent Child) │ (Immutable Ledger)│ (Non-Critical) │
└───────────────────┴───────────────────┴────────────────┘
```

### 1. `CASCADE` Policy (Dependent Sub-Resources)
- **Applied To:** `Session` $\rightarrow$ `User`, `AiChatMessage` $\rightarrow$ `AiChatSession`, `OcrResult` $\rightarrow$ `Receipt`, `UserRole` $\rightarrow$ `User`.
- **Justification:** Sub-resources have zero domain utility without their parent entity. Deleting the parent MUST automatically clean up all dependent child records.

### 2. `RESTRICT` Policy (Auditable Financial Records & Masters)
- **Applied To:** `FinanceRecord` $\rightarrow$ `User` (`createdById`), `Department` $\rightarrow$ `Employee`, `Budget` $\rightarrow$ `Department`, `Report` $\rightarrow$ `User`.
- **Justification:** Hard-deleting a parent entity is BLOCKED if referenced by a financial record or cost center. This prevents accidental deletion of historical ledger authors or departmental audit anchors.

### 3. `SET NULL` Policy (Optional / Historical References)
- **Applied To:** `Employee` $\rightarrow$ `User`, `AuditLog` $\rightarrow$ `ActorUser`, `Employee` $\rightarrow$ `ManagerEmployee`.
- **Justification:** If a user identity or manager employee record is deleted or deactivated, the historical audit log or subordinate employee record is preserved with `actor_id = NULL` or `manager_id = NULL`.

---

## 3. Financial Invariants & Column Constraints

### 1. Precision Monetary Storage (`DECIMAL(18,2)` & `DECIMAL(12,4)`)
- **Rule:** Floating-point data types (`FLOAT`, `DOUBLE PRECISION`) are STRICTLY FORBIDDEN for currency amounts due to binary floating-point rounding errors.
- **Enforcement:** All financial monetary columns (`amount`, `allocated`, `spent`, `predicted_value`, `invoice_amount`) use PostgreSQL native `DECIMAL(18,2)`. Market share prices use `DECIMAL(12,4)`.

### 2. Currency Code Standard (ISO 4217)
- **Rule:** Currency fields must store 3-character uppercase ISO 4217 currency codes (e.g., `'INR'`, `'USD'`, `'EUR'`).
- **Enforcement:** Enforced via `VARCHAR(3)` schema constraints and Zod validation.

### 3. Optimistic Concurrency Locking (`version`)
- **Rule:** High-concurrency entities (`User`, `FinanceRecord`) include an integer `version` field.
- **Enforcement:** Updates compare `WHERE id = :id AND version = :currentVersion` and increment `version = version + 1`. If another process modified the record concurrently, the update returns 0 affected rows, triggering a retry or concurrency exception.

---

## 4. Soft Deletion Compliance Rules

1. **Uniform Soft-Delete Column:** Entities supporting soft deletion include `deleted_at DateTime? @map("deleted_at") @db.Timestamp()`.
2. **Active Filter Index:** Tables with soft deletion include an explicit B-Tree index on `deleted_at` (`@@index([deletedAt])`).
3. **Default Active Query Scope:** Base Repositories automatically apply `WHERE deleted_at IS NULL` to all queries unless `includeSoftDeleted` is explicitly requested.

---

## 5. Architectural Evaluation Matrix

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Dimension                 │ Architectural Impact & System Benefit                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Technical Reasoning       │ Engine-level `RESTRICT` rules guarantee financial records │
│                           │ can never be orphaned by broken application code      │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Security Implications     │ Audit logs use `SET NULL` on actor deletion, ensuring  │
│                           │ historical security event details remain permanent     │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Scalability Considerations│ Optimistic concurrency control via `version` prevents  │
│                           │ heavy pessimistic database row locking                 │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Operational Considerations│ Native `DECIMAL(18,2)` types guarantee zero rounding   │
│                           │ discrepancies during multi-currency ledger rollups     │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Maintainability Guidance  │ Standardized `deleted_at` naming across models enables │
│                           │ reusable soft-deletion logic in BaseRepository         │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
