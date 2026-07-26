import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { SubscriptionService } from '@/server/services/subscriptionService';

export const dynamic = 'force-dynamic';

async function getOrgId(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true },
  });
  if (user?.organizationId) return user.organizationId;
  const defaultOrg = await prisma.organization.findFirst();
  if (defaultOrg) return defaultOrg.id;
  throw new Error('No organization record found');
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const orgId = await getOrgId(authResult.user!.id);
    const subscription = await SubscriptionService.getSubscription(orgId);

    return NextResponse.json({ success: true, data: subscription });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_BILLING_SUBSCRIPTION');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { action, planCode, billingCycle, immediately } = body;
    const orgId = await getOrgId(authResult.user!.id);

    if (action === 'CANCEL') {
      const sub = await SubscriptionService.cancelSubscription(orgId, !!immediately);
      return NextResponse.json({ success: true, message: 'Subscription canceled', data: sub });
    }

    if (action === 'REACTIVATE') {
      const sub = await SubscriptionService.reactivateSubscription(orgId);
      return NextResponse.json({ success: true, message: 'Subscription reactivated', data: sub });
    }

    if (action === 'CHANGE_PLAN' || planCode) {
      if (!planCode) {
        return NextResponse.json({ success: false, error: 'planCode is required' }, { status: 400 });
      }

      const result = await SubscriptionService.changePlan({
        organizationId: orgId,
        newPlanCode: planCode,
        billingCycle: billingCycle || 'MONTHLY',
        actorUserId: authResult.user!.id,
      });

      return NextResponse.json({
        success: true,
        message: `Plan changed successfully to ${planCode}`,
        data: result.subscription,
        prorationInvoice: result.prorationInvoice,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_BILLING_SUBSCRIPTION');
  }
}
