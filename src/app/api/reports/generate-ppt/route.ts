import { NextRequest, NextResponse } from 'next/server';
import { generatePptPresentation } from '@/lib/export/pptGenerator';
import { financeService } from '@/server/services/financeService';
import { reportService } from '@/server/services/reportService';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'FINANCE_MANAGER', 'ADMIN', 'ANALYST', 'AUDITOR'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const body = await req.json();
    const { period, templateId } = body;
    const userId = authResult.user!.id;
    const role = authResult.user!.role;

    const records = await financeService.getRecords();
    const metrics = await financeService.getAggregatedMetrics();
    const generatedTimestamp = new Date().toISOString();

    const buffer = await generatePptPresentation({
      title: `Executive Financial Report - ${period || '2026'} (Generated: ${generatedTimestamp})`,
      templateId: templateId || 'executive_v1',
      metrics: {
        turnover: metrics.turnover,
        profitLoss: metrics.profitLoss,
        cost: metrics.cost,
      },
      records: records.map(r => ({
        recordDate: r.recordDate,
        metricType: r.metricType,
        amount: Number(r.amount),
        currency: r.currency,
        notes: r.notes,
      })),
    });

    // Track report generation & trigger audit log
    await reportService.logReportGeneration({
      reportType: 'PRESENTATION',
      templateId: templateId || 'executive_v1',
      generatedById: userId,
    });

    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="FinTrack_Report_${period || '2026'}_${Date.now()}.pptx"`,
      },
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GENERATE_PPT');
  }
}
