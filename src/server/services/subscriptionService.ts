import { prisma } from '@/lib/prisma';
import {
  SubscriptionDTO,
  PlanDTO,
  SubscriptionStatus,
  BillingCycle,
  BillingReason,
} from '@/types/billing';
import { ProrationEngine } from './prorationEngine';
import { InvoiceService } from './invoiceService';
import { BillingAuditService } from './billingAuditService';

export class SubscriptionService {
  /**
   * Fetches all active commercial subscription plans.
   */
  public static async getPlans(): Promise<PlanDTO[]> {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' },
    });

    return plans.map((p) => this.mapPlanToDTO(p));
  }

  /**
   * Gets the active subscription and current plan details for an organization.
   */
  public static async getSubscription(organizationId: string): Promise<SubscriptionDTO | null> {
    let subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    // If no subscription exists yet, auto-initialize Starter/Pro trial
    if (!subscription) {
      const defaultPlan = await prisma.subscriptionPlan.findFirst({
        where: { code: 'PROFESSIONAL' },
      });
      if (!defaultPlan) return null;

      const now = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(now.getDate() + 14);

      subscription = await prisma.subscription.create({
        data: {
          organizationId,
          planId: defaultPlan.id,
          status: SubscriptionStatus.TRIALING,
          billingCycle: BillingCycle.MONTHLY,
          currentPeriodStart: now,
          currentPeriodEnd: trialEnd,
          trialStart: now,
          trialEnd: trialEnd,
        },
        include: { plan: true },
      });

      await BillingAuditService.logCommercialEvent({
        organizationId,
        action: 'SUBSCRIPTION_STARTED',
        targetId: subscription.id,
        newValues: { planCode: defaultPlan.code, status: 'TRIALING' },
      });
    }

    return this.mapSubscriptionToDTO(subscription);
  }

  /**
   * Upgrades or downgrades an organization's subscription plan with financial proration and invoice generation.
   */
  public static async changePlan(params: {
    organizationId: string;
    newPlanCode: string;
    billingCycle?: BillingCycle;
    actorUserId?: string;
  }): Promise<{ subscription: SubscriptionDTO; prorationInvoice?: any }> {
    const { organizationId, newPlanCode, billingCycle = BillingCycle.MONTHLY, actorUserId } = params;

    const currentSub = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    if (!currentSub) {
      throw new Error(`Subscription not found for organization ${organizationId}`);
    }

    const newPlan = await prisma.subscriptionPlan.findUnique({
      where: { code: newPlanCode },
    });

    if (!newPlan) {
      throw new Error(`Target subscription plan '${newPlanCode}' does not exist`);
    }

    const currentPrice =
      currentSub.billingCycle === BillingCycle.YEARLY
        ? Number(currentSub.plan.priceYearly)
        : Number(currentSub.plan.priceMonthly);

    const newPrice =
      billingCycle === BillingCycle.YEARLY ? Number(newPlan.priceYearly) : Number(newPlan.priceMonthly);

    // Calculate Proration
    const proration = ProrationEngine.calculateProration({
      currentPlanCode: currentSub.plan.code,
      currentPlanPrice: currentPrice,
      newPlanCode: newPlan.code,
      newPlanPrice: newPrice,
      billingCycle,
      periodStart: currentSub.currentPeriodStart,
      periodEnd: currentSub.currentPeriodEnd,
    });

    const isUpgrade = newPrice > currentPrice;
    const actionType = isUpgrade ? 'PLAN_UPGRADED' : 'PLAN_DOWNGRADED';

    const now = new Date();
    const newPeriodEnd = new Date();
    if (billingCycle === BillingCycle.YEARLY) {
      newPeriodEnd.setFullYear(now.getFullYear() + 1);
    } else {
      newPeriodEnd.setMonth(now.getMonth() + 1);
    }

    let invoice = null;
    if (proration.netPayableAmount > 0) {
      invoice = await InvoiceService.createInvoice({
        organizationId,
        subscriptionId: currentSub.id,
        billingReason: BillingReason.PLAN_CHANGE,
        periodStart: now,
        periodEnd: newPeriodEnd,
        lineItems: [
          {
            description: `Plan Switch to ${newPlan.name} (${billingCycle})`,
            quantity: 1,
            unitPrice: proration.newPlanProratedCharge,
            proration: true,
          },
          {
            description: `Credit from unused ${currentSub.plan.name} balance`,
            quantity: 1,
            unitPrice: -proration.unusedCurrentPlanCredit,
            proration: true,
          },
        ],
      });
    }

    // Update Subscription Record
    const updatedSub = await prisma.subscription.update({
      where: { id: currentSub.id },
      data: {
        planId: newPlan.id,
        status: SubscriptionStatus.ACTIVE,
        billingCycle,
        currentPeriodStart: now,
        currentPeriodEnd: newPeriodEnd,
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
      include: { plan: true },
    });

    // Record Subscription State History
    await prisma.subscriptionHistory.create({
      data: {
        subscriptionId: currentSub.id,
        organizationId,
        action: actionType,
        previousPlanId: currentSub.planId,
        newPlanId: newPlan.id,
        amountPaid: proration.netPayableAmount > 0 ? proration.netPayableAmount : 0,
        proratedAmount: proration.grossAmountDue,
        metadata: JSON.stringify(proration),
      },
    });

    // Audit Log
    await BillingAuditService.logCommercialEvent({
      organizationId,
      actorUserId,
      action: actionType,
      targetId: currentSub.id,
      oldValues: { planCode: currentSub.plan.code, billingCycle: currentSub.billingCycle },
      newValues: { planCode: newPlan.code, billingCycle },
    });

    return {
      subscription: this.mapSubscriptionToDTO(updatedSub),
      prorationInvoice: invoice,
    };
  }

  /**
   * Cancels subscription at period end or immediately.
   */
  public static async cancelSubscription(organizationId: string, immediately: boolean = false): Promise<SubscriptionDTO> {
    const sub = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    if (!sub) throw new Error('Subscription not found');

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: !immediately,
        status: immediately ? SubscriptionStatus.CANCELED : sub.status,
        canceledAt: new Date(),
        endedAt: immediately ? new Date() : null,
      },
      include: { plan: true },
    });

    await BillingAuditService.logCommercialEvent({
      organizationId,
      action: 'SUBSCRIPTION_CANCELED',
      targetId: sub.id,
      newValues: { immediately, cancelAtPeriodEnd: !immediately },
    });

    return this.mapSubscriptionToDTO(updated);
  }

  /**
   * Reactivates a canceled subscription.
   */
  public static async reactivateSubscription(organizationId: string): Promise<SubscriptionDTO> {
    const sub = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    if (!sub) throw new Error('Subscription not found');

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: false,
        status: SubscriptionStatus.ACTIVE,
        canceledAt: null,
      },
      include: { plan: true },
    });

    await BillingAuditService.logCommercialEvent({
      organizationId,
      action: 'SUBSCRIPTION_REACTIVATED',
      targetId: sub.id,
    });

    return this.mapSubscriptionToDTO(updated);
  }

  private static mapPlanToDTO(p: any): PlanDTO {
    return {
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description,
      priceMonthly: Number(p.priceMonthly),
      priceYearly: Number(p.priceYearly),
      currency: p.currency,
      trialPeriodDays: p.trialPeriodDays,
      features: (p.features as any) || {},
      isActive: p.isActive,
      isCustom: p.isCustom,
    };
  }

  private static mapSubscriptionToDTO(sub: any): SubscriptionDTO {
    return {
      id: sub.id,
      organizationId: sub.organizationId,
      planId: sub.planId,
      plan: this.mapPlanToDTO(sub.plan),
      status: sub.status as SubscriptionStatus,
      billingCycle: sub.billingCycle as BillingCycle,
      currentPeriodStart: sub.currentPeriodStart.toISOString(),
      currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
      trialStart: sub.trialStart ? sub.trialStart.toISOString() : null,
      trialEnd: sub.trialEnd ? sub.trialEnd.toISOString() : null,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      canceledAt: sub.canceledAt ? sub.canceledAt.toISOString() : null,
      paymentGateway: sub.paymentGateway,
      prorationCredits: Number(sub.prorationCredits),
    };
  }
}
