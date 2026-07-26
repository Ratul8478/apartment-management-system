# Enterprise Development Environment Specification

## 1. Overview & Objectives
This document specifies the technical design, tooling configuration, environment strategy, path aliasing, and code quality enforcement mechanisms for the **FinTrack Pro Enterprise AI Finance System**.

---

## 2. Development Tooling & Code Quality Architecture

### Tooling Stack Overview
```text
Developer Save Action / Git Pre-Commit Hook
  │
  ├─► EditorConfig (Whitespace, Line Endings, Indentation)
  ├─► ESLint 9 (AST Code Analysis, Security Rules, Import Order)
  ├─► Prettier 3 (Strict Formatting Consistency)
  ├─► TypeScript 5.6 (Type System Enforcement, Strict Null Checks)
  ├─► Husky + lint-staged (Automated Pre-Commit Validation)
  └─► Commitlint (Conventional Commit Message Validation)
```

---

## 3. Tool Specifications & Technical Rationale

### 1. EditorConfig (`.editorconfig`)
Enforces consistent editor baseline settings across VS Code, IntelliJ, WebStorm, and vim.
```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

### 2. Prettier Architecture (`.prettierrc`)
Configured to format TypeScript, JSON, CSS, and Markdown consistently without conflict with ESLint.
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 3. ESLint Architecture
Maintains strict code quality, Next.js rules, React rules, and security imports.

### 4. Husky & lint-staged Integration
- `.husky/pre-commit`: Runs `npx lint-staged` before any commit is accepted locally.
- `.husky/commit-msg`: Runs `npx --no -- commitlint --edit "${1}"` to enforce Conventional Commits.

### 5. Path Aliases (`tsconfig.json`)
Clean imports across all modules:
- `@/*` -> `./src/*`
- `@/components/*` -> `./src/components/*`
- `@/lib/*` -> `./src/lib/*`
- `@/types/*` -> `./src/types/*`

---

## 4. Environment Strategy (Multi-Tier Isolation)

> [!IMPORTANT]
> **Zero Secrets Policy:** Never commit secrets, passwords, API keys, or JWT private keys into Git repositories. All local development environment files must be derived from template references (`.env.example`).

### Multi-Tier Environment Layout

```text
Local Workstation        Staging Cluster          Production Cluster
  (.env.local)            (Kubernetes / App Svc)    (Enterprise Isolated Cloud)
      │                        │                        │
      ▼                        ▼                        ▼
Local Docker DB / Redis  Staging PostgreSQL      Managed Cloud Postgres
Anthropic Test Key       Staging Auth Server     HSM Key Vault & KMS
```

### Environment Variable Strategy
- **`DEVELOPMENT` (`.env.local`):** Local developer environment connecting to Docker containers.
- **`STAGING` (`.env.staging`):** Pre-production integration environment for QA verification.
- **`PRODUCTION` (`.env.production`):** Production environment with strict cloud secret injection.

### Standardized Environment Variable Schema Definition
```env
# Application Context
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database Configuration (PostgreSQL Docker)
DATABASE_URL=postgresql://fintrack_user:fintrack_dev_pass@localhost:5432/fintrack_db?schema=public

# Redis Infrastructure Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=fintrack_redis_dev

# Authentication & Session Governance
NEXTAUTH_SECRET=development_only_secret_do_not_use_in_prod
NEXTAUTH_URL=http://localhost:3000

# Artificial Intelligence Provider Configuration
ANTHROPIC_API_KEY=mock_development_key
```

---

## 5. Dependency Management & Upgrade Policy

1. **Lockfile Immutability:** `pnpm-lock.yaml` is strictly enforced. CI builds run with `pnpm install --frozen-lockfile`.
2. **Deterministic Version Pinning:** Exact patch versions pinned for core dependencies (`react`, `next`, `prisma`, `@prisma/client`).
3. **Monthly Dependency Audit:** Security updates audited via `pnpm audit` on the first Monday of every month.
