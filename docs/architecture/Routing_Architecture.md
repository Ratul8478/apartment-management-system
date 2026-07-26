# Routing Architecture & Navigation Guards

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Next.js 15 App Router Navigation & Route Guard Architecture  
**Author:** Staff Software Architect & Lead Frontend Engineer  
**Status:** Approved for Implementation  

---

## 1. Route Map & Access Restrictions

```
[Root: /] ──► Redirects to /dashboard if Authenticated, else /login

├── (marketing)/                      # Public Marketing Route Group
│   ├── /                             # Product Landing Page
│   ├── /features                     # Feature Showcase Page
│   └── /request-demo                 # Demo Request Modal Form
├── (auth)/                           # Unauthenticated Auth Route Group
│   ├── /login                        # User Login Screen
│   ├── /reset-password               # Password Reset Screen
│   └── /mfa                          # TOTP 2FA Challenge Screen
└── (dashboard)/                      # Authenticated Dashboard Route Group
    ├── /dashboard                    # Turnover & P&L Analytics Dashboard
    ├── /employees                    # Finance Staff Directory
    ├── /reports                      # Power BI & PPT Report Studio
    ├── /share-value                  # Share Tracker & Peer Comparison
    ├── /performance                  # KPI Scorecard & Anomaly Flags
    ├── /ai-chat                      # Conversational AI Assistant
    ├── /onboarding                   # Product Onboarding Wizard
    └── /admin/                       # Admin Route Sub-Group (Admin Role Required)
        ├── /admin/users              # Admin User Management
        └── /admin/audit-log          # Security Audit Trail Viewer
```

---

## 2. Route Guard Middleware Logic

Edge Middleware (`middleware.ts`) intercepts navigation requests prior to component rendering:
- Unauthenticated requests targeting `(dashboard)/*` are redirected to `/login?callbackUrl=...`.
- Authenticated requests targeting `/login` are redirected to `/dashboard`.
- Non-Admin users attempting navigation to `/admin/*` trigger a client-side HTTP `403 Forbidden` error screen.
