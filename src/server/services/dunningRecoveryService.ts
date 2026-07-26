import { prisma } from '@/lib/prisma';
import { SubscriptionStatus } from '@/types/billing';

export class DunningRecoveryService {
  /**
   * Triggers payment recovery workflow when an automated renewal charge fails.
   */
  public static async handlePaymentFailure(params: {
    organizationId: string;
    subscriptionId: string;
    invoiceId: string;
    errorMessage: string;
  }): Promise<{ status: string; nextAttemptAt: Date | null }> {
    const { organizationId, subscriptionId, invoiceId, errorMessage } = params;

    // Count existing dunning attempts for this invoice
    const existingLogs = await prisma.dunningLog.findMany({
      where: { invoiceId },
      orderBy: { attemptNumber: 'desc' },
    });

    const currentAttempt = existingLogs.length + 1;
    let nextAttemptAt: Date | null = null;
    let newSubscriptionStatus: SubscriptionStatus = SubscriptionStatus.PAST_DUE;

    if (currentAttempt === 1) {
      // Retry in 1 day
      nextAttemptAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (currentAttempt === 2) {
      // Retry in 3 days
      nextAttemptAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    } else if (currentAttempt === 3) {
      // Retry in 7 days (Final grace period attempt)
      nextAttemptAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else {
      // Max retries exceeded -> Mark subscription UNPAID / SUSPENDED
      nextAttemptAt = null;
      newSubscriptionStatus = SubscriptionStatus.UNPAID;
    }

    // Record Dunning Log
    await prisma.dunningLog.create({
      data: {
        organizationId,
        subscriptionId,
        invoiceId,
        attemptNumber: currentAttempt,
        nextAttemptAt,
        status: nextAttemptAt ? 'PENDING_RETRY' : 'MAX_RETRIES_EXCEEDED',
        errorMessage,
      },
    });

    // Update Subscription status
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: newSubscriptionStatus },
    });

    // Notify organization users
    const users = await prisma.user.findMany({
      where: { organizationId, isActive: true },
    });

    for (const u of users) {
      await prisma.notification.create({
        data: {
          userId: u.id,
          type: 'SYSTEM_ALERT',
          severity: 'CRITICAL',
          title: 'Subscription Payment Action Required',
          message: `Your automated renewal payment failed (Attempt ${currentAttempt}). ${
            nextAttemptAt
              ? `Next retry scheduled for ${nextAttemptAt.toLocaleDateString()}. Please update your payment method.`
              : 'Subscription suspended due to repeated payment failures. Update payment details to restore service.'
          }`,
        },
      });
    }

    return {
      status: newSubscriptionStatus,
      nextAttemptAt,
    };
  }

  /**
   * Restores subscription service immediately when payment is recovered.
   */
  public static async restoreServiceOnPayment(subscriptionId: string): Promise<void> {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.ACTIVE,
      },
    });

    const sub = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (sub) {
      // Resolve any pending dunning logs
      await prisma.dunningLog.updateMany({
        where: { subscriptionId, status: 'PENDING_RETRY' },
        data: { status: 'RESTORED' },
      });

      const users = await prisma.user.findMany({
        where: { organizationId: sub.organizationId, isActive: true },
      });

      for (const u of users) {
        await prisma.notification.create({
          data: {
            userId: u.id,
            type: 'SYSTEM_ALERT',
            severity: 'INFO',
            title: 'Payment Received — Service Restored',
            message: 'Your subscription has been successfully renewed and all enterprise capabilities are restored.',
          },
        });
      }
    }
  }
}
