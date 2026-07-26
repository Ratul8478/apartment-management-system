import { auditRepo } from '../repositories/auditRepo';
import { UserRole } from '@/types';

export const auditService = {
  async logAction(params: {
    actorUserId: string;
    action: string;
    targetTable: string;
    targetId?: string | null;
    metadata?: any;
  }) {
    try {
      return await auditRepo.create(params);
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  },

  async getAuditLogs(role: UserRole, currentUserId: string, filters?: { limit?: number }) {
    return auditRepo.findMany(role, currentUserId, filters);
  },
};
