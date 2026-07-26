import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { ProductAnalyticsService } from '@/server/services/productAnalyticsService';

export const dynamic = 'force-dynamic';

async function getOrgId(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { organizationId: true } });
  if (user?.organizationId) return user.organizationId;
  const defaultOrg = await prisma.organization.findFirst();
  if (defaultOrg) return defaultOrg.id;
  throw new Error('No organization found');
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const orgId = await getOrgId(authResult.user!.id);
    const summary = await ProductAnalyticsService.getAnalyticsSummary(orgId);

    return NextResponse.json({ success: true, data: summary });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_PRODUCT_ANALYTICS');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { eventType, featureKey, metadata } = body;

    const orgId = await getOrgId(authResult.user!.id);

    await ProductAnalyticsService.logEvent({
      organizationId: orgId,
      userId: authResult.user!.id,
      eventType: eventType || 'FEATURE_CLICK',
      featureKey: featureKey || 'UNKNOWN_FEATURE',
      metadata,
    });

    return NextResponse.json({ success: true, message: 'Analytics event logged' });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_PRODUCT_ANALYTICS');
  }
}
