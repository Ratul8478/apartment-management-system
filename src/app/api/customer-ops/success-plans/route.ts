import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { CustomerSuccessService } from '@/server/services/customerSuccessService';

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
    const plans = await CustomerSuccessService.getSuccessPlans(orgId);

    return NextResponse.json({ success: true, data: plans });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_SUCCESS_PLANS');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { title, targetDate, objectives } = body;

    const orgId = await getOrgId(authResult.user!.id);

    const plan = await CustomerSuccessService.createSuccessPlan({
      organizationId: orgId,
      title: title || 'Q3 Success Plan',
      targetDate: targetDate ? new Date(targetDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      objectives: objectives || [{ title: 'Achieve 100% Onboarding' }],
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_SUCCESS_PLANS');
  }
}
