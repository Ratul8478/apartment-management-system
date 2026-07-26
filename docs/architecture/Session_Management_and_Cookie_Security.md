# Enterprise Session Management & Cookie Security Specification

**System Name:** FinTrack Pro  
**Document Type:** Browser Cookie & Multi-Device Session Security Protocol  
**Classification:** Enterprise Internal Security Standard  
**Version:** 3.0.0  

---

## 1. Multi-Device Session Tracking

Every authenticated login creates a distinct row in the `Session` model tracking:
- `id` (UUID)
- `userId` (Owner UUID)
- `sessionToken` (Opaque session token string)
- `refreshToken` (Opaque refresh token family)
- `ipAddress` (IPv4 / IPv6 client string)
- `userAgent` (Browser / Device string)
- `expiresAt` (Session expiration UTC timestamp)

---

## 2. Cookie Security Configuration

1. **`HttpOnly = true`:** Prevents client-side JavaScript access (`document.cookie`), neutralizing Cross-Site Scripting (XSS) token exfiltration attacks.
2. **`Secure = true`:** Enforces TLS / HTTPS transmission in production environments.
3. **`SameSite = Strict`:** Protects against Cross-Site Request Forgery (CSRF) by preventing browser cookie transmission on cross-origin requests.
4. **`Path = /`:** Scopes authentication cookies to all application endpoints.
