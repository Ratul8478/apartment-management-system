import { PrismaClient, prismaClient } from './client';
import { DatabaseConnectionManager, connectionManager } from './connection';
import { TransactionManager, transactionManager } from './transaction';
import { DatabaseLogger, dbLogger } from './logger';

/**
 * FinTrack Pro — Enterprise Database Provider
 * 
 * Provides a unified dependency injection root for all database platform services.
 * Isolates domain services from ORM concrete implementations and centralizes database access.
 */

export class DatabaseProvider {
  private static instance: DatabaseProvider;

  private constructor() {}

  public static getInstance(): DatabaseProvider {
    if (!DatabaseProvider.instance) {
      DatabaseProvider.instance = new DatabaseProvider();
    }
    return DatabaseProvider.instance;
  }

  public getClient(): PrismaClient {
    return prismaClient;
  }

  public getConnectionManager(): DatabaseConnectionManager {
    return connectionManager;
  }

  public getTransactionManager(): TransactionManager {
    return transactionManager;
  }

  public getLogger(): DatabaseLogger {
    return dbLogger;
  }

  /**
   * Initializes the database platform services at container boot.
   */
  public async initialize(): Promise<boolean> {
    dbLogger.logConnection('Initializing Database Platform Provider...');
    const isConnected = await connectionManager.initializeConnection();

    if (isConnected) {
      dbLogger.logConnection('✅ Database Platform Provider fully initialized.');
    } else {
      dbLogger.logConnectionError(
        '❌ FATAL: Database Platform Provider initialization failed.',
        new Error('Database initialization error')
      );
    }

    return isConnected;
  }

  /**
   * Gracefully shuts down database platform connection pools.
   */
  public async shutdown(): Promise<void> {
    dbLogger.logConnection('Shutting down Database Platform Provider...');
    await connectionManager.disconnect();
    dbLogger.logConnection('Database Platform Provider shutdown complete.');
  }
}

export const dbProvider = DatabaseProvider.getInstance();
