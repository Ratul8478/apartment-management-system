# Enterprise Configuration Architecture Specification

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Core Architecture Specification  
**Classification:** Enterprise Internal Architecture Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Configuration Philosophy

Configuration management in **FinTrack Pro** is treated as a zero-trust, first-class architectural concern. In high-stakes enterprise AI financial platforms processing multi-currency ledgers, payroll records, corporate balance sheets, and grounded AI cash flow forecasts, configuration errors can result in data exposure, financial inaccuracy, security breaches, or regulatory non-compliance (SOC2 Type II, ISO 27001, PCI-DSS).

Hardcoded environment variables, ad-hoc string lookups via raw `process.env`, unvalidated runtime accesses, and plain-text secrets stored in Git are strictly forbidden. The system mandates a centralized, type-safe, immutable, fail-fast configuration architecture enforced at container startup.

---

## 2. Fundamental Configuration Principles

### 1. Twelve-Factor App Methodology Alignment (Factor III: Config)
Application source code is strictly separated from configuration artifacts. All parameters that vary across deployment environments (database endpoints, private signing keys, API credentials, log levels, feature flags) are injected into container runtimes via process environment variables at boot time. Binaries and container images are compiled once and promoted unchanged through the environment pipeline.

- **Technical Reasoning:** Promotes true container immutability and continuous delivery.
- **Security Implications:** Eliminates hardcoded environment secrets inside application binaries or client bundles.
- **Scalability Considerations:** Enables horizontal container scaling without rebuilding code artifacts.
- **Operational Considerations:** Simplifies environment promotion in Kubernetes or ECS clusters.
- **Maintainability Guidance:** Developers configure variables in runtime descriptors without altering source files.

### 2. Strict Configuration Isolation & Zero Code Contamination
Environment variables MUST NEVER be accessed directly using `process.env.VARIABLE_NAME` in business services, UI components, or data repositories. All configuration access is routed strictly through the frozen, validated configuration export module (`import { env } from '@/lib/config/env'`).

- **Technical Reasoning:** Prevents fragmented configuration access and unvalidated runtime lookups.
- **Security Implications:** Prevents accidental leakage of server secrets into public client React bundles.
- **Scalability Considerations:** Facilitates future migration to centralized configuration microservices or cloud parameter stores.
- **Operational Considerations:** Provides a single locus for auditing all environment parameter dependencies.
- **Maintainability Guidance:** Developers receive instant TypeScript autocompletion and type guarantees for all configuration properties.

### 3. Immutable Infrastructure & Environment Parity
Configuration settings treat runtime container environments as immutable. Changing a configuration key requires updating the Cloud Secrets Manager or deployment descriptor, followed by a zero-downtime rolling deployment. Development, Staging, and Production maintain 100% architectural parity, differing exclusively in environment values and infrastructure targets.

- **Technical Reasoning:** Eliminates drift-induced edge cases where code behaves differently in production than in staging.
- **Security Implications:** Guarantees production security controls are tested end-to-end in staging.
- **Scalability Considerations:** Ensures load testing in staging accurately reflects production cluster characteristics.
- **Operational Considerations:** Simplifies diagnostic triage by removing host-specific configuration anomalies.
- **Maintainability Guidance:** Reduces developer context-switching between environment configurations.

### 4. Fail-Fast Startup Validation
An enterprise application must NEVER boot in a partially valid state. If an environment variable is missing, malformed, out of range, or structurally invalid (e.g., weak encryption key, invalid URL format), the process MUST execute a safe, diagnostic crash (`process.exit(1)`) before binding to network ports or accepting database connections.

- **Technical Reasoning:** Catches invalid environments instantly during CI/CD pre-flight checks or deployment container startup.
- **Security Implications:** Prevents operating under weak default security keys or unencrypted endpoints.
- **Scalability Considerations:** Prevents damaged nodes from joining active load-balancer pools.
- **Operational Considerations:** Saves hours of debugging runtime `undefined` failures deep within transaction handlers.
- **Maintainability Guidance:** Formatted terminal logs highlight the exact key name and remediation steps.

### 5. Financial Software Security & Compliance Rigor
Financial systems require stringent data isolation and auditability. Centralized configuration guarantees that encryption master keys, JWT secrets, and database credentials undergo mandatory schema verification and zero-trust isolation.

- **Technical Reasoning:** Enforces compliance requirements programmatically at build and boot.
- **Security Implications:** Prevents unauthorized data access across tenant or environment boundaries.
- **Scalability Considerations:** Supports multi-jurisdiction compliance requirements (GDPR, SOC2).
- **Operational Considerations:** Produces audit-ready environment metadata without revealing secret values.
- **Maintainability Guidance:** Standardized key formats streamline quarterly compliance audits.

---

## 3. Centralized Loading & Validation Architecture

The configuration loading lifecycle combines `dotenv`, `dotenv-expand`, and **Zod** schema validation into a synchronous boot sequence:

```text
┌────────────────────────────────────────────────────────┐
│               OS Process Environment /                 │
│                 Container Runtime                      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             dotenv & dotenv-expand Parsing             │
│        (Loads .env.local + Variable Expansion)         │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Zod Schema Parsing                     │
│      (Type Coercion, Format & Constraint Checks)       │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
    (Validation Success)        (Validation Failure)
              │                           │
              ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│ Export Frozen `env` Object│   │  Fatal Startup Crash      │
│  `Object.freeze(parsed)`  │   │   `process.exit(1)`       │
└───────────────────────────┘   └───────────────────────────┘
```

### Loading Sequence
1. **Process Environment Hydration:** Node.js process environment is populated via host environment variables or `.env.local` file parsing. `dotenv-expand` handles nested variable resolution (e.g., `BASE_URL="http://${HOST}:${PORT}"`).
2. **Schema Ingestion:** `src/lib/config/schema.ts` processes `process.env`. Strings are type-coerced into numbers, booleans, or parsed objects according to domain rules.
3. **Fail-Fast Assertion:** If Zod reports validation errors, `src/lib/config/env.ts` formats a diagnostic error block and terminates the process immediately.
4. **Frozen Export:** On validation success, `Object.freeze()` is executed on the output object to prevent runtime modification, exporting `env`.

---

## 4. Client vs. Server Boundary Security

Next.js 15 isolates client-side bundle code from server runtimes:

| Category | Variable Prefix | Bundled into Browser JS? | Access Scope | Examples |
| :--- | :--- | :---: | :--- | :--- |
| **Server-Only Secrets** | *No Prefix* | ❌ NEVER | Node.js Server Runtime, API Routes, Server Actions | `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY` |
| **Client Public Config** | `NEXT_PUBLIC_` | ✅ YES | Browser DOM, React Client Components, Custom Hooks | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_ENV` |

> [!CAUTION]
> **Client Secret Exposure Risk:**
> NEVER attach the `NEXT_PUBLIC_` prefix to private credentials, database connection strings, or encryption keys. Any variable prefixed with `NEXT_PUBLIC_` is inlined into public JavaScript build artifacts and is visible to anyone inspecting web application source files.

---

## 5. Logical Configuration Categories (12 Core Domains)

### 1. Application Core (`APP`)
- **Responsibility:** Application identity, active environment tier, public URL base, process timezone, and base currency.
- **Variables:** `NODE_ENV`, `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APP_URL`, `PORT`, `TZ`, `APP_BASE_CURRENCY`.
- **Validation:** `NEXT_PUBLIC_APP_URL` must be a valid HTTP/HTTPS URL; `APP_BASE_CURRENCY` must be an ISO 4217 code.

### 2. Authentication & Session Security (`AUTH`)
- **Responsibility:** JWT token signing keys, OAuth endpoints, session timeouts, NextAuth secret keys.
- **Variables:** `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `SESSION_MAX_AGE`.
- **Validation:** Secrets must meet a minimum length of 32 characters in production.

### 3. Database Persistence (`DATABASE`)
- **Responsibility:** Relational database connections, pool sizes, connection timeouts, migration targets.
- **Variables:** `DATABASE_URL`, `DIRECT_URL`, `DB_POOL_MIN`, `DB_POOL_MAX`, `DB_CONNECTION_TIMEOUT`.
- **Validation:** Valid PostgreSQL URI strings; `DB_POOL_MAX` must be $\ge$ `DB_POOL_MIN`.

### 4. Cache & Memory Store (`REDIS`)
- **Responsibility:** Redis endpoint host, port, password, TLS security flag, and default TTL settings.
- **Variables:** `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS_ENABLED`, `REDIS_CACHE_TTL`.
- **Validation:** Valid hostname or IP address; `REDIS_PORT` between 1 and 65535.

### 5. Email & Communication (`EMAIL`)
- **Responsibility:** Transactional email SMTP credentials, sender identity, and transport parameters.
- **Variables:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM_ADDRESS`.
- **Validation:** `EMAIL_FROM_ADDRESS` must be a valid email string.

### 6. File & Object Storage (`STORAGE`)
- **Responsibility:** Document upload storage provider (local vs S3 vs Supabase), bucket names, AWS region, and access keys.
- **Variables:** `STORAGE_PROVIDER`, `S3_BUCKET_NAME`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
- **Validation:** Enums constrained to `['local', 's3', 'supabase']`.

### 7. Grounded AI Provider (`AI`)
- **Responsibility:** OpenAI/Claude LLM API keys, target model identifier, max token limits, request timeout windows.
- **Variables:** `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `AI_MODEL_PRIMARY`, `AI_MAX_TOKENS`, `AI_REQUEST_TIMEOUT`.
- **Validation:** Token thresholds must be positive integers; timeout values $\ge$ 1000ms.

### 8. Logging & Observability (`LOGGING`)
- **Responsibility:** Application logging verbosity, log output format (json vs pretty), APM ingestion keys.
- **Variables:** `LOG_LEVEL`, `LOG_FORMAT`, `APPLICATIONINSIGHTS_CONNECTION_STRING`.
- **Validation:** Log levels restricted to `['fatal', 'error', 'warn', 'info', 'debug', 'trace']`.

### 9. System Security & Encryption (`SECURITY`)
- **Responsibility:** Master encryption keys for data-at-rest encryption (AES-256-GCM), CORS origins, rate-limiting rules.
- **Variables:** `ENCRYPTION_MASTER_KEY`, `CORS_ALLOWED_ORIGINS`, `RATE_LIMIT_MAX_REQUESTS`.
- **Validation:** `ENCRYPTION_MASTER_KEY` must be a 32+ character hex string in production.

### 10. Background Worker Queue (`QUEUE`)
- **Responsibility:** BullMQ concurrency settings, job max retry attempts, exponential backoff delays.
- **Variables:** `BULLMQ_WORKER_CONCURRENCY`, `BULLMQ_JOB_MAX_RETRIES`, `BULLMQ_BACKOFF_DELAY`.
- **Validation:** Concurrency must be an integer between 1 and 50.

### 11. Enterprise Feature Flags (`FEATURE_FLAGS`)
- **Responsibility:** Master switches for OCR invoice ingestion, AI cash flow forecasting, and system maintenance mode.
- **Variables:** `ENABLE_OCR_INGESTION`, `ENABLE_AI_FORECASTING`, `MAINTENANCE_MODE_ENABLED`.
- **Validation:** Strict boolean values.

### 12. Monitoring & Health Diagnostics (`MONITORING`)
- **Responsibility:** Health check authorization secrets, Prometheus metrics toggle, alert webhook URLs.
- **Variables:** `HEALTH_CHECK_SECRET`, `METRICS_ENABLED`, `ALERT_WEBHOOK_URL`.
- **Validation:** `ALERT_WEBHOOK_URL` must be a valid HTTP/HTTPS URL when provided.

---

## 6. Architectural Impact Evaluation

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Dimension                 │ Architectural Impact & System Benefit                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Technical Reasoning       │ Synchronous validation eliminates runtime undefined    │
│                           │ errors and centralizes parsing into a single frozen module│
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Security Implications     │ Complete isolation between server secrets and client   │
│                           │ JS bundles prevents private credential leakage        │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Scalability Considerations│ Decouples environment config from code, enabling       │
│                           │ multi-region cloud container autoscale & SaaS expansion│
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Operational Considerations│ Safe startup failure with detailed diagnostic logs     │
│                           │ prevents invalid containers from joining load balancers│
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Maintainability Guidance  │ Self-documenting Zod schemas provide instant editor    │
│                           │ autocomplete and clear error remediation instructions │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
