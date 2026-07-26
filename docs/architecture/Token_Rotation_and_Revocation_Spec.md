# Enterprise Token Rotation & Revocation Protocol

**System Name:** FinTrack Pro  
**Document Type:** Cryptographic Token Security & Lifecycle Specification  
**Classification:** Enterprise Internal Security Standard  
**Version:** 3.0.0  

---

## 1. Executive Summary

This specification defines the cryptographic token lifecycle, dual-token rotation workflow, token revocation vectors, and threat mitigation models for **FinTrack Pro**.

---

## 2. Dual-Token Architecture

```mermaid
flowchart TD
    A[Client Request: POST /api/auth/refresh] --> B{Verify Refresh Token Signature}
    B -->|Valid JWT| C{Locate Session in DB}
    B -->|Invalid / Expired| D[Return 401 Invalid Token]
    C -->|Session Active| E[Generate New Opaque Refresh Token]
    C -->|Session Revoked| F[Return 401 Session Revoked]
    E --> G[Update Session Record in PostgreSQL]
    G --> H[Sign New Access Token 15m]
    H --> I[Sign New Refresh Token 7d]
    I --> J[Write TOKEN_REFRESHED Audit Event]
    J --> K[Return Tokens & Update HTTP-Only Cookies]
```

---

## 3. Revocation Vectors

1. **Explicit User Logout (`POST /api/auth/logout`):** Destroys active DB session and clears browser cookies.
2. **Password Change Revocation:** Updating user password triggers `revokeAllUserSessions(userId)` to invalidate active sessions across all devices.
3. **Single Device Termination (`DELETE /api/auth/sessions/:id`):** Deletes specific session from database.
