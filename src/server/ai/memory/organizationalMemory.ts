// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Memory Layer 4: Organizational Memory Manager (Company Policies & Rules)
// =======================================================

import { MemoryObject } from './types';

export class OrganizationalMemoryManager {
  private static instance: OrganizationalMemoryManager;

  private constructor() {}

  public static getInstance(): OrganizationalMemoryManager {
    if (!OrganizationalMemoryManager.instance) {
      OrganizationalMemoryManager.instance = new OrganizationalMemoryManager();
    }
    return OrganizationalMemoryManager.instance;
  }

  /**
   * Retrieves shared company financial policies, audit rules, and compliance constraints
   */
  public async getOrganizationalPolicies(tenantId: string): Promise<MemoryObject[]> {
    const now = new Date().toISOString();
    return [
      {
        id: `org_policy_${tenantId}_fin`,
        tenantId,
        userId: 'system',
        layer: 'ORGANIZATIONAL',
        category: 'FINANCIAL_RULE',
        content: 'Company Financial Policy: Net operating margin target is 15%. All operational costs exceeding 70% of gross turnover require executive review.',
        tags: ['policy', 'financial', 'compliance'],
        importanceScore: 0.98,
        confidenceScore: 1.0,
        isPinned: true,
        createdAt: now,
        updatedAt: now,
        accessCount: 100,
        expirationPolicy: 'PERMANENT',
      },
      {
        id: `org_policy_${tenantId}_sec`,
        tenantId,
        userId: 'system',
        layer: 'ORGANIZATIONAL',
        category: 'FINANCIAL_RULE',
        content: 'Data Security Policy: Confidential payroll & employee compensation details are restricted exclusively to SUPER_ADMIN & FINANCE_MANAGER roles.',
        tags: ['security', 'rbac', 'payroll'],
        importanceScore: 1.0,
        confidenceScore: 1.0,
        isPinned: true,
        createdAt: now,
        updatedAt: now,
        accessCount: 150,
        expirationPolicy: 'PERMANENT',
      },
    ];
  }
}

export const organizationalMemoryManager = OrganizationalMemoryManager.getInstance();
