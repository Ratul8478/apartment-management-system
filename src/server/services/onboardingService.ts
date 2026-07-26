import { prisma } from '@/lib/prisma';
import { OnboardingStepDTO } from '@/types/customerOps';

export class OnboardingService {
  /**
   * Retrieves or initializes onboarding checklist items for an organization.
   */
  public static async getOnboardingProgress(organizationId: string): Promise<{
    steps: OnboardingStepDTO[];
    completionPercentage: number;
    isFullyCompleted: boolean;
  }> {
    const defaultSteps = [
      { stepKey: 'ORG_PROFILE', stepName: 'Complete Organization Profile & Tax Information' },
      { stepKey: 'FIRST_RECORD', stepName: 'Ingest First Financial Record or CSV Upload' },
      { stepKey: 'INVITE_TEAM', stepName: 'Invite Finance Team Members & Assign Roles' },
      { stepKey: 'AI_FORECAST', stepName: 'Execute AI Revenue & Turnover Forecast Engine' },
      { stepKey: 'BILLING_SETUP', stepName: 'Configure Subscription Plan & Payment Methods' },
      { stepKey: 'REPORTS_EXPORT', stepName: 'Generate First PowerBI / PPT Executive Report' },
    ];

    let steps = await prisma.onboardingProgress.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    });

    if (steps.length === 0) {
      // Auto-initialize onboarding steps
      for (const ds of defaultSteps) {
        await prisma.onboardingProgress.create({
          data: {
            organizationId,
            stepKey: ds.stepKey,
            stepName: ds.stepName,
            isCompleted: ds.stepKey === 'ORG_PROFILE' || ds.stepKey === 'FIRST_RECORD',
            completedAt: ds.stepKey === 'ORG_PROFILE' || ds.stepKey === 'FIRST_RECORD' ? new Date() : null,
          },
        });
      }
      steps = await prisma.onboardingProgress.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'asc' },
      });
    }

    const completedCount = steps.filter((s) => s.isCompleted).length;
    const completionPercentage = Math.round((completedCount / (steps.length || 1)) * 100);

    return {
      steps: steps.map((s) => ({
        id: s.id,
        stepKey: s.stepKey,
        stepName: s.stepName,
        isCompleted: s.isCompleted,
        completedAt: s.completedAt ? s.completedAt.toISOString() : null,
      })),
      completionPercentage,
      isFullyCompleted: completedCount === steps.length,
    };
  }

  /**
   * Marks a specific onboarding task as completed.
   */
  public static async markStepComplete(organizationId: string, stepKey: string): Promise<void> {
    await prisma.onboardingProgress.upsert({
      where: {
        organizationId_stepKey: { organizationId, stepKey },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        organizationId,
        stepKey,
        stepName: stepKey,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }
}
