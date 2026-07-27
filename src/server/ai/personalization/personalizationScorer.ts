// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 6: Personalization Scoring & Telemetry Engine
// =======================================================

import { PersonalizationScore, EmployeePersonalityProfile } from './types';

export class PersonalizationScorer {
  private static instance: PersonalizationScorer;

  private constructor() {}

  public static getInstance(): PersonalizationScorer {
    if (!PersonalizationScorer.instance) {
      PersonalizationScorer.instance = new PersonalizationScorer();
    }
    return PersonalizationScorer.instance;
  }

  /**
   * Calculates overall personalization composite score
   */
  public calculateScores(profile: EmployeePersonalityProfile): PersonalizationScore {
    const memoryQuality = 0.94;
    const preferenceConfidence = profile.confidenceScore;
    const communicationMatch = profile.styleScores.executiveScore > 0.7 ? 0.96 : 0.88;
    const workflowMatch = profile.recurringWorkflows.length > 0 ? 0.92 : 0.80;

    const overallScore = Number(
      (memoryQuality * 0.25 + preferenceConfidence * 0.3 + communicationMatch * 0.25 + workflowMatch * 0.2).toFixed(4)
    );

    return {
      memoryQuality,
      preferenceConfidence,
      communicationMatch,
      workflowMatch,
      overallScore,
    };
  }
}

export const personalizationScorer = PersonalizationScorer.getInstance();
