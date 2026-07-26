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
  --color-primary-navy: #0b1f3a;
  --color-primary-accent: #2f6fed;
  --color-success-green: #1fbf75;
  --color-danger-red: #e5484d;
  --color-warning-amber: #f5a623;
  --color-ai-violet: #7c5cfc;
  --color-bg-app: #f7f9fc;
  --color-bg-card: #ffffff;
  --color-border: #d7dce3;
  --color-text-primary: #1a1f2b;
  --color-text-secondary: #4a5568;
}

/* Dark Theme Tokens */
.dark {
  --color-primary-navy: #f7f9fc;
  --color-primary-accent: #2f6fed;
  --color-success-green: #1fbf75;
  --color-danger-red: #e5484d;
  --color-warning-amber: #f5a623;
  --color-ai-violet: #7c5cfc;
  --color-bg-app: #080f1a;
  --color-bg-card: #0f172a;
  --color-border: #1e293b;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
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
