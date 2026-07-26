import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { OnboardingService } from '@/server/services/onboardingService';

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
    const progress = await OnboardingService.getOnboardingProgress(orgId);

    return NextResponse.json({ success: true, data: progress });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_ONBOARDING_PROGRESS');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { stepKey } = body;

    if (!stepKey) {
      return NextResponse.json({ success: false, error: 'stepKey is required' }, { status: 400 });
    }

    const orgId = await getOrgId(authResult.user!.id);
    await OnboardingService.markStepComplete(orgId, stepKey);

    return NextResponse.json({ success: true, message: `Onboarding step '${stepKey}' marked complete` });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_ONBOARDING_PROGRESS');
  }
}
