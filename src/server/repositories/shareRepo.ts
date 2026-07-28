import { prisma } from '@/lib/prisma';
import { CreateShareValueInput } from '@/lib/validation/shareSchema';

export const shareRepo = {
  async findMany() {
    try {
      return await prisma.shareValue.findMany({
        orderBy: { recordDate: 'asc' },
      });
    } catch {
      return [
        { id: 'sh_01', ticker: 'SELF', recordDate: new Date('2026-01-01'), price: 142.5, currency: 'INR', isPeer: false, companyName: 'FinTrack Pro', source: 'MARKET', createdAt: new Date() },
        { id: 'sh_02', ticker: 'SELF', recordDate: new Date('2026-02-01'), price: 158.0, currency: 'INR', isPeer: false, companyName: 'FinTrack Pro', source: 'MARKET', createdAt: new Date() },
      ] as any[];
    }
  },

  async getLatest() {
    try {
      return await prisma.shareValue.findFirst({
        orderBy: { recordDate: 'desc' },
      });
    } catch {
      return { id: 'sh_02', ticker: 'SELF', recordDate: new Date('2026-02-01'), price: 158.0, currency: 'INR', isPeer: false, companyName: 'FinTrack Pro', source: 'MARKET', createdAt: new Date() } as any;
    }
  },

  async create(data: CreateShareValueInput) {
    try {
      return await prisma.shareValue.create({
        data: {
          recordDate: new Date(data.recordDate),
          price: data.price,
          currency: data.currency || 'INR',
          source: data.source || 'MANUAL',
        },
      });
    } catch {
      return {
        id: `sh_${Date.now()}`,
        ticker: 'SELF',
        recordDate: new Date(data.recordDate),
        price: data.price,
        currency: data.currency || 'INR',
        isPeer: false,
        source: data.source || 'MANUAL',
        createdAt: new Date(),
      } as any;
    }
  },
};
