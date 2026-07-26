# Low-Fidelity Wireframe Specification & Screen Layout Contracts

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Wireframe Specifications & ASCII Layout Structural Specs  
**Author:** Lead Enterprise UI Consultant  
**Status:** Approved for Implementation  

---

## 1. Main Dashboard Screen Layout (`/dashboard`)

```
+-----------------------------------------------------------------------------------+
| TOP BAR: [Logo] | Breadcrumb: Home > Dashboard | Search [Cmd+K] | (User Profile)  |
+-------------------+---------------------------------------------------------------+
| SIDEBAR (260px)   | PAGE HEADER: "Executive Financial Dashboard"  [+ Add Transaction] |
| - Dashboard (Active)| Time Toggle: [Daily] [Monthly*] [Yearly]  Date: [Q3 2026 v]   |
| - Employees       +---------------------------------------------------------------+
| - Reports Studio  | KPI CARDS ROW                                                 |
| - Share Tracker   | [Total Turnover]  [Net Profit/Loss] [Growth %]  [Active Staff]  |
| - AI Assistant    |  ₹15.4M (+12%)    ₹4.2M (+8%)        +12.4%        42           |
| - Admin Panel     +---------------------------------------------------------------+
|                   | MAIN ANALYTICS BLOCK                                          |
|                   | [Chart View: Bar* | Pie]                                      |
|                   | +-----------------------------------------------------------+ |
|                   | | TURNOVER VS PROFIT/LOSS DUAL SERIES BAR CHART             | |
|                   | | (Jan - Jun 2026)                                          | |
|                   | +-----------------------------------------------------------+ |
|                   +---------------------------------------------------------------+
|                   | RECENT ACTIVITY & AI INSIGHTS ROW                             |
|                   | [Recent Financial Transactions] | [AI Suggestions Widget]     |
|                   | - Jul 01: ₹1.5M Enterprise Sale | - "Profit up 12% in Q2 due |
|                   | - Jun 28: ₹450K Operating Cost  |   to reduced Opex."         |
+-------------------+---------------------------------------------------------------+
```

---

## 2. Bulk CSV Import Modal Layout (`/dashboard?modal=csv-upload`)

```
+-----------------------------------------------------------------------------------+
| MODAL: Bulk Financial CSV Data Ingestion                              [X Close]   |
+-----------------------------------------------------------------------------------+
| INSTRUCTIONS: Download Template (.csv) | Max 10,000 Rows                          |
|                                                                                   |
| +-------------------------------------------------------------------------------+ |
| | DROP CSV FILE HERE OR CLICK TO BROWSE                                         | |
| | Supported formats: .csv, .xlsx (Max size 10MB)                                | |
| +-------------------------------------------------------------------------------+ |
|                                                                                   |
| PARSED PREVIEW TABLE (Showing 5 of 1,420 Rows)                                   |
| Status | Date       | Metric Type | Amount (INR) | Category     | Validation  |
| ------ | ---------- | ----------- | ------------ | ------------ | ----------- |
| OK     | 2026-07-01 | TURNOVER    | 1,500,000.00 | Software Sales| Valid      |
| ERR    | 2026-07-02 | PROFIT_LOSS | -             | Marketing    | Amount req. |
|                                                                                   |
| [Cancel]                                                  [Import 1,420 Records]  |
+-----------------------------------------------------------------------------------+
```
