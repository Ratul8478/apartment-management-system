# Enterprise Developer Authentication Integration Guide

**System Name:** FinTrack Pro  
**Document Type:** API & Middleware Integration Guide  
**Classification:** Enterprise Internal Engineering Standard  
**Version:** 3.0.0  

---

## 1. Authentication Endpoints API Reference

### 1. Register New Identity (`POST /api/auth/register`)
- **Request Body:**
  ```json
  {
    "fullName": "Enterprise Analyst",
    "email": "analyst@fintrackpro.internal",
    "password": "Password123!",
    "role": "ANALYST"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "User identity registered successfully.",
    "data": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "email": "analyst@fintrackpro.internal",
      "fullName": "Enterprise Analyst",
      "role": "ANALYST"
    }
  }
  ```

---

### 2. User Login (`POST /api/auth/login`)
- **Request Body:**
  ```json
  {
    "email": "analyst@fintrackpro.internal",
    "password": "Password123!"
  }
  ```
- **Response (`200 OK`):** Sets `fintrack_access_token` and `fintrack_refresh_token` HTTP-only cookies and returns token JSON payload.

---

### 3. Token Refresh (`POST /api/auth/refresh`)
- Automatically consumes `fintrack_refresh_token` cookie or request payload to rotate tokens.

---

### 4. Logout (`POST /api/auth/logout`)
- Invalidates session in database and clears HTTP-only cookies.

---

### 5. Current User Profile (`GET /api/auth/me`)
- Returns authenticated identity profile for active session token.

---

## 2. Consuming Middleware in API Routes

```typescript
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, requireRole } from "@/server/modules/auth/middlewares/auth.middleware";
import { SystemRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  // 1. Authenticate Request
  const authResult = await authenticateRequest(req);
  if (authResult instanceof NextResponse) {
    return authResult; // Return 401 Unauthorized response
  }

  const { user } = authResult;

  // 2. Authorize System Role
  if (!requireRole([SystemRole.SUPER_ADMIN, SystemRole.FINANCE_MANAGER], user.role)) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ success: true, user });
}
```
