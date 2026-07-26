import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { CrmIntegrationService } from '@/server/services/crmIntegrationService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const user = await prisma.user.findUnique({ where: { id: authResult.user!.id }, select: { organizationId: true } });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const status = await CrmIntegrationService.getLatestSyncStatus(orgId);
    return NextResponse.json({ success: true, data: status });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_CRM_SYNC_STATUS');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { crmProvider } = body;

    const user = await prisma.user.findUnique({ where: { id: authResult.user!.id }, select: { organizationId: true } });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const result = await CrmIntegrationService.syncOrganizationWithCrm({
      organizationId: orgId,
      crmProvider,
    });

    return NextResponse.json({ success: true, message: 'CRM synchronized successfully', data: result });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_CRM_SYNC');
  }
}
