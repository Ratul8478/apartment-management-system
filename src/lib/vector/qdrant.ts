import { env } from '../config/env';

/**
 * FinTrack Pro — Qdrant Cloud Vector Database Client Helper
 * 
 * Provides vector embedding search & retrieval interface for AI similarity queries.
 */

export interface QdrantConfig {
  url: string;
  apiKey: string;
}

export function getQdrantConfig(): QdrantConfig {
  return {
    url: process.env.QDRANT_URL || env.QDRANT_URL || 'https://demo.cloud.qdrant.io:6333',
    apiKey: process.env.QDRANT_API_KEY || env.QDRANT_API_KEY || 'demo-key',
  };
}

export async function searchQdrantVector(collection: string, vector: number[], limit = 5): Promise<unknown> {
  const config = getQdrantConfig();
  const endpoint = `${config.url}/collections/${collection}/points/search`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.apiKey,
    },
    body: JSON.stringify({
      vector,
      limit,
      with_payload: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`Qdrant vector search failed with HTTP status ${res.status}`);
  }

  return res.json();
}
