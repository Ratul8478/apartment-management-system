// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 5: Task & Action Item Extraction Engine
// =======================================================

import { ExtractedTask, ExtractedActionItem } from './types';

export class TaskExtractor {
  private static instance: TaskExtractor;

  private constructor() {}

  public static getInstance(): TaskExtractor {
    if (!TaskExtractor.instance) {
      TaskExtractor.instance = new TaskExtractor();
    }
    return TaskExtractor.instance;
  }

  /**
   * Extracts actionable tasks and next steps from question text
   */
  public extractTasksAndActions(question: string, urgency: 'HIGH' | 'MEDIUM' | 'LOW'): { tasks: ExtractedTask[]; actionItems: ExtractedActionItem[] } {
    const tasks: ExtractedTask[] = [];
    const actionItems: ExtractedActionItem[] = [];
    const qLower = question.toLowerCase();

    if (qLower.includes('ppt') || qLower.includes('presentation') || qLower.includes('slides')) {
      tasks.push({
        taskId: `task_${Date.now()}_ppt`,
        title: 'Generate Executive PowerPoint Deck',
        actionType: 'GENERATE_PRESENTATION',
        priority: urgency === 'HIGH' ? 'HIGH' : 'MEDIUM',
        deadline: 'End of Quarter',
      });
    }

    if (qLower.includes('report') || qLower.includes('export') || qLower.includes('pdf')) {
      tasks.push({
        taskId: `task_${Date.now()}_rpt`,
        title: 'Compile Financial Audit Report',
        actionType: 'GENERATE_REPORT',
        priority: 'MEDIUM',
      });
    }

    if (qLower.includes('forecast') || qLower.includes('predict')) {
      actionItems.push({
        actionId: `action_${Date.now()}_fc`,
        description: 'Run quantitative revenue prediction model for upcoming fiscal period.',
        assignedToRole: 'ANALYST',
        isUrgent: urgency === 'HIGH',
      });
    }

    if (qLower.includes('cost') && (qLower.includes('reduce') || qLower.includes('optimize') || qLower.includes('cut'))) {
      actionItems.push({
        actionId: `action_${Date.now()}_cost`,
        description: 'Audit department operational expense lines exceeding target thresholds.',
        assignedToRole: 'FINANCE_MANAGER',
        isUrgent: true,
      });
    }

    return { tasks, actionItems };
  }
}

export const taskExtractor = TaskExtractor.getInstance();
