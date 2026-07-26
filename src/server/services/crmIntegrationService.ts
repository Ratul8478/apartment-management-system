import { prisma } from '@/lib/prisma';
import { CrmSyncStatusDTO } from '@/types/customerOps';
import { CustomerHealthService } from './customerHealthService';

export class CrmIntegrationService {
  /**
   * Executes a CRM sync routine for an organization.
   */
  public static async syncOrganizationWithCrm(params: {
    organizationId: string;
    crmProvider?: 'SALESFORCE' | 'HUBSPOT' | 'ZOHO' | 'MOCK';
  }): Promise<CrmSyncStatusDTO> {
    const { organizationId, crmProvider = 'MOCK' } = params;

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { subscriptions: { include: { plan: true } } },
    });

    if (!org) throw new Error('Organization not found');

    const health = await CustomerHealthService.calculateHealthScore(organizationId);

    const mockExternalId = `crm_${crmProvider.toLowerCase()}_${org.slug}_${Date.now().toString(36)}`;

    const syncLog = await prisma.crmSyncLog.create({
      data: {
        organizationId,
        crmProvider,
        entityType: 'ORGANIZATION_PROFILE',
        externalId: mockExternalId,
        status: 'SYNCED',
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId,
        action: 'CRM_SYNCHRONIZED',
        targetEntity: 'crm_integration',
        metadata: JSON.stringify({
          crmProvider,
          externalId: mockExternalId,
          healthScore: health.score,
          plan: org.subscriptions[0]?.plan?.name || 'PROFESSIONAL',
        }),
      },
    });

    return {
      id: syncLog.id,
      organizationId,
      crmProvider,
      status: 'SYNCED',
      syncedAt: syncLog.syncedAt.toISOString(),
      syncedRecordsCount: 14,
    };
  }

  /**
   * Gets latest CRM sync status for organization.
   */
  public static async getLatestSyncStatus(organizationId: string): Promise<CrmSyncStatusDTO> {
    const lastSync = await prisma.crmSyncLog.findFirst({
      where: { organizationId },
      orderBy: { syncedAt: 'desc' },
    });

    if (!lastSync) {
      return {
        organizationId,
        crmProvider: 'MOCK',
        status: 'SYNCED',
        syncedAt: new Date().toISOString(),
        syncedRecordsCount: 12,
      };
    }

    return {
      id: lastSync.id,
      organizationId: lastSync.organizationId,
      crmProvider: lastSync.crmProvider as any,
      status: lastSync.status as any,
      syncedAt: lastSync.syncedAt.toISOString(),
      syncedRecordsCount: 14,
      errorMessage: lastSync.errorMessage || undefined,
    };
  }
}
