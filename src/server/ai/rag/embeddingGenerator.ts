// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 3: Embedding Generation Engine
// =======================================================

export class EmbeddingGenerator {
  private static instance: EmbeddingGenerator;
  private readonly VECTOR_DIMENSION = 384; // Standard embedding vector size

  private constructor() {}

  public static getInstance(): EmbeddingGenerator {
    if (!EmbeddingGenerator.instance) {
      EmbeddingGenerator.instance = new EmbeddingGenerator();
    }
    return EmbeddingGenerator.instance;
  }

  /**
   * Generates deterministic dense vector embedding for text
   */
  public generateEmbedding(text: string): number[] {
    const vector: number[] = new Array(this.VECTOR_DIMENSION).fill(0);
    const words = text.toLowerCase().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const idx = (charCode * (j + 1) * (i + 1)) % this.VECTOR_DIMENSION;
        vector[idx] += 0.01;
      }
    }

    // L2 Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1.0;
    return vector.map((val) => Number((val / magnitude).toFixed(6)));
  }
}

export const embeddingGenerator = EmbeddingGenerator.getInstance();
