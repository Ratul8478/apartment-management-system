# Design System Tokens Specification

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Design Tokens Catalog & CSS Variables Specification  
**Author:** Design Tokens Architect & Lead UI Engineer  
**Status:** Approved for Implementation  

---

## 1. Color System Tokens (CSS Variables)

```css
/* Light Theme Tokens */
:root {
  --color-primary-navy: #0B1F3A;
  --color-primary-accent: #2F6FED;
  --color-success-green: #1FBF75;
  --color-danger-red: #E5484D;
  --color-warning-amber: #F5A623;
  --color-ai-violet: #7C5CFC;
  --color-bg-app: #F7F9FC;
  --color-bg-card: #FFFFFF;
  --color-border: #D7DCE3;
  --color-text-primary: #1A1F2B;
  --color-text-secondary: #4A5568;
}

/* Dark Theme Tokens */
.dark {
  --color-primary-navy: #F7F9FC;
  --color-primary-accent: #2F6FED;
  --color-success-green: #1FBF75;
  --color-danger-red: #E5484D;
  --color-warning-amber: #F5A623;
  --color-ai-violet: #7C5CFC;
  --color-bg-app: #080F1A;
  --color-bg-card: #0F172A;
  --color-border: #1E293B;
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #94A3B8;
}
```

---

## 2. Elevation & Shadow Tokens

- **`shadow-sm`:** `0 1px 2px 0 rgba(16, 24, 40, 0.05)` (Cards, Inputs).
- **`shadow-md`:** `0 4px 6px -1px rgba(16, 24, 40, 0.1), 0 2px 4px -1px rgba(16, 24, 40, 0.06)` (Dropdowns, Popovers).
- **`shadow-lg`:** `0 10px 15px -3px rgba(16, 24, 40, 0.1), 0 4px 6px -2px rgba(16, 24, 40, 0.05)` (Modals, Drawers).

---

## 3. Z-Index Layer Scale

- **`z-deep`:** `-1` (Background elements).
- **`z-base`:** `0` (Normal content flow).
- **`z-sticky`:** `10` (Sticky table headers, Sticky Topbar).
- **`z-dropdown`:** `20` (Dropdown menus, Popovers, Tooltips).
- **`z-overlay`:** `30` (Modal & Drawer backdrops).
- **`z-modal`:** `40` (Modal dialog containers).
- **`z-toast`:** `50` (Top-right notification toasts).
