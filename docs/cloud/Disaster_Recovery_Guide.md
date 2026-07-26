# Disaster Recovery & Continuity Guide — FinTrack Pro

- **RTO Target**: < 15 Minutes
- **RPO Target**: < 1 Minute
- **Automated Backup Strategy**: Managed PostgreSQL point-in-time recovery (PITR) enabled on Railway / Supabase.
- **Failover Verification**: Execute `node scripts/verify-production.js`.
