import { financeRepo } from '../repositories/financeRepo';
import { auditService } from './auditService';
import { CreateFinanceRecordInput, createFinanceRecordSchema } from '@/lib/validation/financeSchema';

export const financeService = {
  async getRecords(filters?: {
    startDate?: Date;
    endDate?: Date;
    metricType?: string;
    source?: string;
  }) {
    return financeRepo.findMany(filters);
  },

  async createRecord(input: CreateFinanceRecordInput, actorUserId: string) {
    const validated = createFinanceRecordSchema.parse(input);
    const record = await financeRepo.create({
      ...validated,
      createdById: actorUserId,
    });

    // Centralized Audit Log Write
    await auditService.logAction({
      actorUserId,
      action: 'ADD_FINANCE_RECORD',
      targetTable: 'finance_records',
      targetId: record.id,
      metadata: {
        metricType: record.metricType,
        amount: record.amount,
        currency: record.currency,
        recordDate: record.recordDate,
        source: record.source,
      },
    });

    return record;
  },

  async importCsv(records: CreateFinanceRecordInput[], actorUserId: string, filename?: string) {
    if (!records || records.length === 0) {
      throw new Error('No valid financial records provided in CSV');
    }

    const validatedRecords = records.map((r) => createFinanceRecordSchema.parse(r));
    const result = await financeRepo.createMany(
      validatedRecords.map((r) => ({ ...r, createdById: actorUserId }))
    );

    // Centralized Audit Log Write for CSV import
    await auditService.logAction({
      actorUserId,
      action: 'CSV_IMPORT',
      targetTable: 'finance_records',
      metadata: {
        recordsImported: result.count,
        file: filename || 'bulk_import.csv',
      },
    });

    return result;
  },

  async getAggregatedMetrics() {
    return financeRepo.getAggregatedMetrics();
  },
};
