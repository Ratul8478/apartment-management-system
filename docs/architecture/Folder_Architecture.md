# Enterprise Folder Architecture Specification

## 1. Executive Summary & Design System

This specification defines the canonical folder architecture under `src/` for **FinTrack Pro (Enterprise AI Finance Management System)**. Engineered to eliminate technical debt, enforce Clean Architecture, and maintain maintainability for at least 5 years across 100+ engineers, this blueprint establishes strict separation of concerns across presentation, business services, infrastructure, and domain contract layers.

---

## 2. Comprehensive `src/` Directory Blueprint

```text
src/
├── app/                              # Next.js 15 App Router Layer (Presentation & Routing)
│   ├── (auth)/                       # Unauthenticated Auth Route Group
│   │   ├── login/                    # Login View Page
│   │   ├── reset-password/           # Password Reset View Page
│   │   └── layout.tsx                # Authentication Layout Shell
│   ├── (dashboard)/                  # Authenticated Dashboard Route Group (Protected)
│   │   ├── admin/                    # System Administration Pages
│   │   │   ├── audit-log/            # System Audit Trail Page
│   │   │   └── users/                # User Management & RBAC Page
│   │   ├── ai-chat/                  # Grounded AI Finance Chat Page
│   │   ├── analytics/                # Financial Analytics & Benchmarks Page
│   │   ├── dashboard/                # Main Executive Finance KPI View
│   │   ├── data-entry/               # Financial Record Entry & CSV Upload View
│   │   ├── employees/                # Employee Roster Directory View
│   │   ├── forecasting/              # Predictive Financial Modeling View
│   │   ├── notifications/            # System Notifications Center View
│   │   ├── ocr/                      # Invoice & Receipt Scanning View
│   │   ├── performance/              # Profit Margin Benchmarks View
│   │   ├── reports/                  # PowerPoint & Power BI Export Studio Page
│   │   ├── settings/                 # Enterprise Tenant Settings Page
│   │   ├── share-value/              # Share Price Valuation Page
│   │   ├── suggestions/              # AI Cost-Reduction Recommendations View
│   │   └── layout.tsx                # Dashboard Navigation Shell (Sidebar & Topbar)
│   ├── api/                          # HTTP REST API Route Handlers (Controller Boundary)
│   │   ├── admin/                    # System Admin API Handlers
│   │   ├── ai-chat/                  # Claude/OpenAI AI Query Handlers
│   │   ├── analytics/                # Analytics & Metrics API Handlers
│   │   ├── audit-logs/               # System Audit Log API Handlers
│   │   ├── auth/                     # Authentication & Session Handlers
│   │   ├── employees/                # Employee Management API Handlers
│   │   ├── finance-records/          # Financial Ledger API Handlers
│   │   ├── forecasting/              # Forecasting Model API Handlers
│   │   ├── notifications/            # Notification Dispatch Handlers
│   │   ├── ocr/                      # OCR Document Parsing Handlers
│   │   ├── reports/                  # Report Generation & Export Handlers
│   │   ├── settings/                 # Configuration API Handlers
│   │   ├── share-value/              # Share Valuation API Handlers
│   │   └── shares/                   # Share Peer Benchmark Handlers
│   ├── globals.css                   # Global Tailwind CSS & Theme Tokens
│   ├── layout.tsx                    # Root HTML Document Shell
│   ├── page.tsx                      # Modular Landing Page Component
│   └── providers.tsx                 # Global Client State & Theme Providers
├── components/                       # Visual Presentation Layer (React 19 Components)
│   ├── ai/                           # AI Chat Widgets & Insight Cards
│   ├── analytics/                    # Financial Trend & Metric Visualizations
│   ├── audit-logs/                   # Audit Trail Tables & Filter Controls
│   ├── charts/                       # Recharts Visualizations (Turnover, Margins, Shares)
│   ├── employee/                     # Employee Roster & Role Assignment Components
│   ├── finance/                      # Ledger Modals & Financial Entry Tables
│   ├── forms/                        # Form Inputs, Multi-step Wizards, CSV Import Controls
│   ├── funnel/                       # Lead Conversion Modals & Marketing Funnels
│   ├── landing/                      # Landing Page Sub-Components (Hero, Features, Security)
│   ├── layout/                       # Structural Shell Components (Sidebar, Topbar, Footer)
│   ├── notifications/                # Alert Banners & Toast Notification Controllers
│   ├── ocr/                          # Receipt Upload & OCR Verification Modals
│   ├── reports/                      # Slide Deck Preview & Power BI Modals
│   ├── security/                     # Role-Based Access Guards & Audit Modals
│   └── ui/                           # Atomic UI Design System Primitives (Button, Card, Modal, Input)
├── lib/                              # Infrastructure & Cross-Cutting Utilities Layer
│   ├── ai/                           # AI Prompt Framing, Model Clients, Grounding Services
│   ├── export/                       # PptxGenJS Slide Builder & Power BI CSV Engine
│   ├── ocr/                          # Document Intelligence & Text Parsing Engines
│   ├── security/                     # Bcrypt Hashing, MFA TOTP, JWT Verifiers
│   ├── validation/                   # Shared Zod Payload Validation Schemas
│   ├── auth.ts                       # NextAuth / Auth Service Middleware Setup
│   ├── prisma.ts                     # Prisma Database Client Singleton Pool
│   ├── redis.ts                      # Redis Connection Singleton Pool
│   └── utils.ts                      # Tailwind `cn()` Merger & Formatting Utilities
├── server/                           # Enterprise Backend Domain & Data Access Layer (DDD)
│   ├── repositories/                 # Data Layer Abstractions (Prisma DB Wrappers)
│   │   ├── auditLogRepository.ts     # Audit Trail Persistence Wrapper
│   │   ├── employeeRepository.ts     # Employee Roster Database Repository
│   │   ├── financeRepository.ts      # Financial Ledger Database Repository
│   │   ├── notificationRepository.ts # Notification Persistence Repository
│   │   ├── shareValueRepository.ts   # Share Valuation Repository
│   │   └── userRepository.ts         # User Security Account Repository
│   └── services/                     # Business Logic Service Layer (Clean Architecture)
│       ├── aiFinanceService.ts       # AI Financial Insights & Cost Optimization Rules
│       ├── auditLogService.ts        # Immutable Audit Logging Business Rules
│       ├── authService.ts            # Authentication, Password Reset, & MFA Service
│       ├── employeeService.ts        # Employee Directory & Role Assignment Logic
│       ├── financeService.ts         # Financial Rollups, Margins, & Balance Calculations
│       ├── forecastingService.ts     # Revenue & Cash Flow Forecasting Algorithms
│       ├── notificationService.ts    # Alert Dispatch & Priority Routing Logic
│       ├── ocrService.ts             # Receipt Parsing & Invoice Verification Rules
│       ├── reportService.ts          # PPT & Power BI Export Data Orchestration
│       └── shareValueService.ts      # Share Price Valuation & Peer Comparison Logic
└── types/                            # Enterprise Contract & Type Specification Layer
    ├── api.ts                        # Standardized REST API Request/Response Payloads
    ├── domain.ts                     # Pure Business Domain Entity Interfaces
    └── index.ts                      # Barrel Export for All Domain Specifications
```

---

## 3. Layer Separation & Technical Rules

### 1. Presentation & Routing Layer (`src/app` & `src/components`)
- **Responsibility:** Renders user interfaces, captures user input, manages client-side UI states, and orchestrates HTTP request routing.
- **Strict Boundary Rules:** Presentation components MUST NEVER contain raw SQL, direct Prisma queries, or database connection strings.

### 2. Business Service Layer (`src/server/services`)
- **Responsibility:** Enforces core domain business rules, multi-tenant isolation, financial computations, and audit logging.
- **Strict Boundary Rules:** Business services MUST be pure TypeScript classes/functions. They MUST NEVER depend on React components, DOM APIs, or Next.js layout primitives.

### 3. Repository Data Layer (`src/server/repositories`)
- **Responsibility:** Abstracts all data persistence operations (Prisma ORM, PostgreSQL, Redis caches).
- **Strict Boundary Rules:** Repositories MUST ONLY handle data access and query execution. They MUST NOT contain business validation or presentation routing logic.

### 4. Enterprise Type Layer (`src/types`)
- **Responsibility:** Defines compile-time type contracts, DTOs, domain interfaces, and enums shared across all engineering teams.
- **Strict Boundary Rules:** Pure declaration files. Must NEVER import stateful or executable runtime code.

---

## 4. Code Organization & Architectural Principles

### 1. Feature-First Architecture
Code is organized primarily by domain capability (e.g. Finance, Employees, AI, Reports) rather than technical file types. This ensures engineers working on a feature modify files within a cohesive feature boundary.

### 2. Single Responsibility Principle (SRP)
Every class, module, and component has one, and only one, reason to change.
- Services handle business rules.
- Repositories handle database operations.
- Components handle UI rendering.

### 3. Open/Closed Principle (OCP)
Modules are open for extension but closed for modification. Business capabilities (such as report generation engines) are extended via strategy patterns rather than mutating core controllers.

### 4. Dependency Inversion Principle (DIP)
High-level business services do not depend directly on low-level data drivers; both depend on abstract domain interfaces (`src/types/domain.ts`).

### 5. Composition Over Inheritance
Visual UI components and backend business logic favor modular functional composition over deep class inheritance hierarchies.

---

## 5. Scalability & Technical Debt Mitigation Strategy

1. **Multi-Team Parallel Development:** Clear feature module boundaries allow 10+ engineering teams to work concurrently without merge conflicts.
2. **Framework & Driver Portability:** Isolating business logic in `src/server/services/` ensures core financial calculation algorithms can be migrated to standalone microservices or worker queues (BullMQ) with zero code rewrites.
