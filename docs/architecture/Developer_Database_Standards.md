# Enterprise Developer Database Standards & Anti-Patterns

**System Name:** FinTrack Pro  
**Document Type:** Database Development Guidelines & Anti-Pattern Prevention  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Naming & Case Conventions

1. **Prisma Models:** UpperCamelCase (PascalCase) singular nouns (`Organization`, `FinanceRecord`, `AiChatSession`).
2. **Database Tables:** `snake_case` plural nouns via `@map()` annotation (`organizations`, `finance_records`, `ai_chat_sessions`).
3. **Model Fields:** `camelCase` for TypeScript application code (`recordDate`, `metricType`, `isMfaEnabled`).
4. **Database Columns:** `snake_case` via `@map()` annotation (`record_date`, `metric_type`, `is_mfa_enabled`).
5. **Foreign Key Fields:** Standard suffix `Id` (`organizationId`, `createdById`, `companyId`).

---

## 2. Mandatory Code Review Checklist

Before merging any PR containing database schema changes, verify:

- [x] Every new table includes `@map("plural_snake_case")`.
- [x] Primary key is `id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid`.
- [x] Financial monetary amounts use `@db.Decimal(18, 2)` (NEVER `@db.Float` or `@db.DoublePrecision`).
- [x] Foreign keys include explicit `onDelete` rules (`Cascade`, `Restrict`, or `SetNull`).
- [x] High-cardinality query fields and multi-tenant keys have index definitions.
- [x] Soft-deletable models include `deletedAt DateTime? @map("deleted_at") @db.Timestamp()` and `@@index([deletedAt])`.
- [x] Schema validates cleanly via `npx prisma validate`.

---

## 3. Top 5 Database Anti-Patterns (STRICTLY PROHIBITED)

1. ❌ **Floating-Point Currency:** Storing monetary values as `FLOAT` or `DOUBLE` leads to binary rounding errors. Always use `DECIMAL(18, 2)`.
2. ❌ **Unindexed Multi-Tenant Keys:** Querying `WHERE organization_id = ?` without an index causes full table scans across millions of records.
3. ❌ **Hard Database Deletes on Financial History:** Running `DELETE FROM finance_records` violates accounting auditability. Always use `deletedAt` soft deletes or `status = REJECTED`.
4. ❌ **Missing Foreign Key onDelete Specifications:** Omitting `onDelete` leads to database vendor defaults that cause runtime constraint exceptions.
5. ❌ **Schema Drift:** Modifying database structure manually without versioned Prisma migrations is strictly forbidden.
