# Enterprise Design System Tokens & Visual Specification

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Design Tokens, Color Palette, Typography & Visual Specifications  
**Author:** Design System Architect & Principal UX Lead  
**Status:** Approved for Implementation  

---

## 1. Color Palette Tokens

```
+-----------------------------------------------------------------------------------+
| BRAND PALETTE                                                                     |
| - Primary / Navy:          #0B1F3A (Sidebar, Headers, Primary Text)                 |
| - Primary Accent / Blue:   #2F6FED (Primary Buttons, Active States, Chart Series 1)|
| - Success / Profit Green:  #1FBF75 (Turnover, Profit, Upward Trend Indicators)    |
| - Danger / Loss Red:       #E5484D (Loss Indicators, Downward Trend, Destructive) |
| - Warning / Amber:         #F5A623 (Alerts, Pending States, AI Anomaly Flags)      |
| - Secondary / Violet:      #7C5CFC (AI Copilot Accents, Chart Series 2)           |
+-----------------------------------------------------------------------------------+
| SURFACE & NEUTRAL PALETTE                                                         |
| - App Background:          #F7F9FC (Light Mode) / #080F1A (Dark Mode)             |
| - Card Surface:            #FFFFFF (Light Mode) / #0F172A (Dark Mode)             |
| - Border / Divider:        #D7DCE3 (Light Mode) / #1E293B (Dark Mode)             |
| - Text Primary:            #1A1F2B (Light Mode) / #F8FAFC (Dark Mode)             |
| - Text Secondary:          #4A5568 (Light Mode) / #94A3B8 (Dark Mode)             |
+-----------------------------------------------------------------------------------+
```

---

## 2. Typography Scale (Inter Font Family)

| Role | Font Family | Size / Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **H1 / Page Title** | Inter | 28px / 700 (Bold) | 36px | Main Page Headers |
| **H2 / Section Title**| Inter | 20px / 600 (Semi-Bold) | 28px | Section Headings & Modal Titles |
| **H3 / Card Title** | Inter | 16px / 600 (Semi-Bold) | 24px | Card Titles, Table Headers |
| **Body Text** | Inter | 14px / 400 (Regular) | 20px | General Form Labels & Content |
| **Small / Subtext** | Inter | 12px / 400 (Regular) | 16px | Captions, Metadata, Badges |
| **KPI Metric Numbers**| Inter (Tabular Nums)| 32px / 700 (Bold) | 40px | Top KPI Card Values |

---

## 3. Spacing Scale & Grid Boundaries

- **Base Unit:** $4\text{px}$.
- **Scale:** `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px`.
- **App Shell Grid:** Fixed left sidebar $260\text{px}$ (collapsible to $72\text{px}$ icon rail) + Topbar $64\text{px}$ + Fluid content container (Max-width $1440\text{px}$, $24\text{px}$ gutters).
- **Border Radius Token:** Cards ($12\text{px}$), Buttons & Inputs ($8\text{px}$), Modals ($16\text{px}$), Badges & Pills ($9999\text{px}$ full-round).
