import { reportRepo } from '../repositories/reportRepo';
import { auditService } from './auditService';

export const reportService = {
  async logReportGeneration(params: {
    reportType: 'POWER_BI' | 'PRESENTATION';
    templateId: string;
    fileUrl?: string | null;
    generatedById: string;
    dateRangeStart?: Date | null;
    dateRangeEnd?: Date | null;
  }) {
    const report = await reportRepo.create(params);

    await auditService.logAction({
      actorUserId: params.generatedById,
      action: 'GENERATE_REPORT',
      targetTable: 'reports',
      targetId: report.id,
      metadata: {
        reportType: params.reportType,
        templateId: params.templateId,
        dateRangeStart: params.dateRangeStart,
        dateRangeEnd: params.dateRangeEnd,
      },
    });

    return report;
  },

  async getReportHistory(generatedById?: string) {
    return reportRepo.findMany(generatedById);
  },
};
