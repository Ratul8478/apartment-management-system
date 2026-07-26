# Enterprise Database Performance & Indexing Guide

**System Name:** FinTrack Pro  
**Document Type:** Database Performance Engineering & Index Strategy  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Primary & Secondary Index Strategy

### Multi-Tenant Composite Indexes
- **FinanceRecord:** `@@index([organizationId, recordDate, metricType])`
  - **Rationale:** Optimizes analytical queries calculating monthly turnover, revenue, or expense totals by tenant.
- **AuditLog:** `@@index([organizationId, actorUserId, action])`
  - **Rationale:** Speeds up compliance audit searches across high-volume security logs.
- **Invoice:** `@@index([companyId, dueDate])`
  - **Rationale:** Accelerates accounts payable/receivable overdue processing routines.

### Soft Delete Indexing
- Every high-cardinality model (`Organization`, `Company`, `User`, `Employee`, `FinanceRecord`) includes `@@index([deletedAt])` to allow high-speed filtering (`WHERE deleted_at IS NULL`).

---

## 2. Large Dataset & Pagination Protocols

1. **Keyset (Cursor-Based) Pagination:** High-throughput listing endpoints must use cursor pagination on indexed timestamp/UUID fields (`take: 50, cursor: { id: last_id }`) instead of `OFFSET-FETCH`.
2. **Covering Indexes:** Frequently queried columns (e.g. `user_id` and `is_read` on `notifications`) are covered by composite index `@@index([userId, isRead])`.

---

## 3. Database Scaling & Partitioning Roadmap

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Scale Threshold           │ Architecture Strategy & Database Topology              │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ < 10 Million Records      │ Single PostgreSQL Primary Instance (Read-Replica Optional)│
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ 10M - 100M Records        │ PostgreSQL Native Range Partitioning on `FinanceRecord`│
│                           │ by `record_date` (Quarterly/Annual Partitions)         │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ > 100M Records            │ Horizontal Sharding by `organization_id` using Citus   │
│                           │ or Azure Cosmos DB for PostgreSQL                      │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
