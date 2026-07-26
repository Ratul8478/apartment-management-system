# Enterprise Repository Setup Guide

## 1. Executive Overview & Technical Reasoning
This guide defines the standardized enterprise repository initialization, branching strategy, script architecture, and package management strategy for the **FinTrack Pro Enterprise AI Finance OS**. Designed in accordance with engineering practices used at Google, Microsoft, Stripe, and Atlassian, this repository setup ensures high reproducibility, developer velocity, strict quality controls, and zero environment drift across engineering teams.

---

## 2. Repository Metadata & Governance

### Repository Identity
- **Repository Name:** `fintrack-pro-enterprise`
- **Visibility:** Private (Enterprise Organization Scope)
- **Description:** Enterprise AI-Grounded Financial OS & Automated Board Reporting Platform built on Next.js 15, React 19, TypeScript, Prisma, Redis, and Anthropic Claude AI.
- **Default Branch:** `main`

### Branch Hierarchy Strategy
```text
main (Production Release)
  ▲
  │ (Release Pull Request & Tagged Release)
release/vX.Y.Z
  ▲
  │ (Feature Integration)
develop (Integration Branch)
  ▲
  ├─► feature/FIN-101-turnover-rollup
  ├─► fix/FIN-204-jwt-expiry-guard
  └─► chore/FIN-305-upgrade-pnpm-deps
```

| Branch Pattern | Purpose | Lifetime | Access Controls |
| :--- | :--- | :--- | :--- |
| `main` | Production-ready state. Synchronized with live deployments. | Permanent | Strictly Protected. Require 2 approvals, passing CI checks, signed commits. |
| `develop` | Staging integration branch. Target for feature PRs. | Permanent | Protected. Requires 1 approval & passing CI checks. |
| `release/v*` | Pre-release stabilization branch for QA verification. | Temporary | Protected. Merges to `main` and `develop` on release. |
| `feature/*` | Feature work tagged to JIRA/GitHub issue ticket ID. | Ephemeral | Developer topic branch. Merged to `develop` via PR. |
| `fix/*` | Non-critical bug fix branch. | Ephemeral | Developer topic branch. Merged to `develop` via PR. |
| `hotfix/*` | Urgent production issue fix branched off `main`. | Ephemeral | Merges directly to `main` and back-ported to `develop`. |

---

## 3. GitHub Taxonomy: Labels & Milestones

### Enterprise Label Taxonomy
- `type: feature` — New product functionality or capability.
- `type: bug` — Software defect or regression.
- `type: security` — Vulnerability patch, auth guard, or compliance update.
- `type: perf` — Performance tuning, query optimization, or bundle size reduction.
- `type: docs` — Technical documentation or inline docstring updates.
- `type: infra` — Docker, GitHub Actions, or environment setup changes.
- `priority: critical` — Blockers requiring immediate triage.
- `priority: high` — High-impact feature or issue scheduled for current sprint.
- `scope: frontend` — Next.js client components & UI tokens.
- `scope: backend` — App Router API routes, Prisma schemas, or services.

### Milestones Lifecycle
1. **Milestone 1.0 (Foundation & Dev Setup):** Development tooling, Docker stack, repository foundation.
2. **Milestone 1.1 (Auth & Multi-Tenancy):** RBAC, JWT NextAuth, session management, organization isolation.
3. **Milestone 1.2 (Finance Engine & Ledger):** Turnover rollups, profit-loss metrics, CSV bulk import engine.
4. **Milestone 1.3 (AI Intelligence & Grounding):** Claude AI prompt-grounded assistant & vector search.
5. **Milestone 1.4 (Executive Exports & Studio):** PowerPoint (`.pptx`) generation & Power BI dataset schemas.

---

## 4. Package Management Architecture (`pnpm`)

### Why `pnpm`?
`pnpm` is enforced across the organization for the following critical technical reasons:
1. **Content-Addressable Storage:** Avoids duplicate disk storage of `node_modules` across branches.
2. **Strict Dependency Graph:** Prevents phantom dependencies (importing packages not declared in `package.json`).
3. **Speed & Determinism:** 3x faster lockfile parsing and installation than standard npm/yarn.

### Configuration (`.npmrc`)
```ini
engine-strict=true
auto-install-peers=true
link-workspace-packages=true
prefer-frozen-lockfile=true
```

---

## 5. Project Script Architecture

Standardized package commands defined in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json,md}\"",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "prepare": "husky install"
  }
}
```

---

## 6. Technical Reasoning & Maintainability Summary

| Choice | Enterprise Rationale | Benefit |
| :--- | :--- | :--- |
| **Strict Branch Protection** | Prevents untested or breaking changes from entering main branches. | High uptime & reliable CD deployments. |
| **pnpm Lockfile Enforcement** | Guarantees exact binary dependency matching across all engineer machines. | Eliminates "works on my machine" bugs. |
| **Conventional Commits** | Automates CHANGELOG generation and release versioning. | Clear audit trail for compliance. |
