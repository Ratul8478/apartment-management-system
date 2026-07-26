import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { PaymentGatewayService } from '@/server/services/paymentGatewayService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { invoiceId, gateway, idempotencyKey } = body;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const keyToUse = idempotencyKey || `ik_${orgId}_${invoiceId || 'direct'}_${Date.now()}`;

    const result = await PaymentGatewayService.processPayment({
      organizationId: orgId,
      invoiceId,
      gateway,
      idempotencyKey: keyToUse,
    });

    return NextResponse.json({ success: result.success, data: result });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_PAYMENTS_PROCESS');
  }
}
