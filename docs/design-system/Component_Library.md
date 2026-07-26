# Enterprise Component Library Specification & Component Contracts

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** Technical Component Specifications, Props Contracts & Variants  
**Author:** Staff Component Architect & UI Platform Lead  
**Status:** Approved for Implementation  

---

## 1. Foundation Components

### 1.1 `Button` Component Specification
- **Purpose:** Primary user action trigger.
- **Variants:** `primary` (solid blue `#2F6FED`), `secondary` (outlined), `destructive` (solid red `#E5484D`), `ghost` (text-only), `ai` (gradient violet `#7C5CFC`).
- **Sizes:** `sm` (height 32px), `md` (height 40px - default), `lg` (height 48px).
- **States:** `default`, `hover`, `active`, `focus-visible`, `disabled`, `loading` (replaces icon with spinner).
- **Props Contract:** `{ variant, size, isLoading, isDisabled, leftIcon, rightIcon, children, onClick }`.

---

### 1.2 `Input` & `CurrencyInput` Component Specifications
- **Purpose:** Textual and numerical financial data entry.
- **Variants:** `standard`, `error` (red border `#E5484D`), `success` (green border `#1FBF75`).
- **Currency Features:** Automatically formats numerical input with currency symbols (e.g. `₹ 1,500,000.00`) and enforces non-zero constraints.
- **Props Contract:** `{ label, errorText, helperText, currencySymbol, isRequired, isReadOnly, onChange }`.

---

### 1.3 `DataTable` Component Specification
- **Purpose:** High-density display of financial transactions, employee records, and audit logs.
- **Features:** Sticky header, row hover highlighting, column sorting, pagination controls, zebra striping, custom cell renderers.
- **Props Contract:** `{ columns: ColumnDef[], data: Record[], isLoading: boolean, pagination: PaginationConfig, onSort: Function }`.
