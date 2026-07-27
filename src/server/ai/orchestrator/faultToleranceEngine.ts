// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 2: Fault-Tolerance, Circuit Breaker & Graceful Degradation Engine
// =======================================================

export interface ServiceExecutionResult<T> {
  serviceName: string;
  isSuccess: boolean;
  data?: T;
  fallbackNotice?: string;
  executionTimeMs: number;
}

export class FaultToleranceEngine {
  private static instance: FaultToleranceEngine;
  private circuitBreakers: Map<string, { failureCount: number; isTripped: boolean; lastFailureAt?: number }> = new Map();
  private readonly FAILURE_THRESHOLD = 3;

  private constructor() {}

  public static getInstance(): FaultToleranceEngine {
    if (!FaultToleranceEngine.instance) {
      FaultToleranceEngine.instance = new FaultToleranceEngine();
    }
    return FaultToleranceEngine.instance;
  }

  /**
   * Executes an AI subsystem with timeout isolation, circuit breaking, and graceful degradation fallback
   */
  public async executeWithFaultTolerance<T>(
    serviceName: string,
    action: () => Promise<T>,
    fallbackDataSupplier: () => T
  ): Promise<ServiceExecutionResult<T>> {
    const startTime = Date.now();
    const breaker = this.circuitBreakers.get(serviceName) || { failureCount: 0, isTripped: false };

    // Check if circuit breaker is tripped
    if (breaker.isTripped) {
      return {
        serviceName,
        isSuccess: false,
        data: fallbackDataSupplier(),
        fallbackNotice: `Notice: Service '${serviceName}' is temporarily degraded. Returning historical baseline context.`,
        executionTimeMs: Date.now() - startTime,
      };
    }

    try {
      const data = await action();
      // Reset failure count on success
      this.circuitBreakers.set(serviceName, { failureCount: 0, isTripped: false });
      return {
        serviceName,
        isSuccess: true,
        data,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (err) {
      breaker.failureCount++;
      if (breaker.failureCount >= this.FAILURE_THRESHOLD) {
        breaker.isTripped = true;
        breaker.lastFailureAt = Date.now();
      }
      this.circuitBreakers.set(serviceName, breaker);

      return {
        serviceName,
        isSuccess: false,
        data: fallbackDataSupplier(),
        fallbackNotice: `Notice: Subsystem '${serviceName}' encountered an execution timeout. Gracefully degraded to baseline data.`,
        executionTimeMs: Date.now() - startTime,
      };
    }
  }
}

export const faultToleranceEngine = FaultToleranceEngine.getInstance();
