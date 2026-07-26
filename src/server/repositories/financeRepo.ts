import { prisma } from '@/lib/prisma';
import { CreateFinanceRecordInput } from '@/lib/validation/financeSchema';

export const financeRepo = {
  async findMany(filters?: {
    startDate?: Date;
    endDate?: Date;
    metricType?: string;
    source?: string;
  }) {
    const where: any = {};
    if (filters?.metricType) where.metricType = filters.metricType;
    if (filters?.source) where.source = filters.source;
    if (filters?.startDate || filters?.endDate) {
      where.recordDate = {};
      if (filters.startDate) where.recordDate.gte = filters.startDate;
      if (filters.endDate) where.recordDate.lte = filters.endDate;
    }

    return prisma.financeRecord.findMany({
      where,
      orderBy: { recordDate: 'desc' },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  },

  async create(data: CreateFinanceRecordInput & { createdById: string }) {
    return prisma.financeRecord.create({
      data: {
        recordDate: new Date(data.recordDate),
        metricType: data.metricType,
        amount: data.amount,
        currency: data.currency || 'INR',
        notes: data.notes,
        source: data.source || 'MANUAL',
        createdById: data.createdById,
      },
    });
  },

  async createMany(records: (CreateFinanceRecordInput & { createdById: string })[]) {
    const formatted = records.map((r) => ({
      recordDate: new Date(r.recordDate),
      metricType: r.metricType,
      amount: r.amount,
      currency: r.currency || 'INR',
      notes: r.notes || null,
      source: r.source || 'CSV_UPLOAD',
      createdById: r.createdById,
    }));

    return prisma.financeRecord.createMany({
      data: formatted,
    });
  },

  async getAggregatedMetrics() {
    const records = await prisma.financeRecord.findMany({
      orderBy: { recordDate: 'asc' },
    });

    const turnover = records
      .filter((r) => r.metricType === 'TURNOVER')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const profitLoss = records
      .filter((r) => r.metricType === 'PROFIT_LOSS')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const cost = records
      .filter((r) => r.metricType === 'COST')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return { turnover, profitLoss, cost, totalRecords: records.length };
  },
};
