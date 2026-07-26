# Database Migration & Schema Management Guide — FinTrack Pro

## Executing Production Migrations
```bash
npx prisma db push
npm run db:seed
```

## Connection Pooling Governance
Prisma Client configures dynamic pool sizing automatically. Set `?connection_limit=20&pool_timeout=30` on `DATABASE_URL`.
