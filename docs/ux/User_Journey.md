# End-to-End User Journey Maps

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** User Journey Specification & Task Flow Mapping  
**Author:** Principal UX Researcher & Product Strategist  
**Status:** Approved for Implementation  

---

## 1. Primary User Journeys

### 1.1 Organization Onboarding & Activation Journey
```
[Visitor Lands on Public Page] ──► [Clicks "Create Organization"] ──► [Fills Admin Account Form]
                                                                             │
                                                                             ▼
[System Dispatches Verification Email] ◄── [Enters Company Profile & Base Currency]
            │
            ▼
[Clicks Email Link] ──► [Enrolls in TOTP MFA] ──► [Lands on Onboarding Wizard Step 1]
                                                                │
                                                                ▼
[Dashboard Auto-Populated] ◄── [Invites Roster] ◄── [Uploads First Financial CSV]
```

---

### 1.2 Bulk Financial CSV Import Journey
```
[User Clicks "Add Financial Data"] ──► [Selects "Bulk CSV Upload" Modal Tab]
                                                      │
                                                      v
                                      [Drags & Drops CSV File into Target Zone]
                                                      │
                                                      v
                                      [System Parses & Renders Preview Table]
                                                      │
                                ┌─────────────────────┴─────────────────────┐
                                ▼                                           ▼
                     [Validation Errors Found]                   [Validation Passed]
                                │                                           │
                     [Errors Highlighted Red]                    [User Clicks "Import 1,420 Rows"]
                                │                                           │
                     [User Fixes Cell inline]                    [Database Transaction Committed]
                                │                                           │
                                └─────────────────────┬─────────────────────┘
                                                      v
                                      [Redis Rollup Cache Cleared]
                                                      │
                                                      v
                                      [Dashboard Charts Auto-Refreshed]
```

---

### 1.3 PowerPoint Executive Slide Deck Export Journey
```
[User Navigates to /reports] ──► [Selects "Board Deck Standard" Template]
                                                    │
                                                    v
                                  [Opens Config Modal: Selects Date Range]
                                                    │
                                                    v
                                  [Clicks "Generate PowerPoint (.pptx)"]
                                                    │
                                                    v
                                  [BullMQ Background Worker Queued]
                                                    │
                                                    v
                                  [Toast Progress Notification Displayed]
                                                    │
                                                    v
                                  [S3 Pre-Signed Link Returned & Download Initiated]
```
