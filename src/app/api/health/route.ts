import { NextRequest, NextResponse } from 'next/server';
import { dbHealth } from '@/lib/db';
import { upstashRedis } from '@/lib/cache/upstashRedis';

export const dynamic = 'force-dynamic';

/**
 * FinTrack Pro — Production System Health & Observability Endpoint
 * 
 * Inspects DB connection status, Redis availability, environment configuration,
 * and system uptime for Render, Vercel, and Kubernetes health probes.
 */
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  // 1. Check Database Health
  const dbStatus = await dbHealth.checkReadiness().catch(() => ({
    status: 'DOWN' as const,
    pingMs: null,
    details: { isConnected: false, environment: process.env.NODE_ENV || 'production' },
  }));

  // 2. Check Redis Health
  const redisPing = await upstashRedis.get('health_probe_ping').catch(() => null);
  const redisHealthy = redisPing !== null || !process.env.UPSTASH_REDIS_REST_URL;

  // 3. Overall System Health Synthesis
  const isHealthy = dbStatus.status !== 'DOWN' || process.env.NODE_ENV === 'development';
  const statusCode = isHealthy ? 200 : 530;

  return NextResponse.json(
    {
      status: isHealthy ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      executionMs: Date.now() - startTime,
      environment: process.env.NODE_ENV || 'production',
      services: {
        database: {
          status: dbStatus.status,
          pingMs: dbStatus.pingMs,
        },
        redisCache: {
          status: redisHealthy ? 'UP' : 'DEGRADED',
          mode: process.env.UPSTASH_REDIS_REST_URL ? 'UPSTASH_REMOTE' : 'IN_MEMORY_DEGRADED',
        },
        aiOrchestrator: {
          defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'gemini',
          geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
          openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
          claudeConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
        },
        paymentGateway: {
          primary: process.env.PRIMARY_PAYMENT_GATEWAY || 'razorpay',
          razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
          stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
        },
        emailService: {
          provider: 'resend',
          configured: Boolean(process.env.RESEND_API_KEY),
        },
        storage: {
          provider: 'cloudinary',
          configured: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
        },
      },
    },
    { status: statusCode }
  );
}
