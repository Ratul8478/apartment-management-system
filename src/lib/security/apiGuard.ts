import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from './rateLimiter';
import crypto from 'crypto';

export interface GuardOptions {
  allowedRoles?: UserRole[];
  rateLimitKey?: string;
  maxRequests?: number;
  windowMs?: number;
}

export async function authorizeApiRequest(
  req: NextRequest,
  options: GuardOptions = {}
) {
  // 1. Rate Limiting Check (if rateLimitKey is provided)
  if (options.rateLimitKey) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimit = checkRateLimit(
      `${options.rateLimitKey}:${ip}`,
      options.maxRequests || 20,
      options.windowMs || 60000
    );

    if (!rateLimit.success) {
      return {
        isAuthorized: false,
        response: NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfterMs: rateLimit.resetMs,
          },
          { status: 429 }
        ),
      };
    }
  }

  // 2. Session Check
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: Session missing or expired' },
        { status: 401 }
      ),
    };
  }

  const userId = (session.user as any).id;

  // 3. Database Check (Verify user is still active and get latest role)
  // Prevents deactivated accounts or old tokens from lingering!
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (!dbUser || !dbUser.isActive) {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: 'Account is deactivated or invalid' },
        { status: 401 }
      ),
    };
  }

  const role = dbUser.role as UserRole;

  // 4. Role Authorization Check
  if (options.allowedRoles && options.allowedRoles.length > 0) {
    if (!options.allowedRoles.includes(role)) {
      return {
        isAuthorized: false,
        response: NextResponse.json(
          { error: "Forbidden: You don't have permission to perform this action" },
          { status: 403 }
        ),
      };
    }
  }

  return {
    isAuthorized: true,
    user: {
      id: dbUser.id,
      email: dbUser.email,
      role,
    },
  };
}

export function handleSanitizedApiError(error: any, actionName: string = 'API_REQUEST') {
  const errorRef = `ERR-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  console.error(`[${errorRef}] Error during ${actionName}:`, error);

  return NextResponse.json(
    {
      error: 'We encountered an issue processing your request. Please try again.',
      errorRef,
      timestamp: new Date().toISOString(),
    },
    { status: error.status || 500 }
  );
}
