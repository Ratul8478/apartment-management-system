# Developer Handbook — FinTrack Pro

Welcome to the FinTrack Pro engineering team! This handbook will guide you through setting up your local environment, understanding the repository architecture, and contributing productively within your first day.

---

## 1. Fast-Track Developer Onboarding (< 1 Hour Setup)

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/enterprise/fintrack-pro.git
cd "fintrack-pro"
npm install
```

### Step 2: Spin Up Local Infrastructure (PostgreSQL & Redis)
```bash
docker-compose up -d
```

### Step 3: Environment Setup
Copy sample environment file:
```bash
cp .env.example .env.local
```

### Step 4: Database Setup & Seed
```bash
# Push schema to local Postgres container
npx prisma db push

# Run audit configuration check
npm run config:check

# Seed local database with demo data
npm run db:seed
```

### Step 5: Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Log in with seeded admin credentials:
- **Email**: `admin@fintrackpro.com`
- **Password**: `AdminSecret123!`

---

## 2. Code Conventions & Git Standards

- **TypeScript**: Strict mode enabled (`"strict": true` in `tsconfig.json`). Never use `any` without explicit lead review.
- **Commit Messages**: Conventional Commits standard (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- **PR Process**: All PRs require 1 approving review and clean build pass before merging into `develop`.

---
