# Developer Database Platform & Usage Guide

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Engineering Operational Guide  
**Classification:** Enterprise Internal Guide  
**Version:** 2.0.0  

---

## 1. Executive Summary & Guidelines

This guide provides engineers working on **FinTrack Pro** with standard patterns for database access, repository creation, transaction management, and database performance optimization.

All database interactions must pass through the **Database Platform Layer** (`src/lib/db`). Direct raw `process.env` connection lookups or unhandled ORM queries are strictly prohibited.

---

## 2. Platform Directory & Architecture Layout

```text
src/lib/db/
├── client.ts         # Singleton Prisma Client with HMR protection & event listeners
├── connection.ts     # Database Connection Manager (lifecycle, ping, shutdown)
├── health.ts         # Health Check Engine (Readiness, Liveness, Prometheus metrics)
├── logger.ts         # Database Logger with sensitive parameter masking
├── provider.ts       # Database Provider abstraction & dependency root
├── repository.ts     # Abstract Base Repository with CRUD, pagination & soft deletes
├── transaction.ts    # Transaction Manager with retry logic & isolation levels
└── index.ts          # Central export module for database platform
```

---

## 3. Developer Workflow: Creating a New Domain Repository

When introducing a new database model (e.g., `FinanceRecord`), create a concrete repository extending `BaseRepository<T>`:

```typescript
import { BaseRepository, TransactionClient } from '@/lib/db';
import { FinanceRecord } from '@prisma/client';

export class FinanceRecordRepository extends BaseRepository<FinanceRecord> {
  // Specify the exact model property name on Prisma Client
  protected readonly modelName = 'financeRecord';

  /**
   * Custom domain-specific query method
   */
  public async findByDepartment(
    departmentId: string,
    tx?: TransactionClient
  ): Promise<FinanceRecord[]> {
    return await this.findMany({ departmentId }, tx);
  }
}

export const financeRecordRepository = new FinanceRecordRepository();
```

---

## 4. How Engineers Execute Transactions

To execute multi-step database mutations atomically across multiple repositories:

```typescript
import { dbProvider } from '@/lib/db';
import { userRepository } from '@/modules/user/user.repository';
import { auditLogRepository } from '@/modules/audit/audit.repository';

export async function deactivateUserAccount(userId: string, adminId: string): Promise<boolean> {
  const txManager = dbProvider.getTransactionManager();

  return await txManager.executeTransaction(async (tx) => {
    // Pass the transaction client `tx` to all repository methods
    const userDeactivated = await userRepository.softDelete(userId, tx);

    if (!userDeactivated) {
      throw new Error(`Failed to deactivate user account ${userId}`);
    }

    await auditLogRepository.create(
      {
        action: 'USER_DEACTIVATION',
        targetId: userId,
        performedBy: adminId,
      },
      tx
    );

    return true;
  });
}
```

---

## 5. Common Mistakes & Anti-Patterns to Avoid

| Anti-Pattern | Why It Breaks Enterprise Rules | Correct Enterprise Pattern |
| :--- | :--- | :--- |
| **Direct ORM Import:** `import { PrismaClient } from '@prisma/client'` in business code | Bypasses connection pooling, HMR protection, and query logging. | Use `dbProvider.getClient()` or concrete repository extending `BaseRepository`. |
| **Forgetting Transaction Client `tx`:** Executing operations inside `executeTransaction` without passing `tx` to repository methods. | Causes queries to run OUTSIDE the transaction, breaking atomicity and causing deadlocks. | Always pass `tx` as the last parameter to repository methods within transactions. |
| **Hardcoding Page Sizes:** `model.findMany({ take: 100000 })` | Causes server memory exhaustion and database lock contention. | Use `repository.paginate({ page: 1, pageSize: 20 })`. Max allowed page size is 100. |
| **Hard-Deleting Financial Records:** Using `delete()` instead of `softDelete()`. | Violates SOC2 and financial auditing rules requiring historical trail preservation. | Always call `repository.softDelete(id)` for domain entities. |
| **Logging Passwords or PII:** Logging unmasked financial records or passwords. | Violates GDPR and PCI-DSS compliance standards. | Always pass data through `dbLogger`, which automatically redacts sensitive fields. |

---

## 6. Performance & Security Recommendations

1. **Always Use Indexed Fields in `where` Clauses:** Ensure queries filter on primary keys, foreign keys, or fields with explicit B-Tree / GIN indexes.
2. **Selective Field Projection:** When reading large datasets, use `select` or customized repository methods to fetch only required columns rather than heavy full-table objects.
3. **Optimistic Locking:** Utilize the `version` field for updates on concurrent records to detect conflicting updates before committing.
4. **Transaction Timeouts:** Keep transaction callbacks short. Never perform HTTP network requests, third-party API calls, or heavy AI generation inside a database transaction block.

---

## 7. Architectural Evaluation Matrix

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Dimension                 │ Architectural Impact & System Benefit                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Technical Reasoning       │ Standardized repository patterns enforce consistent     │
│                           │ data access without code fragmentation                 │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Security Implications     │ Mandatory soft-deletion filtering and automated log    │
│                           │ masking protect user data integrity and privacy       │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Scalability Considerations│ Standardized pagination caps prevent unbounded memory   │
│                           │ consumption across application server pods             │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Operational Considerations│ Formatted diagnostic logs pin down slow queries        │
│                           │ instantly during production monitoring                 │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Maintainability Guidance  │ Clean abstraction layer isolates ORM mechanics from     │
│                           │ core business service logic                            │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
