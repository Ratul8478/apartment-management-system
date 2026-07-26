# Enterprise Docker Development Environment Architecture

## 1. Executive Summary & Strategy
To eliminate configuration drift between operating systems (Windows, macOS, Linux) and guarantee reproducible local environments across all engineers, **FinTrack Pro** provides a dockerized local infrastructure stack.

The local development stack consists of:
- **Local Application Container (Optional Node/Next.js runner)**
- **PostgreSQL 16 Enterprise DB Container**
- **Redis 7 In-Memory Cache & BullMQ Queue Container**

---

## 2. Docker Compose Architecture (`docker-compose.yml`)

### Network Architecture
A dedicated, isolated bridge network (`fintrack-dev-network`) connects containers securely while exposing necessary local host ports (`5432` for Postgres, `6379` for Redis, `3000` for Next.js).

### Volume Persistence Strategy
- `fintrack_postgres_data`: Persistent volume backing PostgreSQL database tables across container restarts.
- `fintrack_redis_data`: Persistent volume backing Redis cache keys and queue state.

---

## 3. Local Infrastructure Stack Definition

```yaml
version: '3.8'

services:
  # PostgreSQL Database Container
  postgres:
    image: postgres:16-alpine
    container_name: fintrack-postgres-dev
    restart: unless-stopped
    environment:
      POSTGRES_USER: fintrack_user
      POSTGRES_PASSWORD: fintrack_dev_pass
      POSTGRES_DB: fintrack_db
    ports:
      - '5432:5432'
    volumes:
      - fintrack_postgres_data:/var/lib/postgresql/data
    networks:
      - fintrack-dev-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fintrack_user -d fintrack_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis Cache & BullMQ Container
  redis:
    image: redis:7-alpine
    container_name: fintrack-redis-dev
    restart: unless-stopped
    command: redis-server --requirepass fintrack_redis_dev --appendonly yes
    ports:
      - '6379:6379'
    volumes:
      - fintrack_redis_data:/data
    networks:
      - fintrack-dev-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "fintrack_redis_dev", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

networks:
  fintrack-dev-network:
    driver: bridge

volumes:
  fintrack_postgres_data:
    driver: local
  fintrack_redis_data:
    driver: local
```

---

## 4. Multi-Stage Development Dockerfile (`Dockerfile.dev`)

```dockerfile
# Base Image
FROM node:20-alpine AS base
WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies Stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Development Stage
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
EXPOSE 3000

CMD ["pnpm", "dev"]
```

---

## 5. Developer Control Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Start Infrastructure** | `pnpm docker:up` or `docker-compose up -d` | Launches Postgres & Redis in background. |
| **Stop Infrastructure** | `pnpm docker:down` or `docker-compose down` | Stops containers without destroying volumes. |
| **View Logs** | `pnpm docker:logs` or `docker-compose logs -f` | Streams real-time log output from services. |
| **Reset Data** | `docker-compose down -v` | Wipes database and Redis volumes for fresh setup. |
