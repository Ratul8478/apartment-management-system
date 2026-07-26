import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { PaymentGatewayProvider } from '@/types/billing';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    let methods = await prisma.paymentMethodRecord.findMany({
      where: { organizationId: orgId },
      orderBy: { isDefault: 'desc' },
    });

    if (methods.length === 0) {
      // Create default primary card record for testing
      const defaultCard = await prisma.paymentMethodRecord.create({
        data: {
          organizationId: orgId,
          gateway: PaymentGatewayProvider.STRIPE,
          gatewayPaymentMethodId: 'pm_card_visa_default_2026',
          type: 'CARD',
          brand: 'Visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2028,
          isDefault: true,
        },
      });
      methods = [defaultCard];
    }

    return NextResponse.json({ success: true, data: methods });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_PAYMENT_METHODS');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { type, brand, last4, expMonth, expYear, gateway = 'STRIPE' } = body;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    // Reset current defaults
    await prisma.paymentMethodRecord.updateMany({
      where: { organizationId: orgId },
      data: { isDefault: false },
    });

    const newMethod = await prisma.paymentMethodRecord.create({
      data: {
        organizationId: orgId,
        gateway,
        gatewayPaymentMethodId: `pm_${Math.random().toString(36).substring(2, 10)}`,
        type: type || 'CARD',
        brand: brand || 'Mastercard',
        last4: last4 || '8888',
        expMonth: expMonth || 11,
        expYear: expYear || 2029,
        isDefault: true,
      },
    });

    return NextResponse.json({ success: true, message: 'Payment method saved', data: newMethod });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_PAYMENT_METHOD');
  }
}
