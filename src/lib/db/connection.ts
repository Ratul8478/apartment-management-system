import { prismaClient } from './client';
import { dbLogger } from './logger';

/**
 * FinTrack Pro — Database Connection Manager
 * 
 * Manages database connection lifecycle, connection pooling health checks,
 * ping latency tests, reconnection policies, and graceful process shutdown handlers.
 */

export interface ConnectionPoolStatus {
  isConnected: boolean;
  pingLatencyMs: number | null;
  lastConnectedAt: Date | null;
  reconnectAttempts: number;
}

export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private isConnected = false;
  private lastConnectedAt: Date | null = null;
  private reconnectAttempts = 0;
  private isShuttingDown = false;

  private constructor() {
    this.registerShutdownHandlers();
  }

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  /**
   * Initializes connection to PostgreSQL database with retries.
   */
  public async initializeConnection(maxRetries = 3, retryDelayMs = 2000): Promise<boolean> {
    if (this.isConnected) {
      return true;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        dbLogger.logConnection(`Attempting database connection (Attempt ${attempt}/${maxRetries})...`);
        await prismaClient.$connect();
        
        // Execute raw ping to confirm database readiness
        await prismaClient.$queryRaw`SELECT 1 as ping`;

        this.isConnected = true;
        this.lastConnectedAt = new Date();
        this.reconnectAttempts = 0;

        dbLogger.logConnection('✅ Database connection established successfully.');
        return true;
      } catch (error) {
        this.reconnectAttempts = attempt;
        dbLogger.logConnectionError(
          `❌ Database connection failed on attempt ${attempt}/${maxRetries}:`,
          error
        );

        if (attempt < maxRetries) {
          dbLogger.logConnection(`Waiting ${retryDelayMs}ms before retrying...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
      }
    }

    dbLogger.logConnectionError(
      '❌ FATAL: Unable to establish database connection after max retries.',
      new Error('Connection failure')
    );
    return false;
  }

  /**
   * Performs lightweight ping check (`SELECT 1`).
   */
  public async ping(): Promise<number | null> {
    const startTime = Date.now();
    try {
      await prismaClient.$queryRaw`SELECT 1 as ping`;
      return Date.now() - startTime;
    } catch (error) {
      dbLogger.logConnectionError('Database ping check failed', error);
      this.isConnected = false;
      return null;
    }
  }

  /**
   * Returns current connection status metadata.
   */
  public async getStatus(): Promise<ConnectionPoolStatus> {
    const pingLatencyMs = await this.ping();
    this.isConnected = pingLatencyMs !== null;

    return {
      isConnected: this.isConnected,
      pingLatencyMs,
      lastConnectedAt: this.lastConnectedAt,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Disconnects Prisma Client safely.
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected && !global.globalPrisma) {
      return;
    }

    try {
      dbLogger.logConnection('Disconnecting database client pool...');
      await prismaClient.$disconnect();
      this.isConnected = false;
      dbLogger.logConnection('Database client pool disconnected.');
    } catch (error) {
      dbLogger.logConnectionError('Error during database disconnect', error);
    }
  }

  /**
   * Registers OS signal listeners (SIGINT, SIGTERM) to execute graceful shutdown.
   */
  private registerShutdownHandlers(): void {
    if (typeof process === 'undefined') return;

    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;

      dbLogger.logConnection(`Received ${signal}. Initiating graceful database connection shutdown...`);
      await this.disconnect();
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  }
}

export const connectionManager = DatabaseConnectionManager.getInstance();
