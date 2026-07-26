# Environment Variable & Configuration Guide — FinTrack Pro

All production environment secrets are injected strictly via environment variables. Zero credentials are hardcoded.

## Key Service Configurations

| Service Category | Variable Keys | Provider |
| :--- | :--- | :--- |
| **Database** | `DATABASE_URL`, `DIRECT_URL` | Railway / Supabase / Neon |
| **Authentication** | `NEXTAUTH_SECRET`, `CLERK_SECRET_KEY` | NextAuth / Clerk |
| **Caching & Limits** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis |
| **AI Providers** | `DEFAULT_AI_PROVIDER`, `GEMINI_API_KEY`, `OPENAI_API_KEY` | Google Gemini / OpenAI |
| **Payments** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY` | Razorpay / Stripe |
| **Cloud Storage** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary |
| **Email** | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Resend |
| **Observability** | `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Sentry / GA4 / Clarity |
