// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 4: Master Unified User Personalization Engine
// =======================================================

import { profileManager } from './profileManager';
import { styleClassifier } from './styleClassifier';
import { workflowLearner } from './workflowLearner';
import { behaviorModelEngine } from './behaviorModelEngine';
import { adaptivePromptBuilder } from './adaptivePromptBuilder';
import { personalizationScorer } from './personalizationScorer';
import { EmployeePersonalityProfile, PersonalizationScore, PreferredExportFormat } from './types';

export class EnterprisePersonalizationEngine {
  private static instance: EnterprisePersonalizationEngine;

  private constructor() {}

  public static getInstance(): EnterprisePersonalizationEngine {
    if (!EnterprisePersonalizationEngine.instance) {
      EnterprisePersonalizationEngine.instance = new EnterprisePersonalizationEngine();
    }
    return EnterprisePersonalizationEngine.instance;
  }

  /**
   * Executes full user personalization pipeline:
   * 1. Retrieve or initialize employee personality profile
   * 2. Compute explanation depth level (1 to 5) & update style scores
   * 3. Analyze recurring workflow patterns
   * 4. Evaluate behavior model & preferred export formats
   * 5. Construct adaptive prompt
   * 6. Calculate composite personalization score
   */
  public personalizeRequest(params: {
    userId: string;
    tenantId: string;
    role: string;
    question: string;
  }): {
    profile: EmployeePersonalityProfile;
    adaptivePrompt: string;
    scores: PersonalizationScore;
    suggestedExportFormat: PreferredExportFormat;
    recommendedWorkflows: string[];
  } {
    const { userId, tenantId, role, question } = params;

    // 1. Get or Create Profile
    const profile = profileManager.getOrCreateProfile(userId, tenantId, role);

    // 2. Compute Explanation Depth & Update Style Scores
    const depth = styleClassifier.computeExplanationDepth(role, question);
    profile.explanationDepth = depth;
    profile.styleScores = styleClassifier.updateStyleScores(profile.styleScores, question);

    // 3. Analyze Workflows
    const { recommendedWorkflows } = workflowLearner.analyzeAndSuggestWorkflows(profile);

    // 4. Evaluate Behavior Model & Export Preferences
    const { behavior, suggestedExportFormat } = behaviorModelEngine.evaluateBehaviorModel(role, question);
    profile.preferredReportFormat = suggestedExportFormat;

    // 5. Construct Adaptive System Prompt
    const adaptivePrompt = adaptivePromptBuilder.buildAdaptivePrompt(profile, depth, question);

    // 6. Calculate Personalization Composite Scores
    const scores = personalizationScorer.calculateScores(profile);

    return {
      profile,
      adaptivePrompt,
      scores,
      suggestedExportFormat,
      recommendedWorkflows,
    };
  }
}

export const enterprisePersonalizationEngine = EnterprisePersonalizationEngine.getInstance();
