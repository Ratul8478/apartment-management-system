// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 3: Dynamic DAG Execution Graph Planner
// =======================================================

export interface DAGNode {
  nodeId: string;
  serviceName: 'CONVERSATION_INTEL' | 'MEMORY_ENGINE' | 'PERSONALIZATION_ENGINE' | 'RAG_ENGINE' | 'FORECAST_ENGINE' | 'RECOMMENDATION_ENGINE' | 'REASONING_ENGINE' | 'GOVERNANCE_ENGINE';
  isParallelCapable: boolean;
  dependencies: string[];
}

export interface DAGExecutionGraph {
  graphId: string;
  nodes: DAGNode[];
  parallelExecutionBatches: string[][];
  estimatedTotalMs: number;
}

export class DAGExecutionPlanner {
  private static instance: DAGExecutionPlanner;

  private constructor() {}

  public static getInstance(): DAGExecutionPlanner {
    if (!DAGExecutionPlanner.instance) {
      DAGExecutionPlanner.instance = new DAGExecutionPlanner();
    }
    return DAGExecutionPlanner.instance;
  }

  /**
   * Generates dynamic, optimized DAG Execution Graph for incoming user request
   */
  public generateDAG(question: string): DAGExecutionGraph {
    const graphId = `dag_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const nodes: DAGNode[] = [
      { nodeId: 'n1', serviceName: 'CONVERSATION_INTEL', isParallelCapable: false, dependencies: [] },
      { nodeId: 'n2', serviceName: 'MEMORY_ENGINE', isParallelCapable: true, dependencies: ['n1'] },
      { nodeId: 'n3', serviceName: 'PERSONALIZATION_ENGINE', isParallelCapable: true, dependencies: ['n1'] },
      { nodeId: 'n4', serviceName: 'RAG_ENGINE', isParallelCapable: true, dependencies: ['n1'] },
      { nodeId: 'n5', serviceName: 'FORECAST_ENGINE', isParallelCapable: true, dependencies: ['n1'] },
      { nodeId: 'n6', serviceName: 'RECOMMENDATION_ENGINE', isParallelCapable: true, dependencies: ['n1'] },
      { nodeId: 'n7', serviceName: 'REASONING_ENGINE', isParallelCapable: false, dependencies: ['n2', 'n3', 'n4', 'n5', 'n6'] },
      { nodeId: 'n8', serviceName: 'GOVERNANCE_ENGINE', isParallelCapable: false, dependencies: ['n7'] },
    ];

    return {
      graphId,
      nodes,
      parallelExecutionBatches: [
        ['n1'],                     // Step 1: Conversation Intel
        ['n2', 'n3', 'n4', 'n5', 'n6'], // Step 2: Parallel execution of Memory, Personalization, RAG, Forecast & Recommendation
        ['n7'],                     // Step 3: Quantitative Reasoning
        ['n8'],                     // Step 4: Governance Validation
      ],
      estimatedTotalMs: 85,
    };
  }
}

export const dagExecutionPlanner = DAGExecutionPlanner.getInstance();
