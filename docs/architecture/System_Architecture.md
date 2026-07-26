# System Architecture — FinTrack Pro Enterprise AI Finance Management Platform

## 1. Executive Summary
FinTrack Pro is an enterprise-grade AI-powered Finance Management Platform designed to deliver real-time financial tracking, multi-tenant billing, AI-driven chat insights, automated PowerBI/Excel/PPT reporting, and fine-grained enterprise security. This document details the high-level system topology, container orchestration, microservices boundaries, network security zones, multi-tenancy layout, and data flow architecture.

---

## 2. Enterprise System Topology & Container Layout

```mermaid
graph TD
    Client[Web Browser / Mobile Client] --> CloudFlare[Cloudflare WAF / CDN]
    CloudFlare --> Ingress[Nginx Ingress / AWS ALB]
    
    subgraph Security Zone: Demilitarized Zone (DMZ)
        Ingress --> WebApp[Next.js App Router Node.js Cluster]
    End

    subgraph Security Zone: Application Tier (VPC Private Subnet)
        WebApp --> AuthSvc[Auth & Session Service]
        WebApp --> BillingSvc[Billing & Revenue Engine]
        WebApp --> AISvc[AI Processing Engine]
        WebApp --> ReportSvc[Reporting & Export Engine]
        WebApp --> ShareSvc[Share Valuation Engine]
    End

    subgraph Security Zone: Data Tier (Encrypted Private Subnet)
        AuthSvc & BillingSvc & AISvc & ReportSvc & ShareSvc --> Postgres[(PostgreSQL 16 Cluster - Primary/Replica)]
        AuthSvc & AISvc --> Redis[(Redis 7 Cluster - Session & Cache)]
    End

    subgraph Security Zone: External Integrations
        BillingSvc --> Stripe[Stripe API / Webhook]
        AISvc --> LLMProvider[OpenAI / Azure AI / Anthropic API]
        ReportSvc --> MSFT[PowerBI / Office Services]
    End
```

---

## 3. Microservices & Layered Boundary Definitions

1. **Ingress & Edge Layer**:
   - Cloudflare Edge WAF handles DDoS protection, TLS termination, SSL enforcement, and geo-ip filtering.
   - Nginx / Cloud Load Balancer routes external HTTPS requests to Next.js API endpoints and dynamic page routes.

2. **Presentation & Application Layer (Next.js 14 App Router)**:
   - Server-Side Rendering (SSR) for initial layout load.
   - Client Component hydration with React 18 for interactive state management.
   - Next.js API Routes (`/src/app/api/...`) providing RESTful HTTP services.

3. **Core Domain Services (`src/lib/services`)**:
   - `auth.ts`: Authentication, MFA validation, JWT verification, RBAC enforcement.
   - `billing-service.ts`: Subscription lifecycle, tiered pricing, invoice calculation, Stripe webhooks.
   - `ai-service.ts`: Prompt engineering, LLM query routing, context building, token tracking.
   - `reporting-service.ts`: Financial ledger aggregation, PPTX generation, CSV parsing, PowerBI integration.
   - `share-valuation.ts`: Asset calculation, NPV modeling, equity tracking.

4. **Data Persistence & Cache Layer**:
   - **PostgreSQL 16 (Primary DB)**: Relational storage for users, tenants, audit logs, financial records, subscriptions, and share transactions.
   - **Redis 7 (Distributed Cache & Lock)**: JWT revocation blacklist, session store, rate limiting counters, and AI prompt caching.

---

## 4. Multi-Tenant Architecture & Isolation Model

- **Logical Tenant Isolation**: Every financial record, audit entry, and AI conversation thread is scoped by `tenantId` (or `companyId`).
- **Row-Level Security (RLS)**: Enforced through Prisma middleware and database service layer wrappers.
- **Tenant Context Propagation**: Extracted from validated JWT tokens or session cookies and injected into every database transaction context.

---

## 5. Security Zoning & Network Isolation

- **Zone 0 (Public Internet)**: Untrusted traffic, protected by Cloudflare Edge rules and HTTPS-only policy.
- **Zone 1 (DMZ / Web Tier)**: Next.js frontend server instances behind load balancers with non-root Docker container isolation.
- **Zone 2 (Private VPC App Tier)**: Internal services communicating over mTLS / VPC-internal private IPs.
- **Zone 3 (Restricted Data Tier)**: Database and Redis clusters accessible exclusively from App Tier IPs with AES-256 encryption at rest.

---

## 6. High Availability & Disaster Recovery Topology

- **Multi-AZ Deployment**: Web instances distributed across at least 3 Availability Zones.
- **PostgreSQL Replication**: Active primary with synchronous read-replicas in secondary AZs and automated failover via Patroni/PgBouncer.
- **Redis High Availability**: Redis Sentinel mode with automated primary failover and RDB/AOF persistence.

---
