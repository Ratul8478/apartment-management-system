# Navigation Architecture & Information Hierarchy

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Sitemap, Navigation Patterns & Routing Flow  
**Author:** Lead UX Architect & Information Architect  
**Status:** Approved for Implementation  

---

## 1. Global Sitemap & Path Structure

```
FinTrack Pro Platform
├── Marketing Shell (Public)
│   ├── / (Landing Page)
│   ├── /features (Features Overview)
│   └── /request-demo (Demo Booking Form Modal)
├── Auth Shell (Unauthenticated)
│   ├── /login (User Login)
│   ├── /reset-password (Password Recovery)
│   └── /mfa (TOTP 2FA Challenge)
└── Dashboard Shell (Authenticated App Shell)
    ├── /dashboard (Analytics Home)
    ├── /employees (Finance Staff Roster)
    ├── /reports (Power BI & PPT Export Studio)
    ├── /share-value (Stock Price & Peer Comparison)
    ├── /performance (KPI Scorecard & AI Anomalies)
    ├── /ai-chat (AI Assistant Thread)
    ├── /onboarding (Product Onboarding Wizard)
    └── /admin (Admin Sub-Group)
        ├── /admin/users (User Provisioning & Roles)
        └── /admin/audit-log (Security Audit Trail)
```

---

## 2. Navigation Components & Behaviors

1. **Collapsible Sidebar Rail:** $260\text{px}$ width expanding view; collapses to $72\text{px}$ icon-only rail on screens below $1280\text{px}$.
2. **Top Bar Header:** Displays hierarchical Breadcrumbs (`Dashboard > Reports > Board Deck Generator`), global Command Search (`Cmd + K`), and User Profile Pill.
3. **Command Palette Search (`Cmd + K`):** Global modal overlay enabling instant keyboard navigation to any page, transaction record, or employee profile.
