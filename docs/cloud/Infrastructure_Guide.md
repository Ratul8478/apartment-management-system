# Cloud Infrastructure Architecture Guide — FinTrack Pro

```
+------------------+      +-------------------+      +------------------+
| Vercel Edge CDN  | ---> | Render API Server | ---> | Railway Postgres |
| (Next.js Front)  |      | (Node / Express)  |      | Database Server  |
+------------------+      +-------------------+      +------------------+
          |                         |                          |
          v                         v                          v
+------------------+      +-------------------+      +------------------+
| Cloudinary CDN   |      | Upstash Redis     |      | Resend Email     |
| Asset Storage    |      | Distributed Cache |      | Transactional API|
+------------------+      +-------------------+      +------------------+
```
