# Enterprise Deployment Guide — FinTrack Pro

## 1. Prerequisites & System Requirements

- **Operating System**: Linux (Ubuntu 22.04 LTS / Alpine 3.19) or Docker Container host.
- **Node.js**: v20.x LTS or higher.
- **Database Engine**: PostgreSQL 16+.
- **In-Memory Cache**: Redis 7+.
- **Docker & Docker Compose**: v24.x+ / Docker Compose v2.x+.

---

## 2. Production Docker Deployment

```yaml
# Production Docker Run Specification
docker run -d \
  --name fintrack-pro-prod \
  --restart always \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://fintrack_admin:SECURE_PASS@pg-cluster.internal:5432/fintrack_prod?schema=public&sslmode=require" \
  -e REDIS_URL="redis://:REDIS_PASS@redis-cluster.internal:6379" \
  -e JWT_SECRET="SUPER_SECRET_ENT_KEY_32_BYTES_MIN" \
  -e NEXTAUTH_SECRET="NEXTAUTH_ENT_KEY_32_BYTES_MIN" \
  -e OPENAI_API_KEY="sk-proj-..." \
  -e STRIPE_SECRET_KEY="sk_live_..." \
  -e STRIPE_WEBHOOK_SECRET="whsec_..." \
  fintrackpro/app:v1.0.0
```

---

## 3. Deployment Execution Steps

1. **Environment Configuration Audit**:
   ```bash
   npm run config:check
   ```
2. **Database Schema Migration Push**:
   ```bash
   npx prisma migrate deploy
   ```
3. **Database Health Verification**:
   ```bash
   npm run db:platform-check
   ```
4. **Application Build**:
   ```bash
   npm run build
   ```
5. **Start Production Service**:
   ```bash
   npm run start
   ```

---

## 4. Health Check Probes

- **Liveness Probe**: `GET http://localhost:3000/api/health` -> Status 200 `{ "status": "UP" }`
- **Readiness Probe**: `GET http://localhost:3000/api/admin/system-config` -> Status 200 `{ "dbConnected": true, "redisConnected": true }`

---
