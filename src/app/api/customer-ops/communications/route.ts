import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { CommunicationAutomationService } from '@/server/services/communicationAutomationService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const campaigns = await CommunicationAutomationService.getCampaigns();
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_COMMUNICATION_CAMPAIGNS');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { campaignKey } = body;

    const user = await prisma.user.findUnique({ where: { id: authResult.user!.id }, select: { organizationId: true } });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const result = await CommunicationAutomationService.dispatchCampaign(campaignKey, orgId);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_COMMUNICATION_DISPATCH');
  }
}
