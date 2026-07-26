import { prisma } from '@/lib/prisma';
import { SuccessPlanDTO } from '@/types/customerOps';

export class CustomerSuccessService {
  /**
   * Gets or initializes Customer Success plans for an organization.
   */
  public static async getSuccessPlans(organizationId: string): Promise<SuccessPlanDTO[]> {
    let plans = await prisma.customerSuccessPlan.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    if (plans.length === 0) {
      // Auto-initialize default success plan
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 3);

      const defaultPlan = await prisma.customerSuccessPlan.create({
        data: {
          organizationId,
          title: 'Q3 Enterprise Financial AI Adoption & Scale',
          status: 'IN_PROGRESS',
          targetDate,
          objectivesJson: [
            { id: 'obj-1', title: 'Achieve 80%+ Finance Team Active User Adoption', isCompleted: true },
            { id: 'obj-2', title: 'Automate Monthly Turnover Ingestion via ERP/CSV Sync', isCompleted: true },
            { id: 'obj-3', title: 'Schedule Executive Business Review (EBR)', isCompleted: false },
          ],
          notesJson: [
            { author: 'Customer Success Manager', note: 'Kickoff call completed successfully. Client engaged.', createdAt: new Date().toISOString() },
          ],
        },
      });
      plans = [defaultPlan];
    }

    return plans.map((p) => ({
      id: p.id,
      organizationId: p.organizationId,
      title: p.title,
      status: p.status as any,
      targetDate: p.targetDate.toISOString(),
      objectives: (p.objectivesJson as any) || [],
      notes: (p.notesJson as any) || [],
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  }

  /**
   * Creates a new Customer Success Plan.
   */
  public static async createSuccessPlan(params: {
    organizationId: string;
    title: string;
    targetDate: Date;
    objectives: { title: string }[];
  }): Promise<SuccessPlanDTO> {
    const { organizationId, title, targetDate, objectives } = params;

    const plan = await prisma.customerSuccessPlan.create({
      data: {
        organizationId,
        title,
        status: 'IN_PROGRESS',
        targetDate,
        objectivesJson: objectives.map((o, idx) => ({
          id: `obj-${idx + 1}`,
          title: o.title,
          isCompleted: false,
        })),
        notesJson: [],
      },
    });

    return {
      id: plan.id,
      organizationId: plan.organizationId,
      title: plan.title,
      status: plan.status as any,
      targetDate: plan.targetDate.toISOString(),
      objectives: (plan.objectivesJson as any) || [],
      notes: [],
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    };
  }
}
