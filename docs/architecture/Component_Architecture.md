# Detailed Component Architecture & Hierarchy

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Component Hierarchy, Atomic Design & Component Contracts  
**Author:** Staff UI Engineer & Design System Lead  
**Status:** Approved for Implementation  

---

## 1. Atomic Design System Hierarchy

```
[Atoms] ───────► Buttons, Inputs, Labels, Badges, Icons
   │
   ▼
[Molecules] ───► Form Fields, Search Bar, Table Headers, Toast Notifications
   │
   ▼
[Organisms] ───► Navigation Sidebar, Finance Entry Modal, KPI Card Row, Chart Card
   │
   ▼
[Templates] ───► Dashboard Layout Shell, Auth Layout Shell, Marketing Layout Shell
   │
   ▼
[Pages] ───────► Dashboard Page, Employee Directory Page, Report Studio Page
```

---

## 2. Smart vs. Presentational Component Specifications

### 2.1 Presentational Component Example: `BarChart.tsx`
- **Contract:** Pure UI primitive component.
- **Props:** Receives `data: ChartPoint[]`, `metricType: 'turnover' | 'profit_loss'`, `height: number`, `isLoading: boolean`.
- **Behavior:** Renders Recharts bar series using design system color tokens (`#2F6FED`, `#1FBF75`). Contains zero data-fetching logic or state side-effects.

### 2.2 Smart Feature Container Example: `DashboardWidgetContainer.tsx`
- **Contract:** Feature container component.
- **State & Hooks:** Calls `useDashboardMetricsQuery({ period, dateRange })` and subscribes to `useDashboardStore()` for filter state.
- **Behavior:** Handles loading skeletons, error retry fallbacks, and passes formatted data arrays directly to `BarChart.tsx` and `PieChart.tsx`.
