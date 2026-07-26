# Software Architecture — FinTrack Pro Enterprise AI Finance Management Platform

## 1. Executive Summary
Software Architecture defines the internal structural patterns, module organization, code conventions, state management model, service abstractions, and design principles enforced throughout the Next.js 14 TypeScript codebase.

---

## 2. Codebase Directory Structure & Layering

```
Appartment management system/
├── src/
│   ├── app/                      # Next.js 14 App Router routes & API endpoints
│   │   ├── api/                  # RESTful API route handlers
│   │   │   ├── admin/            # Administrative APIs
│   │   │   ├── ai-chat/          # AI Chat & completion APIs
│   │   │   ├── auth/             # Authentication & MFA APIs
│   │   │   ├── billing/          # Subscription & billing APIs
│   │   │   ├── customer-ops/     # Customer operations & tickets APIs
│   │   │   ├── employees/        # Employee management APIs
│   │   │   ├── finance-records/  # Financial record CRUD APIs
│   │   │   ├── funnel/           # Conversion funnel tracking APIs
│   │   │   ├── kb/               # Knowledge base APIs
│   │   │   ├── reports/          # Reporting & PowerBI export APIs
│   │   │   ├── share-value/      # Share valuation APIs
│   │   │   └── shares/           # Share transactions APIs
│   │   ├── dashboard/            # Dashboard page views
│   │   ├── layout.tsx            # Global app layout wrapper
│   │   └── page.tsx              # Root landing page
│   ├── components/               # UI components
│   │   ├── ai/                   # AI chat UI components
│   │   ├── forms/                # Reusable form components
│   │   ├── layout/               # Header, sidebar, footer navigation
│   │   ├── reports/              # Interactive chart & export widgets
│   │   └── ui/                   # Core atomic UI design system components
│   ├── lib/                      # Core business logic & services
│   │   ├── config/               # Environment & system configurations
│   │   ├── db/                   # Prisma database client & helpers
│   │   ├── middleware/           # Auth & API middleware
│   │   ├── services/             # Service layer implementation
│   │   ├── utils/                # Utility helpers & formatters
│   │   └── validation/           # Zod schema validators
│   ├── types/                    # Shared TypeScript interfaces & types
│   └── styles/                   # Global CSS & HSL theme tokens
├── prisma/                       # Database schema & migration scripts
├── scripts/                      # Operational scripts & health checks
└── docs/                         # Enterprise documentation suite
```

---

## 3. Core Design Principles

1. **Separation of Concerns**: API routes handle HTTP request/response serialization, Zod validation, and delegate domain logic exclusively to service modules in `src/lib/services`.
2. **Type Safety & Strict Contracts**: Shared Zod schemas drive both backend input validation and frontend form validation (`react-hook-form` + Zod).
3. **Repository / ORM Pattern**: Prisma client (`src/lib/db/prisma.ts`) acts as the data access layer, wrapped in service methods for transaction boundary management.
4. **Middleware Interception**: Next.js middleware and custom higher-order API wrappers (`src/lib/middleware/`) handle auth token validation, session checks, rate limiting, and error formatting before route handler execution.

---

## 4. State Management Architecture

- **Server State**: Managed via Next.js Server Components and SWR/React Query caching patterns for data fetching.
- **Client UI State**: React `useState` and `useContext` for localized modal dialogs, tab switching, and form draft states.
- **Persistent Local State**: Browser `localStorage` / `sessionStorage` reserved strictly for theme preference and non-sensitive user layout settings.

---

## 5. Error Handling Abstraction

All API routes utilize standard error responses formatted according to `API_Error_Standards.md`:

```typescript
// Standardized JSON Error Payload Structure
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;        // e.g. "UNAUTHORIZED", "VALIDATION_ERROR", "RATE_LIMIT_EXCEEDED"
    message: string;     // Human readable description
    details?: unknown;   // Field validation errors or diagnostic context
    timestamp: string;  // ISO 8601 timestamp
    requestId: string;  // Correlation trace ID
  };
}
```

---
