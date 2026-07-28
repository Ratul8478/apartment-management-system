import { prisma } from '@/lib/prisma';
import { firebaseDbAdapter } from '@/lib/firebase/dbAdapter';
import { UserRole } from '@/types';

export const auditRepo = {
  async create(data: {
    actorUserId: string;
    action: string;
    targetTable: string;
    targetId?: string | null;
    metadata?: any;
  }) {
    try {
      return await prisma.auditLog.create({
        data: {
          actorUserId: data.actorUserId,
          action: data.action,
          targetTable: data.targetTable,
          targetId: data.targetId || null,
          metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
        },
      });
    } catch {
      return await firebaseDbAdapter.saveAuditLog({
        actorUserId: data.actorUserId,
        action: data.action,
        targetTable: data.targetTable,
        targetId: data.targetId || null,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      }) as any;
    }
  },

  async findMany(role: UserRole, currentUserId: string, filters?: { limit?: number }) {
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return [];
    }

    try {
      const where: any = {};
      if (role === 'ADMIN') {
        where.actorUserId = currentUserId;
      }

      return await prisma.auditLog.findMany({
        where,
        take: filters?.limit || 100,
        orderBy: { createdAt: 'desc' },
        include: {
          actorUser: {
            select: { id: true, fullName: true, email: true, role: true },
          },
        },
      });
    } catch {
      return [];
    }
  },
};
