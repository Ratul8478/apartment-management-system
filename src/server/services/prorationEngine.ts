import { BillingCycle, ProrationCalculation } from '@/types/billing';

export class ProrationEngine {
  /**
   * Calculates financial proration when switching plans before the current period ends.
   */
  public static calculateProration(params: {
    currentPlanCode: string;
    currentPlanPrice: number;
    newPlanCode: string;
    newPlanPrice: number;
    billingCycle: BillingCycle;
    periodStart: Date;
    periodEnd: Date;
    effectiveDate?: Date;
    taxRatePercentage?: number;
  }): ProrationCalculation {
    const effective = params.effectiveDate || new Date();
    const periodStartMs = params.periodStart.getTime();
    const periodEndMs = params.periodEnd.getTime();
    const effectiveMs = effective.getTime();

    // Guard against dates outside current period
    const clampedEffectiveMs = Math.max(periodStartMs, Math.min(periodEndMs, effectiveMs));

    const totalPeriodMs = Math.max(1, periodEndMs - periodStartMs);
    const remainingMs = Math.max(0, periodEndMs - clampedEffectiveMs);

    const daysTotalInPeriod = Math.ceil(totalPeriodMs / (1000 * 60 * 60 * 24));
    const daysRemainingInPeriod = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

    const fractionRemaining = remainingMs / totalPeriodMs;

    // Unused credit from current plan
    const unusedCurrentPlanCredit = Math.round(params.currentPlanPrice * fractionRemaining * 100) / 100;

    // Prorated charge for new plan for the remaining days
    const newPlanProratedCharge = Math.round(params.newPlanPrice * fractionRemaining * 100) / 100;

    // Gross amount due (can be negative if downgrade resulting in credit)
    const grossAmountDue = Math.round((newPlanProratedCharge - unusedCurrentPlanCredit) * 100) / 100;

    const taxRate = (params.taxRatePercentage || 0) / 100;
    const taxAmount = grossAmountDue > 0 ? Math.round(grossAmountDue * taxRate * 100) / 100 : 0;
    const netPayableAmount = Math.round((grossAmountDue + taxAmount) * 100) / 100;

    return {
      currentPlanCode: params.currentPlanCode,
      newPlanCode: params.newPlanCode,
      billingCycle: params.billingCycle,
      daysTotalInPeriod,
      daysRemainingInPeriod,
      unusedCurrentPlanCredit,
      newPlanProratedCharge,
      grossAmountDue,
      taxAmount,
      netPayableAmount,
      effectiveDate: effective.toISOString(),
      prorationApplied: true,
    };
  }
}
