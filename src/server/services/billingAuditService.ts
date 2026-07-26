import { prisma } from '@/lib/prisma';

export class BillingAuditService {
  /**
   * Records an immutable billing audit log entry.
   */
  public static async logCommercialEvent(params: {
    organizationId?: string;
    actorUserId?: string;
    action:
      | 'PLAN_CREATED'
      | 'SUBSCRIPTION_STARTED'
      | 'PLAN_UPGRADED'
      | 'PLAN_DOWNGRADED'
      | 'SUBSCRIPTION_CANCELED'
      | 'SUBSCRIPTION_REACTIVATED'
      | 'PAYMENT_AUTHORIZED'
      | 'PAYMENT_CAPTURED'
      | 'PAYMENT_FAILED'
      | 'INVOICE_GENERATED'
      | 'TAX_CALCULATED'
      | 'ENTITLEMENT_MODIFIED'
      | 'DUNNING_ATTEMPTED';
    targetEntity?: string;
    targetId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    metadata?: any;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        organizationId: params.organizationId || null,
        actorUserId: params.actorUserId || null,
        action: params.action,
        targetEntity: params.targetEntity || 'billing',
        targetId: params.targetId || null,
        oldValues: params.oldValues ? params.oldValues : undefined,
        newValues: params.newValues ? params.newValues : undefined,
        metadata: params.metadata ? params.metadata : undefined,
        ipAddress: params.ipAddress || '127.0.0.1',
      },
    });
  }
}
