/**
 * FinTrack Pro — Upstash Redis Cache & Graceful Degradation Layer
 * 
 * Configured via UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
 * Degrades gracefully to an in-memory Map when Upstash Redis is unconfigured or unreachable.
 */

export class UpstashRedisCache {
  private static instance: UpstashRedisCache;
  private inMemoryCache: Map<string, { value: string; expiresAt: number | null }> = new Map();

  private constructor() {}

  public static getInstance(): UpstashRedisCache {
    if (!UpstashRedisCache.instance) {
      UpstashRedisCache.instance = new UpstashRedisCache();
    }
    return UpstashRedisCache.instance;
  }

  /**
   * Retrieves string value from Redis or local degraded memory cache.
   */
  public async get(key: string): Promise<string | null> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      try {
        const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          return data.result ?? null;
        }
      } catch (err) {
        console.warn('[Upstash Redis] Fetch error, falling back to local memory:', err);
      }
    }

    // In-memory fallback lookup
    const cached = this.inMemoryCache.get(key);
    if (!cached) return null;
    if (cached.expiresAt && Date.now() > cached.expiresAt) {
      this.inMemoryCache.delete(key);
      return null;
    }
    return cached.value;
  }

  /**
   * Sets key-value pair with TTL in seconds.
   */
  public async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      try {
        const endpoint = ttlSeconds
          ? `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/EX/${ttlSeconds}`
          : `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`;
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('[Upstash Redis] Set error, falling back to local memory:', err);
      }
    }

    // In-memory fallback storage
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.inMemoryCache.set(key, { value, expiresAt });
    return true;
  }

  /**
   * Rate limiting counter helper (INCR with TTL).
   */
  public async incrementRateLimit(key: string, windowSeconds = 60): Promise<{ count: number; allowed: boolean }> {
    const current = await this.get(key);
    const count = (current ? parseInt(current, 10) : 0) + 1;
    await this.set(key, count.toString(), windowSeconds);
    const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
    return { count, allowed: count <= limit };
  }
}

export const upstashRedis = UpstashRedisCache.getInstance();
