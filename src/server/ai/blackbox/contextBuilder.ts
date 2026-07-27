// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 2: Context Engine (Selective Multi-Source Context Assembler)
// =======================================================

import { financeService } from '@/server/services/financeService';
import { shareService } from '@/server/services/shareService';
import { prisma } from '@/lib/prisma';
import { TenantIdentity, FilteredFinancialContext } from './types';

export class ContextBuilderEngine {
  private static instance: ContextBuilderEngine;

  private constructor() {}

  public static getInstance(): ContextBuilderEngine {
    if (!ContextBuilderEngine.instance) {
      ContextBuilderEngine.instance = new ContextBuilderEngine();
    }
    return ContextBuilderEngine.instance;
  }

  /**
   * Selectively assembles multi-source tenant context based on user permissions
   */
  public async assembleTenantContext(tenant: TenantIdentity): Promise<FilteredFinancialContext> {
    const metrics = await financeService.getAggregatedMetrics();
    const recentRecords = await financeService.getRecords({ limit: 10 } as any);
    const shareValues = await shareService.getShareValues();

    const turnover = metrics.turnover || 0;
    const profitLoss = metrics.profitLoss || 0;
    const cost = metrics.cost || 0;
    const netMarginPct = turnover > 0 ? Number(((profitLoss / turnover) * 100).toFixed(2)) : 0;

    // Retrieve active forecasts
    let forecasts: any[] = [];
    try {
      forecasts = await prisma.forecast.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      forecasts = [];
    }

    return {
      turnover,
      profitLoss,
      cost,
      netMarginPct,
      totalRecordsCount: metrics.totalRecords || 0,
      recentTransactions: recentRecords.slice(0, 10),
      sharePriceBenchmarks: shareValues.slice(-5),
      forecastTrend: forecasts.map((f) => ({
        quarter: `Q${f.quarter} ${f.fiscalYear}`,
        predictedValue: Number(f.predictedValue),
        confidenceLow: Number(f.confidenceLow),
        confidenceHigh: Number(f.confidenceHigh),
      })),
    };
  }
}

export const contextBuilderEngine = ContextBuilderEngine.getInstance();
