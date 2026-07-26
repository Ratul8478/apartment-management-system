import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { UsageMeterService } from '@/server/services/usageMeterService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const summary = await UsageMeterService.getUsageSummary(orgId);
    return NextResponse.json({ success: true, data: summary });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_BILLING_USAGE');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { metricKey, quantity, metadata } = body;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    await UsageMeterService.recordUsage({
      organizationId: orgId,
      metricKey,
      quantity,
      metadata,
    });

    return NextResponse.json({ success: true, message: 'Usage metric recorded' });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_BILLING_USAGE');
  }
}
