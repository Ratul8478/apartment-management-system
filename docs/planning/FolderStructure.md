# Enterprise Backend Directory Architecture & Module Organization

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Detailed Folder Structure & Architectural Directory Map  
**Author:** Principal Software Architect & Technical Lead  
**Status:** Approved for Implementation  

---

## 1. Directory Tree Overview

```
src/
├── app/                              # Presentation / HTTP Transport Layer (Next.js 14)
│   ├── (auth)/                       # Unauthenticated Auth Page Handlers
│   ├── (dashboard)/                  # Authenticated Dashboard Page Handlers
│   └── api/                          # REST API Route Handlers (Controllers)
│       ├── auth/                     # Authentication & Session Handlers
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── refresh/route.ts
│       │   ├── reset-password/route.ts
│       │   └── mfa/verify/route.ts
│       ├── finance-records/          # Financial Transaction Handlers
│       │   ├── route.ts
│       │   ├── aggregate/route.ts
│       │   └── upload/route.ts       # CSV Import Endpoint
│       ├── employees/                # Finance Staff Directory Handlers
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── share-value/              # Stock Price & Market Feed Handlers
│       │   ├── route.ts
│       │   └── compare/route.ts
│       ├── reports/                  # Report Studio & Presentation Exporters
│       │   ├── generate-ppt/route.ts
│       │   └── generate-pbi/route.ts
│       ├── ai-chat/                  # Grounded AI Conversational Assistant
│       │   └── route.ts
│       ├── notifications/            # In-App Alerts & Email Queue Trigger
│       │   └── route.ts
│       └── admin/                    # System Admin & Security Audit Handlers
│           ├── users/route.ts
│           └── audit-log/route.ts
├── server/                           # Core Backend Business & Application Layer
│   ├── controllers/                  # Presentation Controller Formatter Classes
│   │   ├── authController.ts
│   │   ├── financeController.ts
│   │   ├── employeeController.ts
│   │   ├── reportController.ts
│   │   └── aiController.ts
│   ├── services/                     # Domain Service Classes (Business Logic)
│   │   ├── financeService.ts         # Formulas, Calculations, Date Aggregations
│   │   ├── authenticationService.ts  # JWT, Bcrypt, Session Rotation
│   │   ├── employeeService.ts        # Directory Search, Role Salary Masking
│   │   ├── aiService.ts              # RAG Prompt Construction & Guardrails
│   │   ├── reportService.ts          # Slide Deck & Dataset Exporter Pipeline
│   │   ├── auditService.ts           # Append-Only Security Logger
│   │   ├── notificationService.ts    # Alert Email/SMS Dispatcher
│   │   └── shareService.ts           # Market Feed Caching & Peer Benchmark
│   ├── repositories/                 # Database Repositories (Prisma Abstraction)
│   │   ├── financeRepo.ts            # SQL Queries for Turnover & P&L
│   │   ├── userRepo.ts               # SQL Queries for Auth & Credentials
│   │   ├── employeeRepo.ts           # SQL Queries for Staff Roster
│   │   ├── reportRepo.ts             # SQL Queries for Document Metadata
│   │   ├── chatRepo.ts               # SQL Queries for AI Sessions & Messages
│   │   └── auditRepo.ts              # Append-Only SQL Queries for Audit Logs
│   ├── middlewares/                  # Edge & API Route Middleware Guards
│   │   ├── authGuard.ts              # JWT Token Verification Middleware
│   │   ├── rbacGuard.ts              # Role-Based Permission Check
│   │   ├── rateLimiter.ts            # Redis Distributed Rate Limiting
│   │   ├── errorHandler.ts           # Global Exception Sanitizer
│   │   └── loggingMiddleware.ts      # HTTP Request Log Handler (Winston/Pino)
│   ├── validators/                   # Zod DTO Request & Response Schemas
│   │   ├── authValidator.ts
│   │   ├── financeValidator.ts
│   │   ├── employeeValidator.ts
│   │   └── reportValidator.ts
│   ├── workers/                      # BullMQ Asynchronous Task Processors
│   │   ├── pptWorker.ts              # Background PowerPoint Render Worker
│   │   ├── csvWorker.ts              # Background Bulk CSV Ingestion Worker
│   │   └── emailWorker.ts            # SendGrid Transactional Email Worker
│   ├── queues/                       # BullMQ Queue Initializer & Event Listeners
│   │   └── queueManager.ts
│   ├── cache/                        # Redis Cache Managers & Invalidation Strategy
│   │   └── redisCacheManager.ts
│   └── lib/                          # Infrastructure SDK Drivers & Adapters
│       ├── prismaClient.ts           # Prisma ORM Database Connection Instance
│       ├── redisClient.ts            # Redis Cluster Connection Instance
│       ├── claudeAdapter.ts          # Anthropic Claude API SDK Driver
│       ├── s3Adapter.ts              # AWS S3 Pre-Signed Upload SDK Driver
│       └── socketGateway.ts          # Socket.IO Realtime Gateway Handler
├── constants/                        # Global Enums, Error Codes, Status Tokens
│   ├── errorCodes.ts
│   └── metricTypes.ts
├── types/                            # Shared TypeScript DTOs & Interfaces
│   └── index.ts
└── config/                           # Environment Secret Parser & Variable Checks
    └── envConfig.ts
```

---

## 2. Rationale for Layer Decoupling

1. **`app/api/` (Transport Only):** Next.js route handlers extract parameters, validate authorization headers, and delegate execution to `server/controllers/` or `server/services/`. No business calculations or database queries reside in route files.
2. **`server/services/` (Domain Logic):** Fully decoupled from Next.js web frameworks. Can be imported directly into CLI scripts, background workers, or standalone microservice instances without modification.
3. **`server/repositories/` (Data Access):** Abstracts Prisma ORM database interactions, providing simple TypeScript method calls (`findAggregatedMetrics`) to domain services.
