import { NextRequest, NextResponse } from 'next/server';
import { PaymentGatewayService } from '@/server/services/paymentGatewayService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { gateway: string } }) {
  try {
    const signature = req.headers.get('stripe-signature') || req.headers.get('x-razorpay-signature') || undefined;
    const body = await req.json();

    const result = await PaymentGatewayService.processWebhook(params.gateway, body, signature);

    return NextResponse.json({ received: true, eventType: result.eventType });
  } catch (error: any) {
    console.error(`Webhook processing error for ${params.gateway}:`, error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
