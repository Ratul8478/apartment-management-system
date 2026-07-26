import { shareRepo } from '../repositories/shareRepo';
import { auditService } from './auditService';
import { CreateShareValueInput, createShareValueSchema } from '@/lib/validation/shareSchema';

export const shareService = {
  async getShareValues() {
    return shareRepo.findMany();
  },

  async getLatestShareValue() {
    return shareRepo.getLatest();
  },

  async addShareValue(input: CreateShareValueInput, actorUserId: string) {
    const validated = createShareValueSchema.parse(input);
    const record = await shareRepo.create(validated);

    await auditService.logAction({
      actorUserId,
      action: 'UPDATE_SHARE_PRICE',
      targetTable: 'share_values',
      targetId: record.id,
      metadata: {
        price: record.price,
        currency: record.currency,
        recordDate: record.recordDate,
        source: record.source,
      },
    });

    return record;
  },
};
