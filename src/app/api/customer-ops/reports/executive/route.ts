import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { BusinessReportingService } from '@/server/services/businessReportingService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'ANALYST', 'AUDITOR'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const user = await prisma.user.findUnique({ where: { id: authResult.user!.id }, select: { organizationId: true } });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const report = await BusinessReportingService.generateExecutiveReport(orgId);
    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_EXECUTIVE_BUSINESS_REPORT');
  }
}
