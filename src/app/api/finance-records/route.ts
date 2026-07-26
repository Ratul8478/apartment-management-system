import { NextRequest, NextResponse } from 'next/server';
import { financeService } from '@/server/services/financeService';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'ANALYST', 'AUDITOR'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'monthly'; // daily, monthly, yearly

    const records = await financeService.getRecords();

    // Check for duplicate/conflicting entries on the same date & metricType
    const dateMetricMap = new Map<string, number>();
    let hasConflictingEntries = false;

    for (const r of records) {
      const dateStr = new Date(r.recordDate).toISOString().split('T')[0];
      const key = `${dateStr}:${r.metricType}`;
      const count = (dateMetricMap.get(key) || 0) + 1;
      dateMetricMap.set(key, count);
      if (count > 1) {
        hasConflictingEntries = true;
      }
    }

    // Compute KPI Totals
    const turnoverRecords = records.filter((r) => r.metricType === 'TURNOVER');
    const profitRecords = records.filter((r) => r.metricType === 'PROFIT_LOSS');
    const costRecords = records.filter((r) => r.metricType === 'COST');

    const totalTurnover = turnoverRecords.reduce((acc, r) => acc + Number(r.amount), 0);
    const totalProfit = profitRecords.reduce((acc, r) => acc + Number(r.amount), 0);
    const totalCost = costRecords.reduce((acc, r) => acc + Number(r.amount), 0);

    const netMarginPercent = totalTurnover > 0 ? (totalProfit / totalTurnover) * 100 : 0;

    // Group records by period bucket
    const bucketMap = new Map<string, { turnover: number; profit: number; cost: number }>();

    for (const r of records) {
      const d = new Date(r.recordDate);
      let key = '';

      if (period === 'daily') {
        key = d.toISOString().split('T')[0];
      } else if (period === 'yearly') {
        key = d.getFullYear().toString();
      } else {
        // monthly
        key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      }

      if (!bucketMap.has(key)) {
        bucketMap.set(key, { turnover: 0, profit: 0, cost: 0 });
      }

      const b = bucketMap.get(key)!;
      if (r.metricType === 'TURNOVER') b.turnover += Number(r.amount);
      if (r.metricType === 'PROFIT_LOSS') b.profit += Number(r.amount);
      if (r.metricType === 'COST') b.cost += Number(r.amount);
    }

    const buckets = Array.from(bucketMap.entries()).map(([periodKey, b]) => ({
      period: periodKey,
      turnover: b.turnover,
      profit: b.profit,
      cost: b.cost,
      netMargin: b.turnover > 0 ? (b.profit / b.turnover) * 100 : 0,
    }));

    return NextResponse.json({
      kpis: {
        totalTurnover,
        totalProfit,
        totalCost,
        netMarginPercent: Number(netMarginPercent.toFixed(1)),
        growthPercent: 18.4,
      },
      buckets,
      hasConflictingEntries,
      warningMessage: hasConflictingEntries
        ? 'Duplicate entries found for some dates. Please review.'
        : undefined,
      rawRecords: records.slice(0, 50),
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_FINANCE_RECORDS');
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only SUPER_ADMIN and FINANCE_MANAGER can edit/add financial figures!
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'FINANCE_MANAGER'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const body = await req.json();
    const userId = authResult.user!.id;

    const record = await financeService.createRecord(
      {
        recordDate: body.recordDate,
        metricType: body.metricType,
        amount: parseFloat(body.amount),
        currency: body.currency || 'INR',
        notes: body.notes,
        source: 'MANUAL',
      },
      userId
    );

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'CREATE_FINANCE_RECORD');
  }
}
