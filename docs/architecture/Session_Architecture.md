# Enterprise Session & Token Lifecycle Architecture

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Session Management, Token Strategy & Device Management Specification  
**Author:** Identity & Security Architect  
**Status:** Approved for Implementation  

---

## 1. Dual-Token Architecture & Security Rules

FinTrack Pro implements a stateless access token + stateful refresh token security model:

```
+-----------------------------------------------------------------------------------+
| ACCESS TOKEN (JWT)                                                                |
| - TTL: 15 Minutes                                                                 |
| - Storage: Client In-Memory (JavaScript variable / Auth State)                    |
| - Claims: { userId, tenantId, role, email, exp, iat }                             |
| - Signature: HMAC-SHA256 using server-side NEXTAUTH_SECRET                        |
+-----------------------------------------------------------------------------------+
                                       │
                                       ▼ (Refreshed via)
+-----------------------------------------------------------------------------------+
| REFRESH TOKEN                                                                     |
| - TTL: 7 Days (Sliding Window)                                                    |
| - Storage: HttpOnly; Secure; SameSite=Strict Cookie                               |
| - Tracking: Hashed & Registered in Redis with Device Metadata                     |
| - Rotation: SINGLE-USE (Rotated on every invocation)                              |
+-----------------------------------------------------------------------------------+
```

---

## 2. Multi-Device Management & Session Revocation

1. **Session Fingerprinting:** Each session stores device metadata (`User-Agent`, `IP Address`, `Device Type`, `Last Active Timestamp`).
2. **Active Sessions UI:** Users can view all logged-in devices from account settings and trigger remote revocation (`"Logout Other Devices"`).
3. **Emergency Revocation Hooks:** Password changes, role downgrades, or detected security breaches immediately wipe all session keys matching `cache:session:{userId}:*` in Redis.
