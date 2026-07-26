# Enterprise Frontend Architecture & Design System Specification

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Master Frontend Architecture, UI Engineering & Design System Specification  
**Author:** Distinguished Frontend Architect & Principal UI Engineer  
**Target Audience:** Frontend Developers, UI/UX Engineers, Design System Team, Product Designers  
**Status:** Approved for Implementation  
**Version:** 2.0.0 (Enterprise Production Grade)

---

## SECTION 1: FRONTEND PHILOSOPHY & COMPONENT DESIGN

### 1.1 Architectural Vision
The frontend of FinTrack Pro is designed as a **Component-Driven, Atomic Feature-Based Architecture** built on Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, and shadcn/ui. It balances high-performance initial renders via React Server Components (RSC) with rich client-side interactivity, stateful visualizations, and streaming AI assistant interfaces.

```
       +-------------------------------------------------------+
       |   Next.js 15 App Router & Server Components (RSC)     |
       |   - Initial HTML Stream & Data Pre-fetching          |
       |   - Layout Shells & Route Protection Guards           |
       +---------------------------+---------------------------+
                                   | (RSC Stream / Hydration)
                                   v
       +-------------------------------------------------------+
       |   Interactive Client Feature Modules (Features Layer) |
       |   - Dashboard Widgets, Form Editors, AI Chat Thread   |
       |   - TanStack Query (Server State) & Zustand (UI State)|
       +---------------------------+---------------------------+
                                   | (Primitive Bindings)
                                   v
       +-------------------------------------------------------+
       |   Design System Component Library (ui/ Primitives)    |
       |   - Radix UI Primitives, Accessible WAI-ARIA Tokens   |
       |   - Tailwind Tokens, Recharts Visualization Wrappers  |
       +-------------------------------------------------------+
```

### 1.2 Core Architectural Principles

1. **Feature-Sliced Design:** Code is organized by business feature modules (`features/dashboard`, `features/finance-entry`, `features/ai-copilot`), keeping related UI components, hooks, stores, and schemas co-located.
2. **Strict Server/Client Boundary:** Pages and layouts default to **React Server Components (RSC)** to minimize client JavaScript bundle size. The `'use client'` directive is explicitly restricted to interactive leaf nodes (forms, interactive charts, dropdowns, AI chat windows).
3. **Smart vs. Presentational Component Split:**
   - *Smart Components (Feature Containers):* Manage data fetching, global state subscriptions, and business side-effects.
   - *Presentational Components (UI Primitives):* Pure, stateless visual elements receiving data and callbacks strictly via typed props.
4. **WCAG 2.2 AA Accessibility First:** All UI components enforce screen-reader accessibility, logical keyboard focus traps, minimum $4.5:1$ color contrast ratios, and ARIA primitives derived from Radix UI.
5. **Zero Design Token Drift:** All colors, typography, spacing scales, shadow elevations, and radii are derived from centralized design system tokens. No arbitrary utility values are permitted.

---

## SECTION 2: FRONTEND MODULES & FEATURE SCOPE

| Feature Module | Business Responsibilities | State Mechanism | Key Component Families |
| :--- | :--- | :--- | :--- |
| `features/auth` | User login, password resets, TOTP MFA challenge forms. | React Hook Form + Zod | `LoginForm`, `MfaChallengeModal`, `PasswordResetForm` |
| `features/dashboard` | Executive Turnover vs P&L charts, period filters, KPI cards. | TanStack Query + Zustand | `TurnoverBarChart`, `ProfitLossDonut`, `KpiCardRow` |
| `features/finance-entry` | Single transaction forms, drag-and-drop CSV parser modal. | React Hook Form + Worker | `FinanceEntryModal`, `CsvUploadZone`, `ValidationTable` |
| `features/employees` | Staff directory table, profile drawers, designation filters. | TanStack Query | `EmployeeTable`, `EmployeeDrawer`, `DepartmentFilter` |
| `features/reports` | Report studio, template pickers, PowerPoint/Power BI export. | TanStack Query | `TemplateGallery`, `ExportProgressModal`, `PbiViewer` |
| `features/ai-copilot` | Grounded AI financial chat, streaming text, inline mini-charts. | SSE Stream + Zustand | `AiChatThread`, `StreamingBubble`, `PromptChips` |
| `features/share-tracker`| Historical stock chart, market data feed, peer benchmark table. | TanStack Query | `SharePriceChart`, `PeerComparisonBoard` |
| `features/audit-logs` | Immutable security audit log table, actor search, field filters. | TanStack Query | `AuditLogTable`, `AuditPayloadViewer` |

---

## SECTION 3: STATE MANAGEMENT TAXONOMY

State within FinTrack Pro is categorized into 4 isolated domains to prevent unnecessary component re-renders:

```
+-------------------------------------------------------------------------------+
| 1. SERVER STATE (TanStack Query / React Query v5)                              |
| - Handles API data, cache invalidation, background refetching, mutation states|
| - Usage: Dashboard charts, transaction lists, employee directory, audit logs   |
+-------------------------------------------------------------------------------+
| 2. GLOBAL UI STATE (Zustand)                                                  |
| - Handles client app settings, sidebar toggle, active theme, notification feed |
| - Usage: `useAppStore`, `useThemeStore`, `useChatStore`                       |
+-------------------------------------------------------------------------------+
| 3. FORM STATE (React Hook Form + Zod)                                         |
| - Handles isolated form input fields, field validation errors, dirty states   |
| - Usage: Transaction entry, CSV parsing preview, MFA verification             |
+-------------------------------------------------------------------------------+
| 4. LOCAL COMPONENT STATE (React useState / useReducer)                        |
| - Handles transient component visibility, modal open/close, dropdown toggles  |
| - Usage: Tooltip hover state, accordion expand state                          |
+-------------------------------------------------------------------------------+
```

---

## SECTION 4: THEME ARCHITECTURE & DESIGN SYSTEM TOKENS

The design system implements a **Token-Driven CSS Variable Architecture** supporting Light, Dark, and System modes seamlessly via `next-themes`.

```
[Design Tokens (JSON/Vars)] ──► [Tailwind Theme Extension] ──► [UI Primitives (shadcn)]
```

### Key Token Palette (CSS Variables)
- **Primary Navy (`--primary`):** Light `#0B1F3A` / Dark `#F7F9FC` (Brand identity, sidebar headers).
- **Primary Accent (`--accent`):** `#2F6FED` (Active states, primary call-to-action buttons, chart series 1).
- **Success Green (`--success`):** `#1FBF75` (Positive turnover, profit indicators, upward trend).
- **Danger Red (`--danger`):** `#E5484D` (Loss indicators, downward trend, destructive action buttons).
- **Warning Amber (`--warning`):** `#F5A623` (Pending states, AI-flagged anomaly alerts).
- **AI Secondary Violet (`--ai-violet`):** `#7C5CFC` (AI Copilot accents, chat bubbles, chart series 2).

---

## SECTION 5: ACCESSIBILITY (WCAG 2.2 AA) & PERFORMANCE STANDARDS

### 5.1 Accessibility Controls
- All interactive controls feature explicit `$2\text{px}$` focus outline rings (`focus-visible:ring-2 focus-visible:ring-accent`).
- Color contrast for body text against backgrounds is enforced at $\ge 4.5:1$ ($\ge 3:1$ for large headings).
- Complex Recharts visualizations automatically include a visually hidden data table accessible to screen readers (`aria-label="Financial Data Table Breakdown"`).

### 5.2 Core Web Vitals Targets
- **Largest Contentful Paint (LCP):** $< 2.0\text{s}$ on 4G connections via RSC pre-rendering.
- **First Input Delay (FID) / Interaction to Next Paint (INP):** $< 100\text{ms}$ via dynamic code splitting and React 19 concurrent features.
- **Cumulative Layout Shift (CLS):** $< 0.05$ achieved by preserving fixed height skeleton placeholders during data fetching.

---

## SECTION 6: FRONTEND READINESS CHECKLIST

Before UI developers begin writing TSX components or page layouts, verify the following:

- [x] Feature-sliced folder structure specified (`app/`, `features/`, `components/`, `lib/`).
- [x] React Server Components (RSC) vs Client Component boundaries defined.
- [x] State management domain split established (TanStack Query for Server State, Zustand for UI State, RHF for Form State).
- [x] CSS variable design tokens mapped for Light and Dark modes.
- [x] Design System primitives (Buttons, Inputs, Modals, Cards, Tables) specified.
- [x] WCAG 2.2 AA accessibility requirements and screen-reader fallbacks specified.
- [x] Core Web Vitals target thresholds established ($<2.0\text{s}$ LCP, $<100\text{ms}$ INP).

---

## ARCHITECTURAL CONCLUDING DIRECTIVE

This Frontend Architecture Specification is **complete, binding, and production-grade**. All UI components, page layouts, hooks, and feature modules must strictly adhere to the patterns, design system tokens, and performance guidelines defined herein.
