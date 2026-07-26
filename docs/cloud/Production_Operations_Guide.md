# Production Operations & Operations Guide — FinTrack Pro

## 1. Daily Health Audits
- Check system health endpoint: `/api/health`
- Monitor Sentry error dashboard for new runtime exceptions.
- Monitor Upstash Redis memory utilization and hit rates.

## 2. On-Call Incident Management
- P0 Outages: Immediate trigger to SRE War Room; verify database connection string and failover replica.
- P1 Degradation: Inspect API response latency via Sentry tracing.
