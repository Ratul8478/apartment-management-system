# Complete Application Screen Hierarchy

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Screen Topology & Parent-Child Relationships  
**Author:** Staff UX Architect  
**Status:** Approved for Implementation  

---

## 1. Screen & Sub-Screen Taxonomy

```
1.0 Public Marketing Group
    1.1 Landing Page (/page.tsx)
    1.2 Features Page (/features/page.tsx)
    1.3 Request Demo Modal (/request-demo/page.tsx)

2.0 Unauthenticated Auth Group
    2.1 Login Screen (/login/page.tsx)
    2.2 Password Reset Request Screen (/reset-password/page.tsx)
    2.3 Password Reset Token Screen (/reset-password/[token]/page.tsx)
    2.4 TOTP MFA Challenge Screen (/mfa/page.tsx)

3.0 Authenticated App Shell Group
    3.1 Main Dashboard (/dashboard/page.tsx)
        3.1.1 Manual Transaction Entry Modal
        3.1.2 Bulk CSV Upload Modal
        3.1.3 Date Range Filter Drawer
    3.2 Employee Directory (/employees/page.tsx)
        3.2.1 Employee Profile Drawer
        3.2.2 Add/Edit Employee Modal
    3.3 Reports Studio (/reports/page.tsx)
        3.3.1 Report Template Config Modal
        3.3.2 Power BI Embedded Panel View
        3.3.3 Export Download History Drawer
    3.4 Share Value Tracker (/share-value/page.tsx)
        3.4.1 Peer Company Comparison Overlay
        3.4.2 Manual Share Price Entry Modal
    3.5 Performance & Anomalies (/performance/page.tsx)
        3.5.1 Anomaly Deviation Detail Modal
    3.6 AI Financial Assistant (/ai-chat/page.tsx)
        3.6.1 Chat Session History Drawer
        3.6.2 Full-screen Mini Chart View
    3.7 Onboarding Wizard (/onboarding/page.tsx)
        3.7.1 Step 1: Company Profile Setup
        3.7.2 Step 2: Team Roster Invite
        3.7.3 Step 3: Initial Data Ingestion
    3.8 Admin Management Panel (/admin)
        3.8.1 User Management Table (/admin/users/page.tsx)
        3.8.2 User Role Assignment Modal
        3.8.3 Security Audit Log Viewer (/admin/audit-log/page.tsx)
```
