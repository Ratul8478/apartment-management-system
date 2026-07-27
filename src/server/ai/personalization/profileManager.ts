// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 1: Employee Personality Profile Manager
// =======================================================

import { EmployeePersonalityProfile } from './types';

export class ProfileManager {
  private static instance: ProfileManager;
  private profileStore: Map<string, EmployeePersonalityProfile> = new Map();

  private constructor() {}

  public static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager();
    }
    return ProfileManager.instance;
  }

  /**
   * Retrieves or initializes default personality profile for an employee
   */
  public getOrCreateProfile(userId: string, tenantId: string, role: string): EmployeePersonalityProfile {
    let profile = this.profileStore.get(userId);
    if (!profile) {
      const isExec = role === 'SUPER_ADMIN' || role === 'FINANCE_MANAGER';
      profile = {
        userId,
        tenantId,
        department: 'Finance',
        role,
        experienceLevel: isExec ? 'EXECUTIVE' : 'SENIOR',
        preferredLanguage: 'CORPORATE_ENGLISH',
        preferredTone: isExec ? 'EXECUTIVE_BRIEFING' : 'PROFESSIONAL',
        explanationDepth: isExec ? 'LEVEL_1_EXECUTIVE_SUMMARY' : 'LEVEL_3_DETAILED_EXPLANATION',
        styleScores: {
          executiveScore: isExec ? 0.95 : 0.4,
          technicalScore: isExec ? 0.3 : 0.8,
          financeScore: 0.9,
          analyticalScore: 0.85,
          minimalScore: isExec ? 0.8 : 0.4,
          detailedScore: isExec ? 0.3 : 0.7,
        },
        preferredChartStyle: 'BAR',
        preferredDashboardLayout: 'EXECUTIVE_KPI',
        preferredReportFormat: isExec ? 'POWERPOINT' : 'EXCEL',
        favoriteMetrics: ['TURNOVER', 'NET_PROFIT', 'OPERATING_COST'],
        recurringWorkflows: [
          { workflowName: 'Weekly KPI Report', frequency: 'WEEKLY' },
          { workflowName: 'Monthly Financial PPT', frequency: 'MONTHLY' },
        ],
        confidenceScore: 0.88,
        lastUpdated: new Date().toISOString(),
      };
      this.profileStore.set(userId, profile);
    }
    return profile;
  }

  /**
   * Updates employee personality profile preferences
   */
  public updateProfile(userId: string, updates: Partial<EmployeePersonalityProfile>): EmployeePersonalityProfile {
    const profile = this.profileStore.get(userId);
    if (profile) {
      Object.assign(profile, updates, { lastUpdated: new Date().toISOString() });
      return profile;
    }
    throw new Error(`Profile for user ${userId} not found.`);
  }

  /**
   * Resets employee personality profile back to defaults
   */
  public resetProfile(userId: string, tenantId: string, role: string): EmployeePersonalityProfile {
    this.profileStore.delete(userId);
    return this.getOrCreateProfile(userId, tenantId, role);
  }
}

export const profileManager = ProfileManager.getInstance();
