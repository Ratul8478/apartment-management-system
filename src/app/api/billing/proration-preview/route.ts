import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { ProrationEngine } from '@/server/services/prorationEngine';
import { BillingCycle } from '@/types/billing';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const { searchParams } = new URL(req.url);
    const newPlanCode = searchParams.get('newPlanCode');
    const billingCycle = (searchParams.get('billingCycle') as BillingCycle) || 'MONTHLY';

    if (!newPlanCode) {
      return NextResponse.json({ success: false, error: 'newPlanCode query param is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const sub = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
      include: { plan: true },
    });

    if (!sub) throw new Error('Subscription not found');

    const newPlan = await prisma.subscriptionPlan.findUnique({
      where: { code: newPlanCode },
    });

    if (!newPlan) throw new Error(`Plan '${newPlanCode}' not found`);

    const currentPrice =
      sub.billingCycle === 'YEARLY' ? Number(sub.plan.priceYearly) : Number(sub.plan.priceMonthly);
    const newPrice = billingCycle === 'YEARLY' ? Number(newPlan.priceYearly) : Number(newPlan.priceMonthly);

    const proration = ProrationEngine.calculateProration({
      currentPlanCode: sub.plan.code,
      currentPlanPrice: currentPrice,
      newPlanCode: newPlan.code,
      newPlanPrice: newPrice,
      billingCycle,
      periodStart: sub.currentPeriodStart,
      periodEnd: sub.currentPeriodEnd,
      taxRatePercentage: 18.0,
    });

    return NextResponse.json({ success: true, data: proration });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_PRORATION_PREVIEW');
  }
}
