// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 5: Concept & Data Drift Detector Engine
// =======================================================

export class DriftDetector {
  private static instance: DriftDetector;

  private constructor() {}

  public static getInstance(): DriftDetector {
    if (!DriftDetector.instance) {
      DriftDetector.instance = new DriftDetector();
    }
    return DriftDetector.instance;
  }

  /**
   * Monitors prediction and feature drift
   */
  public evaluateDrift(observedValues: number[], predictedValues: number[]): { hasDriftDetected: boolean; driftScore: number } {
    if (observedValues.length === 0 || predictedValues.length === 0) {
      return { hasDriftDetected: false, driftScore: 0.05 };
    }

    let errorSum = 0;
    const len = Math.min(observedValues.length, predictedValues.length);
    for (let i = 0; i < len; i++) {
      errorSum += Math.abs(observedValues[i] - predictedValues[i]) / (observedValues[i] || 1);
    }

    const driftScore = Number((errorSum / len).toFixed(4));
    return {
      hasDriftDetected: driftScore > 0.15, // Threshold = 15% drift
      driftScore,
    };
  }
}

export const driftDetector = DriftDetector.getInstance();
