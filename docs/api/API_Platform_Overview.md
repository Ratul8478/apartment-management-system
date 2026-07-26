# API Platform Overview — FinTrack Pro

## 1. Architectural Principles
FinTrack Pro provides a standardized RESTful API platform built on HTTP/2, JSON request/response structures, TLS 1.3 encryption, versioned URI paths (`/api/v1/` or `/api/`), and strict security enforcement.

---

## 2. Authentication & Authorization

All protected API endpoints require HTTP Bearer Token authentication:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

- **Token Composition**: JWT containing `userId`, `tenantId`, `role`, `exp`, `iat`, and `jti`.
- **MFA Enforcement**: If MFA is enabled on an account, endpoints return `403 MFA_REQUIRED` until a valid TOTP code is verified via `/api/auth/mfa/verify`.
- **Role-Based Access Control (RBAC)**: Enforced via `withAuth` and `withRole` higher-order middleware helpers.
  - Roles: `SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`, `USER`, `AUDITOR`.

---

## 3. Rate Limiting & Quotas

- **Default API Quota**: 60 requests per minute per IP / User.
- **AI Completion API Quota**: 20 requests per minute per tenant.
- **Rate Limit Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed per window.
  - `X-RateLimit-Remaining`: Remaining requests in current window.
  - `X-RateLimit-Reset`: UTC epoch timestamp when current window resets.

---

## 4. Idempotency & Concurrency Control

For state-mutating requests (`POST`, `PUT`, `PATCH`), clients may supply a unique UUID in the idempotency header:
```http
X-Idempotency-Key: 9b1deb4d-3b7d-4149-9dd6-21005f7e6d3e
```
- If a request with an existing `X-Idempotency-Key` is re-sent within 24 hours, the cached response is re-played without re-executing business logic.

---

## 5. Pagination & Filtering Standards

All list endpoints support query parameters for pagination and sorting:
- `page`: Page number (1-indexed, default `1`).
- `limit`: Items per page (default `20`, max `100`).
- `sortBy`: Field name to sort by (e.g. `transactionDate`).
- `sortOrder`: `asc` or `desc`.

**Paginated Response Structure**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 142,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 6. Webhooks & Event Notifications

Webhooks emitted by external providers (e.g. Stripe) or outbound webhooks sent to enterprise subscribers are signed with HMAC SHA-256 signatures:
```http
X-FinTrack-Signature: t=1770000000,v1=9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
```

---

## 7. Versioning & Deprecation Policy

- API versions are specified in the URI path (`/api/...`).
- Backward-breaking changes trigger a major version bump.
- Deprecated endpoints will include response headers:
  - `Warning: 299 - "API endpoint deprecated"`
  - `Sunset: Wed, 31 Dec 2026 23:59:59 GMT`
- A minimum 6-month notice is provided prior to endpoint deprecation.

---
