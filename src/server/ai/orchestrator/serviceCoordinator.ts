// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 4: Autonomous Event-Driven Service Coordinator
// =======================================================

export type OrchestrationEvent = 'REQUEST_RECEIVED' | 'DAG_PLANNED' | 'PARALLEL_SERVICES_COMPLETED' | 'GOVERNANCE_PASSED' | 'RESPONSE_READY';

export class ServiceCoordinator {
  private static instance: ServiceCoordinator;
  private eventListeners: Map<OrchestrationEvent, ((data: any) => void)[]> = new Map();

  private constructor() {}

  public static getInstance(): ServiceCoordinator {
    if (!ServiceCoordinator.instance) {
      ServiceCoordinator.instance = new ServiceCoordinator();
    }
    return ServiceCoordinator.instance;
  }

  /**
   * Executes tasks in parallel using Promise.all for low latency
   */
  public async executeParallelBatch<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
    return Promise.all(tasks.map((task) => task()));
  }

  /**
   * Emits internal orchestration event
   */
  public emitEvent(event: OrchestrationEvent, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    for (const fn of listeners) {
      try {
        fn(data);
      } catch (err) {
        console.warn(`Orchestration event listener error (${event}):`, err);
      }
    }
  }
}

export const serviceCoordinator = ServiceCoordinator.getInstance();
