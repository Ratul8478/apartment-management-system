// In-memory / serverless cache wrapper with Redis fallback fallback semantics
const memoryStore = new Map<string, { value: any; expiresAt: number }>();

export const redis = {
  async get<T>(key: string): Promise<T | null> {
    const item = memoryStore.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return item.value as T;
  },

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    memoryStore.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },

  async del(key: string): Promise<void> {
    memoryStore.delete(key);
  },

  async clearPrefix(prefix: string): Promise<void> {
    for (const key of memoryStore.keys()) {
      if (key.startsWith(prefix)) {
        memoryStore.delete(key);
      }
    }
  },
};
