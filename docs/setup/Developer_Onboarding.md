# Developer Onboarding & Quickstart Guide

## 1. Welcome to FinTrack Pro Engineering
This guide provides the complete step-by-step setup procedure for new software engineers joining the **FinTrack Pro** team. By following this guide, your local development environment will be fully configured, verified, and running in under 10 minutes.

---

## 2. Prerequisites & Software Requirements

Before starting, ensure your workstation meets the following minimum requirements:

| Tool | Required Version | Installation Command / Link |
| :--- | :--- | :--- |
| **Node.js** | `v20.x` LTS or higher | `nvm install 20 && nvm use 20` |
| **pnpm** | `v9.x` or higher | `npm install -g pnpm` |
| **Docker Desktop** | `v4.25+` | [Docker Desktop Download](https://www.docker.com/products/docker-desktop/) |
| **Git** | `v2.40+` | `winget install Git.Git` or `brew install git` |
| **VS Code** | Latest Stable | [VS Code Download](https://code.visualstudio.com/) |

---

## 3. Step-by-Step Developer Setup Workflow

```text
Step 1: Clone Repository
       │
       ▼
Step 2: Install Dependencies (pnpm install)
       │
       ▼
Step 3: Setup Environment Variables (.env.local)
       │
       ▼
Step 4: Launch Docker Services (docker-compose up -d)
       │
       ▼
Step 5: Start Local Next.js Dev Server (pnpm dev)
       │
       ▼
Step 6: Run Verification Suite (pnpm typecheck && pnpm lint)
```

### Detailed Execution Commands

#### Step 1: Clone the Repository
```bash
git clone https://github.com/enterprise-org/fintrack-pro-enterprise.git
cd "fintrack-pro-enterprise"
```

#### Step 2: Install Dependencies
```bash
pnpm install
```

#### Step 3: Setup Local Environment File
```bash
cp .env.example .env.local
```

#### Step 4: Start Local Infrastructure (PostgreSQL & Redis)
```bash
pnpm docker:up
```

Verify containers are running cleanly:
```bash
docker ps
```
*Expected Output:* Two healthy containers (`fintrack-postgres-dev` listening on `5432` and `fintrack-redis-dev` listening on `6379`).

#### Step 5: Launch Next.js Local Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to verify the application loads.

#### Step 6: Verify Code Quality Tools
```bash
pnpm typecheck
pnpm lint
```

---

## 4. Standard Daily Developer Loop

When starting your work day or creating a new feature branch:

1. **Pull Latest Changes:**
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **Create Topic Branch:**
   ```bash
   git checkout -b feature/FIN-123-new-feature
   ```
3. **Run Dev Environment:**
   ```bash
   pnpm dev
   ```
4. **Commit Changes with Conventional Format:**
   ```bash
   git commit -m "feat(analytics): add quarterly turnover rollup card"
   ```

---

## 5. Onboarding Troubleshooting Matrix

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| `pnpm: command not found` | `pnpm` is not installed globally. | Run `npm install -g pnpm`. |
| `Port 5432 in use` | Local PostgreSQL service running natively. | Stop native service (`net stop postgresql-x64-16` or `brew services stop postgresql`). |
| `Lockfile is out of date` | Package added with `npm` instead of `pnpm`. | Delete `package-lock.json`, run `pnpm install`. |
| `Husky pre-commit failed` | Linting or type check error on modified file. | Run `pnpm lint:fix` or fix TypeScript types. |
