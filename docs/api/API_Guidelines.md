# Enterprise API Guidelines for Frontend, Backend & Integrators

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** API Building & Consumption Guidelines  
**Author:** Lead Integration Architect & Developer Experience Lead  
**Status:** Approved for Implementation  

---

## 1. General Principles

1. **HTTP Status Code Discipline:**
   - `200 OK`: Successful read or synchronous update.
   - `201 Created`: Resource successfully created.
   - `202 Accepted`: Asynchronous job queued (e.g. PPT generation).
   - `400 Bad Request`: Client business rule violation.
   - `401 Unauthorized`: Authentication missing or expired.
   - `403 Forbidden`: Authenticated user lacks RBAC permission.
   - `422 Unprocessable Entity`: Zod payload validation failure.
   - `429 Too Many Requests`: Rate limit exceeded.

2. **Idempotency Headers:**
   - Pass `Idempotency-Key: <UUID>` on critical financial `POST` mutations to prevent accidental duplicate submission.

3. **CORS & Credentials:**
   - Always supply `credentials: 'include'` when fetching from browser JS to pass session cookies.
