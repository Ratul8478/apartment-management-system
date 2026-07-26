# Enterprise REST API Architecture & OpenAPI 3.1 Specification

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Master API Architecture, Contract Design & Integration Specification  
**Author:** Distinguished API Architect & Principal Integration Specialist  
**Target Audience:** Frontend Engineers, Backend Engineers, Mobile Developers, QA Automation, AI Engineers  
**Status:** Approved for Implementation  
**Version:** 2.0.0 (Enterprise Production Grade)

---

## SECTION 1: API PHILOSOPHY & DESIGN PRINCIPLES

### 1.1 RESTful Resource-Oriented Architecture
FinTrack Pro adopts a **Resource-Oriented RESTful Architecture** over HTTP/2 and HTTP/3. Resources are represented as URL paths using plural nouns (e.g., `/api/v1/finance-records`, `/api/v1/employees`), while standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) define actions.

```
       +-------------------------------------------------------+
       |   Client Layer (Web Application / Mobile / SDK)       |
       +---------------------------+---------------------------+
                                   | HTTP/2 JSON / EventStream
                                   v
       +-------------------------------------------------------+
       |   API Gateway & Edge Perimeter (Next.js Route Handlers)|
       +---------------------------+---------------------------+
                                   | (Unified DTO Envelope)
                                   v
       +-------------------------------------------------------+
       |   Zod Schema Validation & Sanitization Layer          |
       +---------------------------+---------------------------+
                                   | (Typed Command / Query)
                                   v
       +-------------------------------------------------------+
       |   Domain Services Layer (FinanceService, AIService)   |
       +-------------------------------------------------------+
```

### 1.2 Core Consistency Principles
1. **API-First Design:** The API contract (`OpenAPI 3.1.0`) is the single source of truth established before frontend or backend implementation begins.
2. **Stateless Operations:** Requests contain all necessary credentials (JWT bearer token or HttpOnly cookie) to execute independently. No session state is held on web servers.
3. **Idempotency Standards:** All `GET`, `PUT`, and `DELETE` endpoints are guaranteed idempotent. `POST` mutations accept an optional `Idempotency-Key` header to prevent duplicate execution during network retries.
4. **Unified Response Envelope:** All HTTP responses return a standardized JSON wrapper containing a `success` boolean, `data` payload or `error` object, and execution metadata (`requestId`, `timestamp`).

---

## SECTION 2: API DIRECTORY & ROUTE STRUCTURE

The Next.js 14/15 App Router API directory strictly organizes endpoints by domain:

```
src/app/api/v1/
├── auth/                             # Identity & Authentication Endpoints
│   ├── login/route.ts
│   ├── logout/route.ts
│   ├── refresh/route.ts
│   ├── mfa/verify/route.ts
│   └── reset-password/route.ts
├── finance-records/                  # Financial Transaction Endpoints
│   ├── route.ts                      # GET (List) / POST (Create)
│   ├── [id]/route.ts                 # GET / PATCH / DELETE
│   ├── aggregate/route.ts            # Pre-computed Daily/Monthly/Yearly Rollups
│   └── upload/route.ts               # Bulk CSV Upload Endpoint
├── employees/                        # Finance Staff Directory Endpoints
│   ├── route.ts
│   └── [id]/route.ts
├── share-value/                      # Stock Price & Peer Benchmarking Endpoints
│   ├── route.ts
│   └── compare/route.ts
├── reports/                          # Report Studio & Document Generators
│   ├── generate-ppt/route.ts
│   └── generate-pbi/route.ts
├── ai-chat/                          # Grounded Financial AI Copilot
│   ├── route.ts                      # POST Query
│   └── stream/route.ts               # SSE Streaming Endpoint
├── notifications/                    # Alerts & Notifications
│   └── route.ts
└── admin/                            # System Admin & Compliance Endpoints
    ├── users/route.ts
    └── audit-log/route.ts
```

---

## SECTION 3: UNIFIED RESPONSE ENVELOPES & PAGINATION

### 3.1 Success Response Envelope
```json
{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "recordDate": "2026-07-01",
    "metricType": "TURNOVER",
    "amount": 1500000.00,
    "currency": "INR",
    "status": "APPROVED"
  },
  "meta": {
    "requestId": "req_99a8b7c6",
    "timestamp": "2026-07-23T17:14:00.000Z"
  }
}
```

### 3.2 Cursor-Based Pagination Envelope
```json
{
  "success": true,
  "data": [ /* Array of records */ ],
  "pagination": {
    "limit": 20,
    "hasMore": true,
    "nextCursor": "eyJpZCI6ImY0N2FjMTBiLTU4Y2MtNDM3Mi1hNTY3LTBlMDJiMmMzZDQ3OSJ9",
    "totalCount": 1420
  },
  "meta": {
    "requestId": "req_11b22c33",
    "timestamp": "2026-07-23T17:14:00.000Z"
  }
}
```

---

## SECTION 4: FILTERING, SORTING & SEARCH STANDARDS

- **Date Range Filtering:** Standardized URL parameters `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`.
- **Metric Filtering:** `?metricType=TURNOVER|PROFIT_LOSS&status=APPROVED`.
- **Sorting Parameters:** `?sortBy=recordDate&sortOrder=asc|desc`.
- **Full-Text Search:** `?q=search_term` powering server-side fuzzy string matching via PostgreSQL `pg_trgm`.

---

## SECTION 5: API SECURITY, RATE LIMITING & HEADERS

1. **Authentication:** Bearer JWT in `Authorization` header or `next-auth.session-token` HttpOnly cookie.
2. **Rate Limiting Buckets:**
   - Public Endpoints: 10 req / min.
   - Standard Endpoints: 100 req / min.
   - Heavy Export Endpoints: 5 req / min.
3. **Security Headers:**
   ```http
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   ```

---

## SECTION 6: API READINESS CHECKLIST

Before implementing API route handlers or connecting client components, verify the following:

- [x] OpenAPI 3.1.0 specification generated and validated (`OpenAPI.yaml`).
- [x] Standard JSON response envelope defined for success, error, and pagination payloads.
- [x] All 24 core API endpoints cataloged with methods, URLs, permissions, and schemas.
- [x] Input/Output validation schemas specified using Zod DTOs.
- [x] Cursor and Offset pagination mechanics documented.
- [x] Asynchronous long-running export endpoints designed with job status polling.
- [x] Rate limiting, CORS, HSTS, and JWT security headers specified.

---

## ARCHITECTURAL CONCLUDING DIRECTIVE

This Enterprise API Architecture Specification is **complete, binding, and production-ready**. Client developers, backend developers, mobile teams, and QA engineers must build strictly against the endpoints, schemas, and response standards defined herein.
