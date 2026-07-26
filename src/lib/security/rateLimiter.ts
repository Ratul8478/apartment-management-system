/**
 * Sliding Window Rate Limiter for public-facing endpoints
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
    if (record.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}, 60000);

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = memoryStore.get(identifier) || { timestamps: [] };

  // Filter out timestamps older than the window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const resetMs = windowMs - (now - oldest);
    return {
      success: false,
      remaining: 0,
      resetMs,
    };
  }

  validTimestamps.push(now);
  memoryStore.set(identifier, { timestamps: validTimestamps });

  return {
    success: true,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs,
  };
}
