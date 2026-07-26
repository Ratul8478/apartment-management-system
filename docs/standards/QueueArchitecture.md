# Background Worker & Asynchronous Task Queue Architecture

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical Task Queue & Asynchronous Processing Specification  
**Author:** Lead Backend Engineer & DevOps Architect  
**Status:** Approved for Implementation  

---

## 1. Queue Architecture & Engine Choice

Asynchronous background jobs (PowerPoint slide generation, CSV bulk processing, transactional email dispatching) are managed using **BullMQ backed by Redis**.

```
[Producer: Route Handlers] ──► [BullMQ Job Queue (Redis)]
                                        │
                                        v
                       [Consumer: Worker Thread Pool]
                                        │
                       ┌────────────────┴────────────────┐
                       ▼                                 ▼
            [pptWorker: Render Slide]        [csvWorker: Ingest CSV]
                       │                                 │
                       └────────────────┬────────────────┘
                                        v
                       [Upload Result to S3 / Database]
```

---

## 2. Queue Inventory & Worker Policies

| Queue Name | Primary Job Types | Concurrency | Retry Strategy | Backoff Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `reports-queue` | PowerPoint Slide Render, Power BI Dataset Build | 3 Workers | 3 Attempts | Exponential (2s, 4s, 8s) |
| `csv-import-queue` | Bulk Transaction Import Parsing | 2 Workers | 2 Attempts | Fixed (5s) |
| `email-queue` | SendGrid Verification Emails, MFA Alerts | 10 Workers | 5 Attempts | Exponential (1s, 2s, 4s) |
| `audit-cleanup-queue` | Periodic Log Rotation & Archival | 1 Worker | 1 Attempt | None (Alert on Fail) |

---

## 3. Failure Handling & Dead Letter Queue (DLQ)

Jobs failing after maximum retries are automatically moved to `reports-queue-dlq` (Dead Letter Queue). An alert event is emitted to the Sentry/Datadog monitoring framework, allowing manual developer inspection via the Bull-Board dashboard.
