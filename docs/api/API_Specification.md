# Exhaustive Enterprise REST API Catalog & Endpoint Specification

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical API Endpoint Catalog & Contract Specification  
**Author:** Principal API Architect & Systems Engineer  
**Status:** Approved for Implementation  

---

## 1. Authentication & Identity Endpoints

### `POST /api/v1/auth/login`
- **Purpose:** Authenticates user credentials and issues session token / HttpOnly cookie.
- **Auth Required:** No
- **Rate Limit:** 5 req / 15 min
- **Request Body:**
  ```json
  {
    "email": "user@fintrackpro.com",
    "password": "StrongPassword#2026!"
  }
  ```
- **Response (200 OK - MFA Required):**
  ```json
  {
    "success": true,
    "data": {
      "mfaRequired": true,
      "challengeToken": "ch_7f8a9b0c1d"
    }
  }
  ```
- **Response (200 OK - Success):**
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "uuid", "email": "user@fintrackpro.com", "role": "FINANCE_MANAGER" },
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

---

## 2. Finance Transactions & Analytics Endpoints

### `GET /api/v1/finance-records`
- **Purpose:** Fetches paginated list of turnover and P&L financial entries.
- **Auth Required:** Yes (JWT Bearer / Cookie)
- **Roles Allowed:** `SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`, `ANALYST`, `AUDITOR`
- **Rate Limit:** 100 req / min
- **Query Parameters:** `period`, `startDate`, `endDate`, `metricType`, `limit`, `cursor`.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "recordDate": "2026-07-01",
        "metricType": "TURNOVER",
        "amount": 1500000.00,
        "currency": "INR",
        "status": "APPROVED"
      }
    ],
    "pagination": { "limit": 20, "hasMore": false, "nextCursor": null }
  }
  ```

---

### `POST /api/v1/finance-records`
- **Purpose:** Submits a new manual financial turnover or profit/loss transaction.
- **Auth Required:** Yes
- **Roles Allowed:** `SUPER_ADMIN`, `FINANCE_MANAGER`
- **Request Body:**
  ```json
  {
    "recordDate": "2026-07-01",
    "metricType": "TURNOVER",
    "amount": 1500000.00,
    "currency": "INR",
    "notes": "Q3 Enterprise License Revenue"
  }
  ```
- **Response (201 Created):** Returns created transaction object.

---

## 3. AI Copilot Endpoints

### `POST /api/v1/ai-chat`
- **Purpose:** Submits natural language question to grounded financial AI copilot.
- **Auth Required:** Yes
- **Roles Allowed:** `SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`, `ANALYST`
- **Request Body:**
  ```json
  {
    "query": "What was Q2 net profit vs Q1?",
    "conversationId": "uuid-optional"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "reply": "Q2 net profit reached ₹4,500,000, representing a 12.5% increase compared to Q1.",
      "conversationId": "conv_99a8b7",
      "suggestedChart": { "type": "bar", "data": [ /* Mini chart points */ ] }
    }
  }
  ```

---

## 4. Report Generation Endpoints

### `POST /api/v1/reports/generate-ppt`
- **Purpose:** Triggers asynchronous PowerPoint slide deck generation.
- **Auth Required:** Yes
- **Roles Allowed:** `SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`
- **Request Body:**
  ```json
  {
    "templateId": "board-deck-standard",
    "dateStart": "2026-01-01",
    "dateEnd": "2026-06-30"
  }
  ```
- **Response (202 Accepted):**
  ```json
  {
    "success": true,
    "data": {
      "jobId": "job_ppt_88a7b6",
      "status": "QUEUED",
      "estimatedDurationSeconds": 5
    }
  }
  ```
