import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { paymentGateway } from '@/lib/payments/paymentGateway';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { invoiceId, planCode, amount, currency = 'INR' } = body;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    let chargeAmount = amount || 199;
    if (invoiceId) {
      const invoice = await prisma.billingInvoice.findUnique({
        where: { id: invoiceId },
      });
      if (invoice) {
        chargeAmount = Number(invoice.amountRemaining);
      }
    }

    // Amount in subunits (paise / cents)
    const amountInSubunits = Math.round(chargeAmount * 100);

    const order = await paymentGateway.createOrder({
      amount: amountInSubunits,
      currency,
      receiptId: invoiceId || `plan_${planCode || 'upgrade'}_${Date.now()}`,
      notes: {
        organizationId: orgId,
        invoiceId: invoiceId || '',
        planCode: planCode || '',
      },
      gatewayOverride: 'razorpay',
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_fintrack_pro',
      gateway: 'razorpay',
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_RAZORPAY_CREATE_ORDER');
  }
}
