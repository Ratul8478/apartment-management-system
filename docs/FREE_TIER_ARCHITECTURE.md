# FinTrack Pro — Free-Tier Cloud Architecture & Deployment Handbook

This document provides a complete, production-ready specification of the **FinTrack Pro / Apartment Management System** cloud architecture designed to run on 100% free-tier services without compromising performance, security, or enterprise capabilities.

---

## 1. Cloud Architecture Blueprint

```
+-----------------------------------------------------------------------------------+
|                              FREE DOMAIN & SSL LAYER                              |
|           Vercel Subdomain (*.vercel.app) / Render (*.onrender.com)               |
|                 or Free Custom DNS (DuckDNS / Cloudflare DNS)                     |
+-----------------------------------------┬-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                 FRONTEND LAYER                                    |
|                                Vercel Hobby Tier                                  |
|  - Edge CDN Asset Caching                                                         |
|  - Security Headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)          |
|  - Automatic Let's Encrypt Wildcard SSL                                           |
+-----------------------------------------┬-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                  BACKEND LAYER                                    |
|                    Render Web Service / Vercel Serverless                         |
|  - Next.js 14 App Router API Engine                                               |
|  - Zod Fail-Fast Environment Validation                                           |
|  - Uptime & Health Probes (/api/health & /api/system/free-tier)                   |
+-----------------------------------------┬-----------------------------------------+
                                          |
         +--------------------------------+--------------------------------+
         |                                |                                |
         v                                v                                v
+-------------------+           +-------------------+            +-------------------+
|     DATABASE      |           |  AUTH & SECURITY  |            | CACHE & LIMITING  |
|   Supabase Free   |           |    NextAuth.js    |            |   Upstash Redis   |
| - PostgreSQL 16   |           | - JWT Cookie Enc  |            | - Rate Limiting   |
| - Prisma ORM      |           | - TOTP 2FA        |            | - Session Store   |
| - 500MB Free DB   |           | - Role RBAC       |            | - 10k req/day     |
| - Local PGlite    |           | - Org Isolation   |            | - In-Memory Fall  |
+-------------------+           +-------------------+            +-------------------+
         |                                |                                |
         v                                v                                v
+-------------------+           +-------------------+            +-------------------+
|  COMMUNICATIONS   |           |   MEDIA STORAGE   |            |  AI INTELLIGENCE  |
|    Resend Email   |           |    Cloudinary     |            |  Google Gemini    |
| - Transactional   |           | - 25GB Storage    |            | - 1.5 Flash Model |
| - 3,000 emails/mo |           | - Image CDN       |            | - 15 req/min Free |
+-------------------+           +-------------------+            +-------------------+
```

---

## 2. Comprehensive Service Connection Specifications

### 1. Frontend: Vercel Hobby Tier (Free)
- **Cost**: $0.00 / month
- **Specs**: 100 GB Bandwidth/mo, Unlimited Serverless Execution, Free Wildcard SSL.
- **Custom Domain**: `fintrack-pro.vercel.app`
- **Security Headers**: Pre-configured in `vercel.json` with HSTS, X-Content-Type-Options, X-Frame-Options, CSP, and strict Permissions Policy.

### 2. Backend: Render Free Web Service / Vercel Serverless
- **Cost**: $0.00 / month
- **Specs**: 750 Compute Hours/mo, Automatic SSL, Docker container build support (`Dockerfile` & `render.yaml`).
- **Health Monitoring**: Probe connected to `/api/health`.

### 3. Database: Supabase PostgreSQL 16
- **Cost**: $0.00 / month
- **Specs**: 500MB Dedicated PostgreSQL 16, Direct URL for Prisma migrations (`DIRECT_URL`), Connection Pooling URL (`DATABASE_URL`).
- **Offline / Local Fallback**: Integrated embedded PGlite server runner (`scripts/start-pglite-server.ts`) for zero-cost offline development and automated CI runs.

### 4. Auth & Security Management: NextAuth.js + JWT
- **Cost**: $0.00 / month (Self-Hosted)
- **Specs**: Encrypted JWT session cookies, TOTP 2FA (`src/lib/security/mfa.ts`), Password Policy validation, Multi-Tenant Organization Isolation (`tenantId`).

### 5. Cache & Rate Limiting: Upstash Serverless Redis
- **Cost**: $0.00 / month
- **Specs**: 10,000 free requests/day via REST API.
- **Fallback**: Gracefully switches to in-memory sliding window rate-limiter if `UPSTASH_REDIS_REST_URL` is omitted.

### 6. Email Communications: Resend
- **Cost**: $0.00 / month
- **Specs**: 3,000 transactional emails/month (100 emails/day).
- **Usage**: Password reset tokens, security alerts, and system notices.

### 7. Media & Storage: Cloudinary
- **Cost**: $0.00 / month
- **Specs**: 25 GB free storage, 25,000 monthly transformations, global image CDN.

### 8. AI Intelligence: Google Gemini AI
- **Cost**: $0.00 / month
- **Specs**: Gemini 1.5 Flash model with 15 RPM (requests per minute) free tier.
- **Usage**: Automated financial anomaly detection, audit insights, and AI chat assistant.

---

## 3. Environment Variable Checklist

```bash
# Core Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://fintrack-pro.vercel.app"

# Database Connections (Supabase Free)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbooster=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# NextAuth & JWT Security
NEXTAUTH_URL="https://fintrack-pro.vercel.app"
NEXTAUTH_SECRET="your-secure-nextauth-secret-32-chars"
JWT_SECRET="your-secure-jwt-secret-32-chars"

# Upstash Redis Cache
UPSTASH_REDIS_REST_URL="https://[INSTANCE].upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Resend Email
RESEND_API_KEY="re_123456789"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="fintrack-cloud"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

# Google Gemini AI
GEMINI_API_KEY="AIzaSy..."
```

---

## 4. Verification & Audit Commands

Run the following commands locally or in CI/CD pipeline:

```bash
# 1. Audit Environment Variables
npm run config:audit

# 2. Verify Database Connection (Supabase / PGlite)
npm run db:platform-check

# 3. Production Build Validation
npm run build

# 4. Start Local Development Server
npm run dev
```
