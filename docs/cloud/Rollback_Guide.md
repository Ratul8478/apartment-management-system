# Automated Emergency Rollback Guide — FinTrack Pro

## 1. Vercel Rollback
```bash
vercel rollback
```

## 2. Render Rollback
Use Render Dashboard -> Releases -> Select previous healthy commit -> Re-deploy.

## 3. Database Reversion
```bash
node scripts/rollback.js
```
