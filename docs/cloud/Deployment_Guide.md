# Production Cloud Deployment Guide — FinTrack Pro

This guide outlines step-by-step deployment for Vercel (Frontend), Render (Backend), and Railway (Managed MySQL / PostgreSQL).

## 1. Prerequisites
- Vercel Account
- Render Account
- Railway Account
- GitHub Repository Access

---

## 2. Deploying Frontend to Vercel
1. Import repository into Vercel Dashboard.
2. Select Framework: **Next.js**.
3. Environment Variables: Copy key-value pairs from `.env.example`.
4. Deploy using `vercel.json` production build settings.

---

## 3. Deploying Backend to Render
1. Create new Web Service on Render pointing to repository.
2. Build Command: `npm install && npx prisma generate && npm run build`
3. Start Command: `npm run start`
4. Health Check Path: `/api/health`

---

## 4. Deploying Managed Database on Railway
1. Create PostgreSQL / MySQL database instance on Railway.
2. Copy `DATABASE_URL` and `DIRECT_URL` to Vercel and Render environment variables.
3. Run `npx prisma db push` and `npm run db:seed`.
