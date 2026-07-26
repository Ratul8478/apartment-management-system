# Dashboard Component System & Widget Blueprint

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Dashboard Component System & Widget Specifications  
**Author:** Staff UI Engineer & Dashboard Architect  
**Status:** Approved for Implementation  

---

## 1. Executive KPI Card Component (`KpiCard`)

- **Purpose:** Renders high-level financial metrics at the top of the analytics dashboard.
- **Visual Elements:**
  - Metric Label ($12\text{px}$ text `#4A5568`).
  - Metric Value ($32\text{px}$ bold tabular numbers).
  - Trend Delta Pill (Green `#1FBF75` for `+12.4%` growth; Red `#E5484D` for negative loss).
  - Background Icon Circle ($24\text{px}$ tinted icon).
- **Props Contract:** `{ label: string, value: string, delta: string, isPositive: boolean, icon: string }`.

---

## 2. Activity Timeline Component (`ActivityTimeline`)

- **Purpose:** Renders recent financial transactions and system audit logs.
- **Visual Elements:** Vertical connector line, event icon badge, timestamp caption, event description text, link to detail drawer.
