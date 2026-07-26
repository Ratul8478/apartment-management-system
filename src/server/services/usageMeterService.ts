import { prisma } from '@/lib/prisma';
import { UsageMeteringSummary, UsageQuotaStatus } from '@/types/billing';

export class UsageMeterService {
  /**
   * Records a new consumption event for an organization.
   */
  public static async recordUsage(params: {
    organizationId: string;
    metricKey: 'AI_TOKENS' | 'API_REQUESTS' | 'STORAGE_MB' | 'OCR_DOCUMENTS' | 'FORECAST_RUNS' | 'REPORT_GENERATIONS' | 'ACTIVE_USERS';
    quantity?: number;
    metadata?: any;
  }): Promise<void> {
    const qty = params.quantity || 1;
    await prisma.usageMeterRecord.create({
      data: {
        organizationId: params.organizationId,
        metricKey: params.metricKey,
        quantity: qty,
        metadata: params.metadata ? params.metadata : undefined,
      },
    });
  }

  /**
   * Gets aggregate usage metrics for the active billing cycle vs plan quotas.
   */
  public static async getUsageSummary(organizationId: string): Promise<UsageMeteringSummary> {
    const sub = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    const periodStart = sub ? sub.currentPeriodStart : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const periodEnd = sub ? sub.currentPeriodEnd : new Date();

    const planFeatures: any = sub?.plan?.features || {
      aiTokenQuotaMonthly: 1000000,
      apiRequestsMonthly: 100000,
      storageAllocationMb: 25000,
      ocrDocumentsMonthly: 500,
      forecastRunsMonthly: 250,
      reportGenerationsMonthly: 250,
      userLimit: 50,
    };

    // Group usage records by metric key in current billing period
    const aggregatedUsage = await prisma.usageMeterRecord.groupBy({
      by: ['metricKey'],
      where: {
        organizationId,
        recordedAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const usageMap: Record<string, number> = {};
    for (const item of aggregatedUsage) {
      usageMap[item.metricKey] = item._sum.quantity || 0;
    }

    const metricsConfig: { key: string; label: string; quotaKey: string; unit: string }[] = [
      { key: 'AI_TOKENS', label: 'AI LLM Tokens', quotaKey: 'aiTokenQuotaMonthly', unit: 'Tokens' },
      { key: 'API_REQUESTS', label: 'API Consumption', quotaKey: 'apiRequestsMonthly', unit: 'Requests' },
      { key: 'STORAGE_MB', label: 'Storage Allocation', quotaKey: 'storageAllocationMb', unit: 'MB' },
      { key: 'OCR_DOCUMENTS', label: 'OCR Document Scans', quotaKey: 'ocrDocumentsMonthly', unit: 'Documents' },
      { key: 'FORECAST_RUNS', label: 'AI Forecast Executions', quotaKey: 'forecastRunsMonthly', unit: 'Runs' },
      { key: 'REPORT_GENERATIONS', label: 'Report Exports', quotaKey: 'reportGenerationsMonthly', unit: 'Reports' },
      { key: 'ACTIVE_USERS', label: 'Active Organization Users', quotaKey: 'userLimit', unit: 'Users' },
    ];

    const metrics: Record<string, UsageQuotaStatus> = {};

    for (const conf of metricsConfig) {
      const used = usageMap[conf.key] || 0;
      const quota = Number(planFeatures[conf.quotaKey] || 1000);
      const percentageUsed = quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
      const isExceeded = used >= quota;

      metrics[conf.key] = {
        metricKey: conf.key,
        label: conf.label,
        used,
        quota,
        unit: conf.unit,
        percentageUsed,
        isExceeded,
      };
    }

    return {
      organizationId,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      metrics,
    };
  }
}
