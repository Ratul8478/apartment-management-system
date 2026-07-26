# Architecture Decision Records (ADR Log) — FinTrack Pro

This document records key architectural decisions made during the design and evolution of the FinTrack Pro platform, including context, options evaluated, rationale, and consequences.

---

## ADR-001: Next.js 14 App Router Framework Adoption

### Context
We required a modern, performant React web framework with built-in server-side rendering (SSR), API route handling, robust layout streaming, and strong TypeScript support.

### Options Evaluated
1. **Next.js 14 (App Router)**
2. **Vite + React SPA + Express API Backend**
3. **Remix Run**

### Decision
Adopted **Next.js 14 App Router**.

### Rationale
Next.js 14 provides seamless unified full-stack architecture, built-in API route handling, automatic bundle splitting, server component performance benefits, and simplified Vercel/Container deployment pipelines.

### Consequences
- **Positive**: Reduced infrastructure complexity (single deployment artifact), fast SSR page loads, strong ecosystem.
- **Negative**: Requires strict discipline to separate client vs server components (`"use client"`).

---

## ADR-002: Prisma ORM with PostgreSQL Database Engine

### Context
The platform requires strong ACID compliance, complex relational financial data models, type-safe query generation, schema migrations, and high concurrency.

### Options Evaluated
1. **PostgreSQL 16 + Prisma ORM**
2. **MongoDB + Mongoose**
3. **PostgreSQL + TypeORM**

### Decision
Adopted **PostgreSQL 16 with Prisma ORM**.

### Rationale
Financial ledgers require strict schema constraints and ACID transaction semantics. Prisma provides end-to-end type safety, automated migration management, and excellent developer experience.

### Consequences
- **Positive**: Compile-time type verification, auto-generated TypeScript clients, clean migration tracking.
- **Negative**: Schema changes require Prisma schema updates and migration runs.

---

## ADR-003: Redis for Distributed Caching, Rate Limiting & Revocation List

### Context
High-traffic endpoints (AI completion, auth verification, financial summaries) require low-latency response times (< 10ms) and centralized rate-limiting.

### Options Evaluated
1. **Redis 7 (In-Memory Data Store)**
2. **Memcached**
3. **In-Memory Node.js Map**

### Decision
Adopted **Redis 7 Cluster**.

### Rationale
Redis supports key expiration, atomic operations for rate-limiting counters, pub/sub signaling, and distributed JWT revocation blacklist across web cluster instances.

### Consequences
- **Positive**: Sub-millisecond cache latency, atomic rate-limiting, horizontally scalable.
- **Negative**: Requires maintaining Redis container/service cluster.

---

## ADR-004: Tailored HSL CSS Design System + Tailwind Utilities

### Context
The user interface must convey a high-end, modern, enterprise aesthetic with vibrant custom dark/light color schemes, dynamic micro-animations, and glassmorphism without relying on generic default UI kits.

### Decision
Adopted **Tailored HSL CSS Variable Tokens paired with Tailwind CSS utilities**.

### Rationale
Provides maximum visual control, custom color token mapping in `UI_Tokens.md` / `globals.css`, and lightweight zero-runtime CSS bundle sizes.

---
