# Developer Configuration & Onboarding Guide

**System Name:** FinTrack Pro (Enterprise AI Finance Management System)  
**Document Type:** Developer Onboarding & Operational Guide  
**Classification:** Enterprise Internal Engineering Standard  
**Version:** 2.0.0  

---

## 1. Executive Summary & Onboarding Philosophy

This guide provides software engineers joining **FinTrack Pro** with clear instructions for configuring, managing, and troubleshooting local application environments. 

By enforcing strict configuration schemas, auto-generating `.env.example` templates, and providing instant fail-fast terminal errors, new engineers can set up a functional, secure development environment in under 10 minutes.

---

## 2. Fast-Track Local Setup Protocol

### Step 1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/enterprise/fintrack-pro.git
cd fintrack-pro
npm install
```

### Step 2: Hydrate Local Environment File
Copy the master configuration template `.env.example` to your local environment file `.env.local`:
```bash
cp .env.example .env.local
```

> [!WARNING]
> **Git Protection:**
> `.env.local` is strictly ignored in `.gitignore`. NEVER use `git add -f .env.local` or attempt to commit `.env.local` files to source control.

### Step 3: Launch Local Docker Infrastructure
Start local PostgreSQL and Redis containers using Docker Compose:
```bash
docker-compose up -d
```

### Step 4: Boot Local Development Server
Launch Next.js development server:
```bash
npm run dev
```

---

## 3. Environment Variable Resolution Order

Next.js 15 resolves environment variables in the following strict priority order (higher numbers override lower numbers):

1. `process.env` (OS Environment Variables injected by Docker / Host Shell) — **HIGHEST**
2. `.env.local` (Local developer overrides — git-ignored)
3. `.env.development` / `.env.production` (Environment-specific defaults)
4. `.env` (Global fallback defaults) — **LOWEST**

---

## 4. Diagnosing Configuration Validation Failures

If `npm run dev` fails on startup with a configuration error block:

### Diagnostic Step 1: Read Terminal Output
The central validation schema (`src/lib/config/env.ts`) outputs the exact key causing failure:
```text
  • [JWT_SECRET]: JWT_SECRET must be at least 32 characters long
```

### Diagnostic Step 2: Inspect Variable Constraints
Check `src/lib/config/schema.ts` to inspect expected Zod validation rules:
- Is it expecting a URL? (`http://...`)
- Is it expecting a coerced number? (`PORT=3000` not `PORT="three-thousand"`)
- Is it expecting a minimum character length?

### Diagnostic Step 3: Re-sync `.env.local`
If new environment variables were introduced in `develop`, copy missing parameters from `.env.example` into `.env.local`.

---

## 5. Adding New Environment Variables (Developer Workflow)

When implementing a feature requiring a new configuration parameter:

1. **Update `.env.example`:** Add the key with a non-sensitive default value and descriptive comment header.
2. **Update Zod Schema (`src/lib/config/schema.ts`):** Define strict validation constraints, default fallbacks, and error messages.
3. **Update `.env.local`:** Add the parameter locally.
4. **Access in Code:** Import `env` from `@/lib/config/env` (DO NOT read `process.env` directly!).
```typescript
// ✅ CORRECT: Safe, typed, immutable access
import { env } from '@/lib/config/env';
const maxTokens = env.AI_MAX_TOKENS;

// ❌ INCORRECT: Unvalidated, unsafe direct lookup
const maxTokens = process.env.AI_MAX_TOKENS;
```

---

## 6. Architectural Evaluation Matrix

```text
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ Dimension                 │ Architectural Impact & System Benefit                  │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Technical Reasoning       │ Standardized onboarding protocol reduces developer     │
│                           │ setup time from hours to under 10 minutes              │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Security Implications     │ Safe `.env.local` isolation ensures developer mock     │
│                           │ keys never mix with cloud pipeline secrets             │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Scalability Considerations│ Clear resolution order allows container orchestrators to│
│                           │ inject environment overrides without code edits        │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Operational Considerations│ Formatted diagnostic logs enable developers to self-fix│
│                           │ environment errors without opening support tickets    │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Maintainability Guidance  │ Self-documenting `.env.example` acts as living config  │
│                           │ documentation for the engineering team                 │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```
