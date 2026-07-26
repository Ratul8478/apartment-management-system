# Enterprise Database Testing Strategy & Architecture

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Testing Strategy & Architecture Standard  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Testing Rationale

In **FinTrack Pro**, database operations govern core financial ledger accuracy, tenant data isolation, and transactional consistency. Database testing requires deterministic, isolated, fast-executing test suites across three testing tiers:

1. **Unit Testing:** In-memory mocked database testing for service-level business logic.
2. **Integration Testing:** Real PostgreSQL container testing via Docker TestContainers for repository queries and transactions.
3. **End-to-End (E2E) Testing:** Full platform suite runs executed in isolated ephemeral staging databases.

---

## 2. Three-Tier Database Testing Architecture

```text
┌────────────────────────────────────────────────────────┐
│                      Unit Tests                        │
│      (Mocked Prisma Client / Fast / 0 Database I/O)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Integration Tests                    │
│     (Docker TestContainers / Real PostgreSQL Engine)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                    E2E System Tests                    │
│       (Ephemeral Staging DB / Production Parity)       │
└────────────────────────────────────────────────────────┘
```

---

## 3. Tier 1: Unit Testing with Mocked Prisma Client

For fast-executing unit tests covering business services, mock the database provider or Prisma Client using `jest-mock-extended` or custom mock repositories:

```typescript
import { IBaseRepository } from '@/lib/db';
import { FinanceRecord } from '@prisma/client';

export class MockFinanceRecordRepository implements IBaseRepository<FinanceRecord> {
  private records: Map<string, FinanceRecord> = new Map();

  public async findById(id: string): Promise<FinanceRecord | null> {
    return this.records.get(id) || null;
  }

  public async findMany(): Promise<FinanceRecord[]> {
    return Array.from(this.records.values());
  }

  public async create(data: Record<string, unknown>): Promise<FinanceRecord> {
    const record = { id: 'mock-uuid-1', createdAt: new Date(), ...data } as FinanceRecord;
    this.records.set(record.id, record);
    return record;
  }

  // Implementation of remaining IBaseRepository methods...
  public async paginate() { throw new Error('Not implemented'); }
  public async update() { throw new Error('Not implemented'); }
  public async softDelete() { return true; }
  public async delete() { return true; }
  public async count() { return this.records.size; }
}
```

---

## 4. Tier 2: Integration Testing with Docker TestContainers

Integration tests execute real raw SQL and Prisma migrations against a dedicated PostgreSQL 16 Docker container spawned dynamically via `@testcontainers/postgresql`:

### 1. TestContainer Setup Protocol
```typescript
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { dbProvider } from '@/lib/db';

let container: StartedPostgreSqlContainer;

export async function setupTestDatabase(): Promise<void> {
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('fintrack_test')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();

  const connectionUri = container.getConnectionUri();
  process.env.DATABASE_URL = connectionUri;

  // Run Prisma migrations on the ephemeral test database
  execSync('npx prisma migrate deploy', { env: process.env });

  // Initialize DB Provider connection
  await dbProvider.initialize();
}

export async function teardownTestDatabase(): Promise<void> {
  await dbProvider.shutdown();
  await container.stop();
}
```

### 2. Transaction Isolation per Test
To ensure tests do not contaminate shared state, each integration test runs inside a transaction that is automatically rolled back upon test completion:

```typescript
describe('FinanceRecordRepository Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('should insert and retrieve a financial record inside isolated test runner', async () => {
    const txManager = dbProvider.getTransactionManager();

    await txManager.executeTransaction(async (tx) => {
      const record = await financeRecordRepository.create(
        {
          amount: 50000.0,
          currency: 'INR',
          description: 'Q3 Software Licensing Revenue',
        },
        tx
      );

      expect(record.id).toBeDefined();
      expect(record.amount).toBe(50000.0);

      // Force intentional test rollback to clean state
      throw new Error('TEST_ROLLBACK');
    }).catch((err) => {
      if (err.message !== 'TEST_ROLLBACK') throw err;
    });
  });
});
```

---

## 5. CI/CD Automated Test Pipeline Integration

In GitHub Actions continuous integration pipelines:

1. **Ephemeral Runner Containers:** GitHub runner spawns a PostgreSQL service container.
2. **Schema Verification:** `npx prisma validate` confirms `schema.prisma` integrity.
3. **Migration Test:** `npx prisma migrate status` checks for pending schema migrations.
4. **Integration Test Suite Execution:** `npm run test:integration` executes the test suite against the ephemeral database.

---

## 6. Architectural Evaluation Matrix

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Dimension                 │ Architectural Impact & System Benefit                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Technical Reasoning       │ TestContainers provide 100% database engine parity     │
│                           │ without relying on external shared cloud databases     │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Security Implications     │ Ephemeral test containers prevent real customer data   │
│                           │ from leaking into test artifacts                       │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Scalability Considerations│ Parallel CI runners execute isolated test containers    │
│                           │ without database port conflicts                        │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Operational Considerations│ Automated transaction rollbacks keep test runs fast     │
│                           │ and deterministic                                      │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Maintainability Guidance  │ Mock repository interfaces enable fast unit testing    │
│                           │ without spinning up heavy containers                   │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
