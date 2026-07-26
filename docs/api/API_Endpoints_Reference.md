# API Endpoints Reference — FinTrack Pro

This document provides detailed specification of all supported API endpoints across the platform.

---

## 1. Authentication APIs (`/api/auth/*`)

### `POST /api/auth/login`
- **Purpose**: Authenticates user credentials and issues JWT token or MFA challenge.
- **Auth**: None (Public).
- **Request Body**:
  ```json
  {
    "email": "user@enterprise.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK - Direct Login)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": { "id": "usr_123", "name": "John Doe", "email": "user@enterprise.com", "role": "ADMIN" }
  }
  ```
- **Response (200 OK - MFA Required)**:
  ```json
  {
    "success": true,
    "mfaRequired": true,
    "mfaToken": "mfa_temp_token_abc123"
  }
  ```

### `POST /api/auth/mfa/verify`
- **Purpose**: Verifies TOTP 6-digit passcode.
- **Request Body**:
  ```json
  {
    "mfaToken": "mfa_temp_token_abc123",
    "code": "582910"
  }
  ```
- **Response**: `{ "success": true, "token": "eyJhbG..." }`

---

## 2. Finance Records APIs (`/api/finance-records/*`)

### `GET /api/finance-records`
- **Purpose**: List finance records with filtering, searching, and pagination.
- **Auth**: Bearer JWT.
- **Query Parameters**: `page`, `limit`, `category`, `type`, `startDate`, `endDate`, `search`.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "rec_01",
        "amount": 12500.50,
        "type": "INCOME",
        "category": "SAAS_SUBSCRIPTION",
        "description": "Enterprise Q3 Renewal",
        "transactionDate": "2026-07-20T10:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "totalItems": 1, "totalPages": 1 }
  }
  ```

### `POST /api/finance-records`
- **Purpose**: Create a new financial transaction record.
- **Auth**: Bearer JWT (`ADMIN`, `FINANCE_MANAGER`).
- **Request Body**:
  ```json
  {
    "amount": 4500.00,
    "type": "EXPENSE",
    "category": "CLOUD_INFRASTRUCTURE",
    "description": "AWS Monthly Hosting",
    "transactionDate": "2026-07-24T12:00:00Z"
  }
  ```

---

## 3. AI Assistant APIs (`/api/ai-chat/*`)

### `POST /api/ai-chat/completions`
- **Purpose**: Submits a financial query prompt to the AI completion engine.
- **Auth**: Bearer JWT (`ADMIN`, `FINANCE_MANAGER`, `USER`).
- **Request Body**:
  ```json
  {
    "prompt": "Analyze Q2 expense growth and identify top spending categories.",
    "contextRangeDays": 90
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "response": "Based on Q2 records, cloud hosting increased by 14.2%...",
    "suggestedActions": ["Export to PowerPoint", "Generate PowerBI Report"],
    "tokensUsed": 412
  }
  ```

---

## 4. Billing & Subscription APIs (`/api/billing/*`)

### `POST /api/billing/checkout`
- **Purpose**: Create Stripe Checkout session for subscription tier upgrade.
- **Auth**: Bearer JWT (`ADMIN`).
- **Request Body**: `{ "tier": "ENTERPRISE", "billingCycle": "ANNUAL" }`
- **Response**: `{ "success": true, "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_..." }`

### `POST /api/billing/webhook`
- **Purpose**: Handles asynchronous Stripe event notifications.
- **Auth**: Stripe Signature Verification (`X-Stripe-Signature`).

---

## 5. Reporting & PowerBI APIs (`/api/reports/*`)

### `POST /api/reports/generate-pbi`
- **Purpose**: Generates dynamic PowerBI / PPTX financial executive report dataset.
- **Auth**: Bearer JWT (`ADMIN`, `FINANCE_MANAGER`).
- **Response**: `{ "success": true, "reportUrl": "/downloads/reports/FinTrack_Q2_2026.pptx" }`

---
