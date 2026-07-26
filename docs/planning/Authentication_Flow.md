# Detailed Authentication Workflows & Sequence Diagrams

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical Sequence Diagrams & Authentication Flow Specifications  
**Author:** Lead Security Architect & Identity Engineer  
**Status:** Approved for Implementation  

---

## 1. Login & MFA Challenge Sequence Diagram (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client App
    participant Edge as Edge Middleware / WAF
    participant Auth as Auth Handler (/api/auth/login)
    participant UserDB as User Database (Prisma)
    participant Redis as Redis Cache
    participant Mail as SendGrid Email API

    User->>Edge: POST /api/auth/login (Email, Password)
    Edge->>Redis: Check Rate Limit (5 attempts / 15 min)
    alt Rate Limit Exceeded
        Edge-->>User: HTTP 429 Too Many Requests
    else Rate Limit OK
        Edge->>Auth: Pass Credentials
        Auth->>UserDB: Query User by Email
        alt User Not Found or Inactive
            Auth-->>User: HTTP 401 Invalid Credentials (Neutral Error)
        else User Found
            Auth->>Auth: Verify Bcrypt Hash
            alt Password Incorrect
                Auth->>UserDB: Increment failed_logins counter
                alt failed_logins >= 5
                    Auth->>UserDB: Set locked_until = NOW() + 15 mins
                    Auth->>Mail: Send Security Alert Email
                end
                Auth-->>User: HTTP 401 Invalid Credentials
            else Password Correct
                alt Is MFA Enabled == True
                    Auth-->>User: HTTP 200 (Requires MFA Challenge Token)
                    User->>Auth: POST /api/auth/mfa/verify (Challenge Token, 6-digit TOTP)
                    Auth->>Auth: Verify TOTP Code vs Secret
                end
                Auth->>Redis: Issue & Store Refresh Token R1
                Auth-->>User: HTTP 200 OK (Set HttpOnly Cookie R1 + Return JWT A1)
            end
        end
    end
```

---

## 2. Refresh Token Rotation & Attack Prevention Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client App
    participant Middleware as Auth Middleware
    participant AuthServer as Token Service
    participant TokenDB as Redis Token Registry

    Client->>Middleware: GET /api/finance-records (Header: Bearer A1)
    Middleware->>Middleware: Validate A1 Expiry
    alt A1 Valid
        Middleware-->>Client: Allow Request Execution
    else A1 Expired
        Client->>AuthServer: POST /api/auth/refresh (Cookie: RefreshToken R1)
        AuthServer->>TokenDB: Check R1 Status in Registry
        alt R1 Already Used / Revoked (ATTACK DETECTED)
            AuthServer->>TokenDB: REVOKE ALL SESSIONS FOR USER ID
            AuthServer-->>Client: HTTP 401 Unauthorized (Security Warning)
        else R1 Active & Valid
            AuthServer->>TokenDB: Mark R1 as Used / Invalidate R1
            AuthServer->>TokenDB: Register New Refresh Token R2
            AuthServer-->>Client: HTTP 200 OK (Set Cookie R2 + Return New JWT A2)
        end
    end
```

---

## 3. Password Reset & Recovery Workflow
1. User requests password reset via `POST /api/auth/reset-password`.
2. System queries user by email (always returns neutral response to prevent account enumeration).
3. If user exists, generates a 256-bit cryptographically secure random token expiring in 15 minutes.
4. Email dispatched containing reset URL: `https://app.fintrackpro.com/reset-password?token=...`.
5. User submits new password $\rightarrow$ Validated against strength rules $\rightarrow$ Passwords re-hashed $\rightarrow$ **All existing active sessions invalidated**.
