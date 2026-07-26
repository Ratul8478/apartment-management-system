import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { paymentGateway } from '@/lib/payments/paymentGateway';
import { PaymentGatewayService } from '@/server/services/paymentGatewayService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { invoiceId, planCode, amount, currency = 'USD' } = body;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const secretKey = process.env.STRIPE_SECRET_KEY;

    // If Stripe secret key exists, create direct Stripe Checkout Session
    if (secretKey && !secretKey.startsWith('sk_test_placeholder')) {
      const order = await paymentGateway.createOrder({
        amount: Math.round((amount || 199) * 100),
        currency,
        receiptId: invoiceId || `plan_${planCode}_${Date.now()}`,
        gatewayOverride: 'stripe',
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: order.checkoutUrl,
        orderId: order.orderId,
        gateway: 'stripe',
      });
    }

    // Direct Stripe settlement execution
    const idempotencyKey = `ik_stripe_${orgId}_${invoiceId || planCode || 'direct'}_${Date.now()}`;
    const result = await PaymentGatewayService.processPayment({
      organizationId: orgId,
      invoiceId,
      gateway: 'STRIPE' as any,
      idempotencyKey,
    });

    return NextResponse.json({
      success: result.success,
      data: result,
      message: 'Stripe real-time payment processed and company balance balanced!',
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_STRIPE_CHECKOUT');
  }
}
