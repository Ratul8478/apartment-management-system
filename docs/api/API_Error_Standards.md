# Enterprise API Error Handling & Error Catalog

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** API Error Response Specification & Catalog  
**Author:** Principal API Architect & Systems Engineer  
**Status:** Approved for Implementation  

---

## 1. Unified Error Payload Structure

```json
{
  "success": false,
  "error": {
    "code": "FINANCE_DUPLICATE_TRANSACTION_DATE",
    "message": "A turnover entry for this exact date already exists.",
    "details": [
      {
        "field": "recordDate",
        "issue": "Duplicate entry found for 2026-07-01"
      }
    ],
    "requestId": "req_88f7a6b5",
    "timestamp": "2026-07-23T17:14:00.000Z"
  }
}
```

---

## 2. System Error Code Catalog

| Error Code | HTTP Status Code | Description |
| :--- | :--- | :--- |
| `AUTH_INVALID_CREDENTIALS` | `401 Unauthorized` | Invalid login email or password. |
| `AUTH_ACCOUNT_LOCKED` | `401 Unauthorized` | Account locked due to 5 consecutive failed login attempts. |
| `AUTH_MFA_REQUIRED` | `200 OK (MFA Challenge)`| Credentials valid; MFA challenge token required. |
| `RBAC_FORBIDDEN` | `403 Forbidden` | User role lacks permission for requested route. |
| `VAL_INVALID_INPUT` | `422 Unprocessable Entity`| Zod schema validation failed for payload. |
| `FINANCE_INVALID_AMOUNT` | `400 Bad Request` | Transaction amount must be non-zero positive number. |
| `RATE_LIMIT_EXCEEDED` | `429 Too Many Requests` | Rate limit threshold exceeded. Retry after `Retry-After` header seconds. |
| `SERVER_UNCAUGHT_ERROR` | `500 Internal Error` | Internal server exception. Sanitized error reference code returned. |
