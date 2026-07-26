import { PrismaClient, Prisma } from '@prisma/client';
import { dbLogger } from './logger';

/**
 * FinTrack Pro — Enterprise Singleton Prisma Client Architecture
 * 
 * Provides a managed, single-instance Prisma Client across Next.js 15 server runtimes.
 * Prevents connection pool exhaustion caused by Hot Module Replacement (HMR) during
 * local development, attaches event-driven query loggers, and measures slow query latency.
 */

declare global {
  // Prevent multiple instances of Prisma Client in development Node process
  // eslint-disable-next-line no-var
  var globalPrisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const isDev = process.env.NODE_ENV === 'development';

  const client = new PrismaClient({
    log: isDev
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
          { emit: 'event', level: 'info' },
        ]
      : [
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ],
  });

  // Attach query duration event listener
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (client as any).$on('query', (e: Prisma.QueryEvent) => {
    dbLogger.logQuery(e.query, e.duration, e.target);
  });

  // Attach error event listener
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (client as any).$on('error', (e: Prisma.LogEvent) => {
    dbLogger.logConnectionError(`Prisma Engine Error: ${e.message}`, e);
  });

  // Attach warn event listener
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (client as any).$on('warn', (e: Prisma.LogEvent) => {
    dbLogger.logConnection(`Prisma Engine Warning: ${e.message}`);
  });

  return client;
}

/**
 * Enterprise Singleton Prisma Client Export.
 * Uses global scope attachment in development to survive HMR module re-evaluations.
 */
export const prismaClient: PrismaClient =
  global.globalPrisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.globalPrisma = prismaClient;
}

export type { PrismaClient };
