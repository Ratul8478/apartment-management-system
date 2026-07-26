import { prisma } from '@/lib/prisma';
import { ReportType } from '@prisma/client';

export const reportRepo = {
  async create(data: {
    reportType: string;
    templateId: string;
    fileUrl?: string | null;
    generatedById: string;
    dateRangeStart?: Date | null;
    dateRangeEnd?: Date | null;
  }) {
    const reportTypeEnum =
      data.reportType === 'PRESENTATION' || data.reportType === 'POWERPOINT_PRESENTATION'
        ? ReportType.POWERPOINT_PRESENTATION
        : data.reportType === 'POWER_BI' || data.reportType === 'POWER_BI_DATASET'
        ? ReportType.POWER_BI_DATASET
        : ReportType.FINANCIAL_SUMMARY_PDF;

    return prisma.report.create({
      data: {
        type: reportTypeEnum,
        templateId: data.templateId,
        fileUrl: data.fileUrl || '',
        generatedById: data.generatedById,
        dateStart: data.dateRangeStart || new Date(),
        dateEnd: data.dateRangeEnd || new Date(),
      },
    });
  },

  async findMany(generatedById?: string) {
    const where = generatedById ? { generatedById } : {};
    return prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        generatedBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  },
};
