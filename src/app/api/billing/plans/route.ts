import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/server/services/subscriptionService';

export async function GET() {
  try {
    const plans = await SubscriptionService.getPlans();
    return NextResponse.json({ success: true, data: plans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch commercial plans' },
      { status: 500 }
    );
  }
}
