# Enterprise Database Platform Architecture Specification

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Database Platform Architecture Specification  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Platform Rationale

In **FinTrack Pro**, an enterprise financial management platform handling ledger calculations, multi-currency transaction streams, payroll records, and grounded AI forecasting, database configuration and access must be treated as a zero-trust, highly resilient platform foundation.

Direct ORM instantiation, unpooled connections, unhandled transaction rollbacks, or missing query observability lead to connection pool exhaustion, silent financial corruption, un-audited mutations, and production outages. This document defines the master architecture for the **FinTrack Pro Database Platform Foundation**, implemented via PostgreSQL, Prisma ORM, TypeScript, and Zod.

---

## 2. Platform Architecture & Layering Model

The database platform strictly follows Clean Architecture and Dependency Inversion principles:

```text
┌────────────────────────────────────────────────────────┐
│             Application Services / Repositories        │
│          (Consume `IBaseRepository<T>` / `dbProvider`) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Database Provider Abstraction              │
│                 (`DatabaseProvider`)                   │
└───────┬───────────────────┼────────────────────┬───────┘
        │                   │                    │
        ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌─────────────────┐
│ Connection   │    │ Transaction  │    │ Observability   │
│ Manager      │    │ Manager      │    │ & Logger        │
└───────┬──────┘    └───────┬──────┘    └────────┬────────┘
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            Enterprise Singleton Prisma Client          │
│            (`src/lib/db/client.ts`)                    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            PostgreSQL Connection Pool (PgBouncer)      │
└────────────────────────────────────────────────────────┘
```

---

## 3. Core Architectural Pillars

### 1. Prisma Installation & Singleton Client Pattern
- **Prisma Version:** Latest stable Prisma ORM (v5.x / v6.x).
- **HMR Protection:** During Next.js 15 local development, process re-evaluations create duplicate Prisma Client instances if attached directly to local modules. The platform attaches the client instance to `globalThis.globalPrisma` in development to guarantee a single client instance.
- **Event-Driven Loggers:** Event listeners (`client.$on('query')`, `client.$on('error')`) emit structured JSON logs for query execution and engine warnings.

- **Technical Reasoning:** Prevents connection leak crashes (`Too many connections for role...`) during local development.
- **Security Implications:** Centralized client setup prevents accidental raw SQL execution without parameterization.
- **Scalability Considerations:** Ensures worker processes maintain a bounded connection footprint.
- **Operational Considerations:** Single point of attachment for performance metrics.
- **Maintainability Guidance:** Developers import `prismaClient` or `dbProvider.getClient()` exclusively.

---

### 2. Database Connectivity & Pool Lifecycle
- **Connection Lifecycle:** Explicit startup sequence initializes database connectivity via `connectionManager.initializeConnection()`, verifying ping readiness with retries before serving HTTP requests.
- **Graceful Shutdown:** Listeners for OS termination signals (`SIGINT`, `SIGTERM`) execute `connectionManager.disconnect()`, draining active transactions and releasing network sockets cleanly.
- **Auto-Reconnection Policy:** Transient network hiccups trigger exponential backoff reconnection attempts up to 3 retries.

- **Technical Reasoning:** Ensures application nodes do not accept network traffic while in an un-connected DB state.
- **Security Implications:** Prevents lingering un-closed database sockets during node termination.
- **Scalability Considerations:** Operates seamlessly with serverless PgBouncer / RDS Proxy connection poolers.
- **Operational Considerations:** Instant node health evaluation prevents routing traffic to failed DB pods.
- **Maintainability Guidance:** Standardized lifecycle routines eliminate custom process cleanup code.

---

### 3. Database Provider Abstraction Layer
- **Isolation of ORM:** Business services NEVER import `@prisma/client` directly. Services interact strictly with domain repositories extending `BaseRepository<T>` or request tools via `DatabaseProvider.getInstance()`.
- **Repository Base Class:** `BaseRepository<T>` defines standard CRUD, soft-deletion filters (`deletedAt: null`), pagination math (`paginate()`), and transaction propagation context.

- **Technical Reasoning:** Prevents ORM vendor lock-in and isolates database access patterns.
- **Security Implications:** Standardized soft-delete filters ensure soft-deleted financial records are excluded by default.
- **Scalability Considerations:** Repositories enforce page-size boundaries ($\le 100$) on query results to prevent memory bloat.
- **Operational Considerations:** Unified interface simplifies adding caching decorators or read-replica routers.
- **Maintainability Guidance:** Uniform repository methods reduce code duplication across domain modules.

---

### 4. Enterprise Transaction Architecture
- **Interactive Transactions:** Complex multi-record operations execute inside `transactionManager.executeTransaction(async (tx) => { ... })`.
- **Isolation Level Enforcement:** Default isolation level set to `Serializable` or `ReadCommitted` based on sensitivity.
- **Deadlock Auto-Retry:** Handles PostgreSQL serialization failures and deadlocks (Prisma error code `P2034`) by automatically retrying transaction execution with exponential backoff.
- **Timeout Safeguards:** Transactions enforce strict execution time caps (default 5000ms) to prevent long-running table locks.

- **Technical Reasoning:** Guarantees strict ACID compliance across financial ledger entries.
- **Security Implications:** Prevents dirty reads, non-repeatable reads, and financial double-spending race conditions.
- **Scalability Considerations:** Automated retries resolve transient lock contention during concurrent write surges.
- **Operational Considerations:** Timeout caps kill runaway queries before they impact overall database throughput.
- **Maintainability Guidance:** Clear rules define when transactions are required vs when single atomic queries suffice.

---

### 5. Sensitive Data Log Masking & Observability
- **Sensitive Parameter Redaction:** `DatabaseLogger` inspects query parameters and automatically masks sensitive fields (`password`, `jwt_secret`, `mfa_secret`, `ssn`, `bank_account_number`).
- **Slow Query Threshold:** Queries taking longer than 200ms trigger high-priority `WARN` logs (`[SLOW QUERY DETECTED]`).
- **Prometheus Observability:** `DatabaseHealthCheck` exports real-time metrics (`fintrack_db_connected`, `fintrack_db_ping_latency_ms`, `fintrack_db_reconnect_attempts_total`) for Grafana monitoring dashboards.

- **Technical Reasoning:** Provides complete database query visibility without compromising user PII or credentials.
- **Security Implications:** Guarantees SOC2 compliance by preventing secrets from landing in central log collectors.
- **Scalability Considerations:** Prometheus exposition endpoint enables real-time auto-scaling triggers based on query latency.
- **Operational Considerations:** Slow query alerts pinpoint un-indexed queries instantly.
- **Maintainability Guidance:** Standardized log structure simplifies log aggregation in Datadog / Application Insights.

---

### 6. Performance Engineering & Future Scaling
- **Prepared Statements:** Built-in statement caching in PostgreSQL and Prisma reduces query parsing overhead.
- **Batching & Bulk Operations:** Multi-record insertions use `createMany` or `$transaction` batching.
- **Future Read Replica Routing:** The provider layer is pre-structured to split read operations (`findMany`, `findById`) to read-replicas while routing write mutations (`create`, `update`, `delete`) to the primary database.
- **Declarative Partitioning Strategy:** Large audit and time-series tables (`audit_logs`, `share_values`) are architected for PostgreSQL native range partitioning by `created_at` timestamp.

---

## 4. Architectural Summary & Compliance Index

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Architecture Pillar       │ Enterprise Standard Compliance Status                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Singleton Client Pattern  │ Enforced via globalThis HMR protection                 │
│ Connection Pooling        │ Configured for PgBouncer / RDS Proxy compatibility     │
│ Repository Abstraction    │ Implemented via `BaseRepository<T>` and `IBaseRepository`│
│ Transaction Retries       │ Automated exponential backoff for P2034 deadlocks      │
│ Sensitive Data Masking    │ Automated redaction for credentials and PII parameters  │
│ Health Diagnostics        │ Liveness, Readiness, and Prometheus metrics exported   │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
