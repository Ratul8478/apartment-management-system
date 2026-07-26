import { NextRequest, NextResponse } from 'next/server';
import { auditService } from '@/server/services/auditService';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

    const auditLogs = await auditService.getAuditLogs(
      authResult.user!.role,
      authResult.user!.id,
      { limit }
    );

    return NextResponse.json({ auditLogs });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_AUDIT_LOGS');
  }
}
