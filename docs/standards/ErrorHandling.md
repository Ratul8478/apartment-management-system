# Global Error Handling Architecture & Sanitization Specification

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical Error Architecture & Exception Sanitization Guide  
**Author:** Staff Software Architect & QA Lead  
**Status:** Approved for Implementation  

---

## 1. Error Handling Philosophy

FinTrack Pro enforces **Zero System Information Leakage**. Raw SQL errors, Prisma execution stack traces, system file paths, and internal server errors MUST NEVER be returned to client applications.

---

## 2. Standard API Response Wrapper

All backend responses (both successful and error responses) follow a uniform JSON payload structure:

```json
{
  "success": false,
  "error": {
    "code": "FINANCE_INVALID_TRANSACTION_AMOUNT",
    "message": "Transaction amount must be a non-zero positive monetary value.",
    "details": [
      {
        "field": "amount",
        "issue": "Expected positive number, received -500.00"
      }
    ],
    "requestId": "req_8f9a2b4c1e",
    "timestamp": "2026-07-23T11:35:00.000Z"
  }
}
```

---

## 3. Domain Exception Class Hierarchy

```
[Error] (Base JS Error)
  └── [AppError] (Base Application Exception with HTTP Status Code)
        ├── [ValidationError] (422 Unprocessable Entity - Zod Failures)
        ├── [AuthenticationError] (401 Unauthorized - Invalid Session/Token)
        ├── [AuthorizationError] (403 Forbidden - RBAC Violations)
        ├── [NotFoundError] (404 Not Found - Record Missing)
        ├── [ConflictError] (409 Conflict - Optimistic Lock / Duplicate Date)
        └── [RateLimitError] (429 Too Many Requests - Redis Threshold Exceeded)
```

---

## 4. Exception Mapping Matrix

| Internal Error Type | Trigger Scenario | HTTP Status Code | Exposed User Error Message |
| :--- | :--- | :--- | :--- |
| `PrismaClientKnownRequestError` | Foreign key violation | `400 Bad Request` | *"Referenced category or entity does not exist."* |
| `ZodError` | Invalid API DTO payload | `422 Unprocessable Entity`| *"Validation failed for submitted request parameters."* |
| `BcryptAuthFailed` | Incorrect password | `401 Unauthorized` | *"Incorrect email or password provided."* |
| `ClaudeApiTimeout` | AI provider unavailable | `503 Service Unavailable`| *"The AI assistant is temporarily unavailable. Please try again shortly."* |
| `UncaughtException` | Unexpected server error | `500 Internal Server Error`| *"An unexpected error occurred. Reference code: req_xxxx."* |
