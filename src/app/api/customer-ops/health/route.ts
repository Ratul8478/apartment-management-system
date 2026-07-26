import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { CustomerHealthService } from '@/server/services/customerHealthService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const user = await prisma.user.findUnique({ where: { id: authResult.user!.id }, select: { organizationId: true } });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const health = await CustomerHealthService.calculateHealthScore(orgId);
    return NextResponse.json({ success: true, data: health });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_CUSTOMER_HEALTH');
  }
}
