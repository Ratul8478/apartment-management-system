# Enterprise Frontend Directory Architecture & Module Map

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Detailed Frontend Folder Structure & Organization Map  
**Author:** Principal Frontend Architect & Lead UI Engineer  
**Status:** Approved for Implementation  

---

## 1. Directory Tree Overview

```
src/
├── app/                              # Next.js 15 App Router (Pages, Layouts & Route Handlers)
│   ├── (auth)/                       # Unauthenticated Route Group (Auth Layout Shell)
│   │   ├── login/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── mfa/page.tsx
│   ├── (dashboard)/                  # Authenticated Route Group (Dashboard Layout Shell)
│   │   ├── layout.tsx                # Protected App Shell (Sidebar, Topbar, Auth Guard)
│   │   ├── dashboard/page.tsx        # Main Turnover & P&L Analytics Screen
│   │   ├── employees/page.tsx        # Finance Department Staff Directory
│   │   ├── reports/page.tsx          # Report Studio & Presentation Exporter
│   │   ├── share-value/page.tsx      # Share Tracker & Peer Comparison Board
│   │   ├── performance/page.tsx      # KPI Scorecard & AI Anomaly Suggestions
│   │   ├── ai-chat/page.tsx          # Conversational Financial AI Assistant Screen
│   │   ├── onboarding/page.tsx       # Onboarding Wizard Screen
│   │   └── admin/
│   │       ├── users/page.tsx        # Admin User Management Screen
│   │       └── audit-log/page.tsx    # Security Audit Log Screen
│   ├── (marketing)/                  # Public Conversion & Marketing Funnel
│   │   ├── page.tsx                  # High-Converting Product Landing Page
│   │   ├── features/page.tsx
│   │   └── request-demo/page.tsx
│   ├── api/                          # Backend API Route Handlers
│   ├── global-error.tsx              # Uncaught Application Error Boundary
│   ├── layout.tsx                    # Root Layout (Fonts, Global Theme Provider)
│   └── page.tsx                      # Root Redirection Handler
├── features/                         # Feature-Sliced Business Modules
│   ├── auth/                         # Authentication Feature Module
│   │   ├── components/               # Auth UI Components (LoginForm, MfaModal)
│   │   ├── hooks/                    # Auth State & Mutation Hooks
│   │   └── services/                 # Auth API Calls
│   ├── dashboard/                    # Executive Dashboard Feature Module
│   │   ├── components/               # Charts (BarChart, PieChart, KpiCardRow)
│   │   ├── hooks/                    # TanStack Query Dashboard Data Hooks
│   │   └── store/                    # Dashboard UI Filter Store (Zustand)
│   ├── finance-entry/                # Financial Transaction Ingestion Feature
│   │   ├── components/               # Manual Entry Form, CSV Upload Drag-Zone
│   │   └── schemas/                  # Zod DTO Validation Schemas
│   ├── employees/                    # Staff Directory Feature Module
│   │   ├── components/               # Employee Table, Drawer, Filter Drawer
│   │   └── hooks/                    # Directory Fetch & Mutation Hooks
│   ├── reports/                      # Report Studio Feature Module
│   │   ├── components/               # Template Picker, Export Progress Modal
│   │   └── services/                 # Report Export API Services
│   ├── ai-copilot/                   # Conversational AI Feature Module
│   │   ├── components/               # Chat Thread, Message Bubble, Prompt Chips
│   │   └── hooks/                    # SSE Streaming AI Hook
│   └── share-tracker/                # Stock Tracker & Peer Benchmarking Feature
│       ├── components/               # SharePriceChart, PeerComparisonBoard
│       └── hooks/                    # Market Feed Query Hooks
├── components/                       # Shared UI Components (Cross-Feature)
│   ├── ui/                           # Primitive Design System Base (shadcn/ui)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── Toast.tsx
│   ├── layout/                       # Core Shell Components
│   │   ├── Sidebar.tsx               # Collapsible 260px Responsive Sidebar Rail
│   │   ├── Topbar.tsx                # Header with Profile Pill & Search
│   │   └── NotificationCenter.tsx    # Dropdown Alert Feed Container
│   └── feedback/                     # Feedback & Loading Indicators
│       ├── SkeletonLoaders.tsx
│       └── ErrorFallback.tsx
├── hooks/                            # Shared Cross-Cutting React Hooks
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useOutsideClick.ts
├── store/                            # Global UI State Stores (Zustand)
│   ├── useAppStore.ts                # Sidebar collapse, global loading
│   └── useThemeStore.ts              # Theme mode selection
├── providers/                        # React Context Providers
│   ├── QueryProvider.tsx             # TanStack Query Client Provider
│   ├── ThemeProvider.tsx             # Next-Themes Provider
│   └── SocketProvider.tsx            # Socket.IO Gateway Context Provider
├── lib/                              # Client Singletons & Helper Wrappers
│   ├── apiCustomClient.ts            # Axios / Fetch Wrapper with Auth Interceptors
│   └── socketClient.ts               # Socket.IO Connection Singleton
├── types/                            # Global TypeScript Declarations
│   └── index.ts
└── styles/                           # Global CSS & Tailwind Custom Tokens
    └── globals.css
```

---

## 2. Rationale for Directory Separation

- **`app/` vs `features/`:** `app/` strictly handles URL routing and layout hierarchy. `features/` encapsulates all domain business logic, UI widgets, and hooks. This prevents route files from becoming bloated multi-hundred-line code files.
- **`components/ui/` vs `components/layout/`:** `components/ui/` holds pure visual primitives (buttons, cards, inputs) that are completely decoupled from domain business data. `components/layout/` holds application shell structures.
