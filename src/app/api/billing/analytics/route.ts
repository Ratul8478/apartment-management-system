import { NextRequest, NextResponse } from 'next/server';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { RevenueAnalyticsService } from '@/server/services/revenueAnalyticsService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'ANALYST', 'AUDITOR'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const analytics = await RevenueAnalyticsService.getRevenueSummary();

    return NextResponse.json({ success: true, data: analytics });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_REVENUE_ANALYTICS');
  }
}
