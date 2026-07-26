import { prisma } from '@/lib/prisma';
import { CreateShareValueInput } from '@/lib/validation/shareSchema';

export const shareRepo = {
  async findMany() {
    return prisma.shareValue.findMany({
      orderBy: { recordDate: 'asc' },
    });
  },

  async getLatest() {
    return prisma.shareValue.findFirst({
      orderBy: { recordDate: 'desc' },
    });
  },

  async create(data: CreateShareValueInput) {
    return prisma.shareValue.create({
      data: {
        recordDate: new Date(data.recordDate),
        price: data.price,
        currency: data.currency || 'INR',
        source: data.source || 'MANUAL',
      },
    });
  },
};
