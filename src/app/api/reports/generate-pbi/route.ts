import { NextRequest, NextResponse } from 'next/server';
import { buildPowerBiDataset } from '@/lib/export/pbiDatasetBuilder';
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
    const { templateId, period, format } = body;
    const userId = authResult.user!.id;

    const records = await financeService.getRecords();
    const pbiData = buildPowerBiDataset(records);

    // Track report generation & trigger audit log
    await reportService.logReportGeneration({
      reportType: 'POWER_BI',
      templateId: templateId || 'pbi_standard_v1',
      generatedById: userId,
    });

    if (format === 'csv') {
      return new NextResponse(pbiData.csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="FinTrack_PowerBI_${period || 'Dataset'}_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      recordsCount: pbiData.recordsCount,
      dataset: pbiData.jsonSchema,
      exportTimestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GENERATE_PBI');
  }
}
