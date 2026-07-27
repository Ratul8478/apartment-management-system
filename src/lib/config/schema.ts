import { z } from 'zod';

/**
 * FinTrack Pro — Centralized Enterprise Configuration Schema
 * 
 * Defines strict type validation, coercion rules, and default values across
 * all 12 logical configuration categories.
 */

export const environmentEnum = z.enum([
  'local',
  'development',
  'testing',
  'staging',
  'preview',
  'production',
]);

export type Environment = z.infer<typeof environmentEnum>;

export const configurationSchema = z.object({
  // ==========================================
  // 1. Application Core Configuration
  // ==========================================
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_ENV: environmentEnum.default('local'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  PORT: z.coerce.number().int().positive().default(3000),
  TZ: z.string().default('UTC'),
  APP_BASE_CURRENCY: z.string().length(3).default('INR'),

  // ==========================================
  // 2. Authentication & Session Security
  // ==========================================
  NEXTAUTH_SECRET: z.string().default('fintrack-pro-production-secret-jwt-key-2026-min32char'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  JWT_SECRET: z.string().default('fintrack-pro-development-jwt-signing-secret-key-32char'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  SESSION_MAX_AGE: z.coerce.number().int().positive().default(86400),

  // ==========================================
  // 3. Database Persistence Configuration
  // ==========================================
  DATABASE_URL: z.string().default('postgresql://fintrack_dev:fintrack_dev_pass@localhost:5432/fintrack_db?schema=public'),
  DIRECT_URL: z.string().optional(),
  DB_POOL_MIN: z.coerce.number().int().min(0).default(2),
  DB_POOL_MAX: z.coerce.number().int().min(1).default(10),
  DB_CONNECTION_TIMEOUT: z.coerce.number().int().positive().default(10000),

  // ==========================================
  // 4. Redis Cache & Memory Store
  // ==========================================
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_TLS_ENABLED: z.coerce.boolean().default(false),
  REDIS_CACHE_TTL: z.coerce.number().int().positive().default(3600),

  // ==========================================
  // 5. Email & Communication Configuration
  // ==========================================
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM_ADDRESS: z.string().email().default('noreply@fintrackpro.internal'),

  // ==========================================
  // 6. File & Object Storage Configuration
  // ==========================================
  STORAGE_PROVIDER: z.enum(['local', 's3', 'supabase']).default('local'),
  S3_BUCKET_NAME: z.string().optional(),
  S3_REGION: z.string().default('ap-south-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  // ==========================================
  // 7. Grounded AI Provider Configuration
  // ==========================================
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_MODEL_PRIMARY: z.string().default('claude-3-5-sonnet-20241022'),
  AI_MAX_TOKENS: z.coerce.number().int().positive().default(4096),
  AI_REQUEST_TIMEOUT: z.coerce.number().int().positive().default(30000),

  // ==========================================
  // 8. Logging & Observability Configuration
  // ==========================================
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),

  // ==========================================
  // 9. System Security & Encryption
  // ==========================================
  ENCRYPTION_MASTER_KEY: z.string().min(32, 'ENCRYPTION_MASTER_KEY must be a 32+ character hex string').optional(),
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  // ==========================================
  // 10. Background Worker Queue
  // ==========================================
  BULLMQ_WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  BULLMQ_JOB_MAX_RETRIES: z.coerce.number().int().min(0).default(3),
  BULLMQ_BACKOFF_DELAY: z.coerce.number().int().positive().default(5000),

  // ==========================================
  // 11. Enterprise Feature Flags
  // ==========================================
  ENABLE_OCR_INGESTION: z.coerce.boolean().default(true),
  ENABLE_AI_FORECASTING: z.coerce.boolean().default(true),
  MAINTENANCE_MODE_ENABLED: z.coerce.boolean().default(false),

  // ==========================================
  // 12. Monitoring & Health Diagnostics
  // ==========================================
  HEALTH_CHECK_SECRET: z.string().optional(),
  METRICS_ENABLED: z.coerce.boolean().default(true),
  ALERT_WEBHOOK_URL: z.string().url().optional(),

  // ==========================================
  // 13. Production Cloud SaaS Integrations
  // ==========================================
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  DEFAULT_AI_PROVIDER: z.string().default('gemini'),
  GEMINI_API_KEY: z.string().optional(),
  PRIMARY_PAYMENT_GATEWAY: z.string().default('razorpay'),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().optional(),

  // ==========================================
  // 14. Firebase Realtime Database Configuration
  // ==========================================
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),

  // ==========================================
  // 15. Supabase Backend & Cloud Storage
  // ==========================================
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // ==========================================
  // 16. Vector Database (Qdrant Cloud / pgvector)
  // ==========================================
  QDRANT_URL: z.string().optional(),
  QDRANT_API_KEY: z.string().optional(),

  // ==========================================
  // 17. Graph Database (Neo4j AuraDB Free)
  // ==========================================
  NEO4J_URI: z.string().optional(),
  NEO4J_USERNAME: z.string().optional(),
  NEO4J_PASSWORD: z.string().optional(),
});

export type AppConfiguration = z.infer<typeof configurationSchema>;
