import { prisma } from '@/lib/prisma';
import { UserRole } from '@/types';

export const auditRepo = {
  async create(data: {
    actorUserId: string;
    action: string;
    targetTable: string;
    targetId?: string | null;
    metadata?: any;
  }) {
    // Append-only creation
    return prisma.auditLog.create({
      data: {
        actorUserId: data.actorUserId,
        action: data.action,
        targetTable: data.targetTable,
        targetId: data.targetId || null,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });
  },

  async findMany(role: UserRole, currentUserId: string, filters?: { limit?: number }) {
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return [];
    }

    const where: any = {};
    if (role === 'ADMIN') {
      // Admins can only view audit logs of their own actions
      where.actorUserId = currentUserId;
    }

    return prisma.auditLog.findMany({
      where,
      take: filters?.limit || 100,
      orderBy: { createdAt: 'desc' },
      include: {
        actorUser: {
          select: { id: true, fullName: true, email: true, role: true },
        },
      },
    });
  },
};
