# Operational Runbook Collection — FinTrack Pro

This runbook collection provides step-by-step diagnostic and remediation procedures for site reliability engineers (SREs), system administrators, and incident response personnel.

---

## Runbook 1: High CPU / Memory Utilization Incident

### Trigger
- CPU utilization > 85% for > 5 minutes OR Node.js memory heap > 90% allocation.

### Diagnosis
1. Inspect container resource metrics via `docker stats` or Grafana dashboard.
2. Check for runaway AI completion prompts or un-paginated financial query exports in app logs:
   ```bash
   docker logs fintrack-pro-prod --tail 200 | grep -i "memory"
   ```

### Remediation
1. Scale up container replicas horizontally:
   ```bash
   docker-compose up -d --scale web=4
   ```
2. If memory leak persists, trigger graceful process restart (rolling restart):
   ```bash
   docker-compose restart web
   ```

---

## Runbook 2: PostgreSQL Primary Failure & Failover

### Trigger
- Database connection refused (`ECONNREFUSED 5432`) or health probe failure.

### Diagnosis
1. Verify PostgreSQL container status:
   ```bash
   docker ps | grep postgres
   docker exec -it fintrack-postgres-dev pg_isready
   ```

### Remediation
1. In cloud environment, Patroni / PgBouncer automatically promotes Read Replica to Primary.
2. Update `DATABASE_URL` environment variable if floating virtual IP is not used.
3. Restart web container pool to re-establish connection pool:
   ```bash
   docker-compose restart web
   ```

---

## Runbook 3: Redis Cache Outage & Eviction Flush

### Trigger
- Redis ping failure or cache connection timeout.

### Diagnosis
1. Check Redis process: `redis-cli ping`.
2. Inspect memory fragmentation and key count.

### Remediation
1. Restart Redis cluster node:
   ```bash
   docker-compose restart redis
   ```
2. App gracefully falls back to direct PostgreSQL lookups if Redis is unavailable.

---

## Runbook 4: AI Provider Outage & Circuit Breaker Activation

### Trigger
- OpenAI API returning `502 Bad Gateway` or `429 Rate Limit Exceeded`.

### Remediation
1. Toggle AI Provider fallback flag in Admin settings (`FEATURE_AI_FALLBACK_AZURE=true`).
2. If all LLM providers fail, system activates fallback message: "AI Assistant is currently performing scheduled maintenance. Financial ledgers remain fully operational."

---

## Runbook 5: Stripe Webhook Delivery Failure

### Trigger
- Alert: "Stripe Webhook Signature Verification Failed" or 5xx response count > 5.

### Remediation
1. Verify Stripe Webhook Signing Secret in configuration: `npm run config:check`.
2. Re-send failed events from Stripe Dashboard -> Developers -> Webhooks -> Resend Failed Events.

---
