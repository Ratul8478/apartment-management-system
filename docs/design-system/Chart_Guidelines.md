# Financial Charting Guidelines & Recharts Architecture

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Recharts Integration Architecture & Financial Data Visualization Rules  
**Author:** Data Visualization Architect & Principal UI Engineer  
**Status:** Approved for Implementation  

---

## 1. Chart Color Assignment Rules

- **Series 1 (Primary Accent):** `#2F6FED` (Turnover / Revenue Bar Series).
- **Series 2 (Profit / Success):** `#1FBF75` (Net Profit Bar / Positive Trend Line).
- **Series 3 (Loss / Expense):** `#E5484D` (Expenses / Loss Donut Segment).
- **Series 4 (Secondary Violet):** `#7C5CFC` (AI Forecast Projection Line).

---

## 2. Tooltip & Grid Standards

- **Chart Tooltip Card:** Dark Navy background (`#0B1F3A`), white text, $6\text{px}$ border radius, explicit currency formatting (`₹ 1,500,000.00`).
- **Cartesian Grid Lines:** Dashed lines using subtle border token (`#EEF1F5`).
- **Screen Reader Accessibility:** All chart containers MUST render an off-screen accessible HTML table fallback.
