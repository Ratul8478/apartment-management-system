# Enterprise Import Architecture & Path Aliasing Strategy

## 1. Executive Summary & Philosophy

To prevent deep relative paths (e.g. `../../../../lib/utils`), avoid circular dependencies, ensure clean tree-shaking, and maintain high readability across thousands of source files, **FinTrack Pro** enforces a standardized import strategy using TypeScript path aliases and rigid import ordering rules.

---

## 2. Path Alias Configuration (`tsconfig.json`)

All internal application imports MUST use root-relative path aliases defined in `tsconfig.json`. Relative parent traversals (`../`) extending beyond the immediate directory are strictly forbidden.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Enterprise Alias Mapping Table

| Path Alias Prefix | Target Folder Location | Usage Scope & Purpose | Example Import Statement |
| :--- | :--- | :--- | :--- |
| `@/app/*` | `src/app/*` | App Router pages & route handlers | `import { providers } from '@/app/providers'` |
| `@/components/*` | `src/components/*` | UI components & design system | `import { Button } from '@/components/ui/Button'` |
| `@/lib/*` | `src/lib/*` | Infrastructure, export engines, helpers | `import { cn } from '@/lib/utils'` |
| `@/server/*` | `src/server/*` | Domain services & DB repositories | `import { financeService } from '@/server/services/financeService'` |
| `@/types/*` | `src/types/*` | TypeScript domain contracts & DTOs | `import { UserRole } from '@/types'` |

---

## 3. Mandatory 5-Tier Import Ordering Rules

To maintain uniform readability across all engineering teams, imports inside every source file MUST be organized into 5 distinct tiers separated by a single blank line:

```typescript
// 1. External Third-Party Libraries (Framework & Dependencies)
import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Sparkles, AlertCircle } from 'lucide-react';

// 2. Enterprise Contracts, Interfaces, & Enums
import { UserRole, FinanceRecord, ApiResponse } from '@/types';

// 3. Infrastructure Utilities & Backend Domain Services
import { cn, formatCurrency } from '@/lib/utils';
import { financeService } from '@/server/services/financeService';

// 4. Visual UI Components & Design System Primitives
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

// 5. Local Same-Directory Sub-Components & Styles
import { LocalFormHeader } from './LocalFormHeader';
```

---

## 4. Barrel File Policy (`index.ts`) & Module Visibility

1. **Allowed Barrel Uses:** Barrel files (`index.ts`) are permitted ONLY at:
   - `src/types/index.ts` (Central domain contract exports)
   - `src/components/ui/index.ts` (Atomic UI design system components)
2. **Forbidden Barrel Uses:** Deep barrel exports in `src/server/services/` or `src/server/repositories/` are strictly PROHIBITED. Deep server barrels cause circular reference locks and degrade Node.js startup times.
3. **Public Exports vs. Private Implementation:**
   - A feature module exposes its public API through `src/app/api/<feature>/route.ts` and its public service wrapper.
   - Internal helper sub-components remain private to their module folder and are NOT exported globally.
