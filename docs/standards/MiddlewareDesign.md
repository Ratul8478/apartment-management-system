# Middleware Architecture & Security Pipeline

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Edge Middleware, Authentication & Request Pipeline Specification  
**Author:** Backend Security Architect & Lead DevOps Engineer  
**Status:** Approved for Implementation  

---

## 1. Middleware Execution Pipeline

Every HTTP request entering the backend passes through a multi-stage middleware security stack:

```
[HTTP Request] ──► [1. Logging] ──► [2. Rate Limiter] ──► [3. CORS/Helmet]
                                                               │
                                                               ▼
[HTTP Response] ◄── [6. Error Handler] ◄── [5. RBAC Guard] ◄── [4. Auth Guard]
```

---

## 2. Middleware Components

1. **`loggingMiddleware`:** Generates unique `X-Request-ID` correlation header; logs request method, URL, client IP, and response latency using Winston.
2. **`rateLimiter`:** Enforces distributed rate limits via Redis.
   - *Public Endpoints:* 10 requests / minute.
   - *Authenticated API Endpoints:* 100 requests / minute.
   - *AI Chat Endpoint:* 20 requests / minute.
3. **`corsHelmetGuard`:** Sets strict HTTP response security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).
4. **`authGuard`:** Validates NextAuth JWT session token from HttpOnly cookie. Rejects invalid or expired tokens with HTTP `401 Unauthorized`.
5. **`rbacGuard`:** Inspects user role claim from JWT token against route permission requirements. Rejects unauthorized roles with HTTP `403 Forbidden`.
6. **`errorHandler`:** Catches uncaught domain exceptions and returns sanitized JSON error objects matching the standard API response wrapper.
