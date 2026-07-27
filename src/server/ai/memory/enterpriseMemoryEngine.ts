// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Master Unified Enterprise AI Memory Engine (Layers 1 to 5)
// =======================================================

import { workingMemoryManager } from './workingMemory';
import { shortTermMemoryManager } from './shortTermMemory';
import { longTermMemoryManager } from './longTermMemory';
import { organizationalMemoryManager } from './organizationalMemory';
import { semanticMemoryDistiller } from './semanticMemory';
import { vectorRetrievalEngine } from './vectorRetrievalEngine';
import { MemoryObject, MemoryRetrievalQuery, RankedMemoryResult } from './types';

export class EnterpriseMemoryEngine {
  private static instance: EnterpriseMemoryEngine;

  private constructor() {}

  public static getInstance(): EnterpriseMemoryEngine {
    if (!EnterpriseMemoryEngine.instance) {
      EnterpriseMemoryEngine.instance = new EnterpriseMemoryEngine();
    }
    return EnterpriseMemoryEngine.instance;
  }

  /**
   * Retrieves and ranks relevant memories across all 5 memory layers:
   * 1. Working Memory (Active session buffer)
   * 2. Short-Term Memory (Recent 30 days history)
   * 3. Long-Term Memory (Permanent preferences & communication styles)
   * 4. Organizational Memory (Shared company policies & security rules)
   * 5. Semantic Memory (Distilled facts & preferences)
   */
  public async retrieveAndRankRelevantContext(query: MemoryRetrievalQuery): Promise<{
    rankedMemories: RankedMemoryResult[];
    formattedContextString: string;
  }> {
    const { tenantId, userId, userRole, question } = query;

    // Layer 1: Retrieve Working Memory Active Context
    const session = workingMemoryManager.getOrCreateSession(`sess_${userId}`, tenantId, userId);

    // Layer 2: Retrieve Short-Term Conversation History
    const shortTermMemories = await shortTermMemoryManager.getRecentMemories(tenantId, userId);

    // Layer 3: Retrieve Long-Term User & Role Preferences
    const longTermMemories = await longTermMemoryManager.getLongTermPreferences(tenantId, userId, userRole);

    // Layer 4: Retrieve Shared Organizational Policies & Compliance Rules
    const orgMemories = await organizationalMemoryManager.getOrganizationalPolicies(tenantId);

    // Layer 5: Retrieve Distilled Semantic Facts
    const semanticMemories = await semanticMemoryDistiller.getDistilledSemanticFacts(tenantId, userId, question);

    // Aggregate candidate memories across layers 2, 3, 4, 5
    const candidatePool: MemoryObject[] = [
      ...shortTermMemories,
      ...longTermMemories,
      ...orgMemories,
      ...semanticMemories,
    ];

    // Execute Vector Retrieval & Composite Importance Ranking
    const rankedMemories = vectorRetrievalEngine.rankMemories(query, candidatePool);

    // Format top ranked memories into clean context prompt for Reasoning Engine
    const formattedContextString = rankedMemories
      .map((item, idx) => `[Memory #${idx + 1} | Layer: ${item.memory.layer} | Category: ${item.memory.category} | RankScore: ${item.finalRankScore}]\n${item.memory.content}`)
      .join('\n\n');

    return {
      rankedMemories,
      formattedContextString,
    };
  }
}

export const enterpriseMemoryEngine = EnterpriseMemoryEngine.getInstance();
