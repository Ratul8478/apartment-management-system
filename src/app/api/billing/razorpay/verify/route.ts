import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { paymentGateway } from '@/lib/payments/paymentGateway';
import { PaymentGatewayService } from '@/server/services/paymentGatewayService';
import { PaymentGatewayProvider } from '@/types/billing';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });
    if (!authResult.isAuthorized) return authResult.response!;

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId, planCode } = body;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    // Signature verification
    const isSignatureValid = paymentGateway.verifyRazorpayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid Razorpay payment signature' },
        { status: 400 }
      );
    }

    // Settle payment in system database & ledger
    const idempotencyKey = `ik_rzp_${razorpay_order_id}_${razorpay_payment_id}`;
    const result = await PaymentGatewayService.processPayment({
      organizationId: orgId,
      invoiceId,
      gateway: PaymentGatewayProvider.RAZORPAY,
      idempotencyKey,
    });

    // Save/Update Payment Method Record for Org
    try {
      await prisma.paymentMethodRecord.create({
        data: {
          organizationId: orgId,
          gateway: PaymentGatewayProvider.RAZORPAY,
          gatewayPaymentMethodId: razorpay_payment_id,
          type: 'RAZORPAY_UPI_CARD',
          brand: 'Razorpay',
          last4: razorpay_payment_id.slice(-4),
          isDefault: true,
        },
      });
    } catch {
      // Ignore if payment method record duplicate
    }

    return NextResponse.json({
      success: result.success,
      data: result,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: 'Razorpay payment verified and inter-company balance settled!',
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'POST_RAZORPAY_VERIFY');
  }
}
