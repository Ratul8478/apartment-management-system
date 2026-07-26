import { z } from 'zod';

export const MetricTypeEnum = z.enum(['TURNOVER', 'PROFIT_LOSS', 'COST']);
export const SourceEnum = z.enum(['MANUAL', 'CSV_UPLOAD']);

export const createFinanceRecordSchema = z.object({
  recordDate: z.string().or(z.date()),
  metricType: MetricTypeEnum,
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  notes: z.string().optional().nullable(),
  source: SourceEnum.default('MANUAL'),
});

export const bulkFinanceRecordSchema = z.array(createFinanceRecordSchema);

export type CreateFinanceRecordInput = z.infer<typeof createFinanceRecordSchema>;
