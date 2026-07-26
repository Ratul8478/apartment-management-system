import { PrismaClient, Prisma } from '@prisma/client';
import { prismaClient } from './client';
import { dbLogger } from './logger';

/**
 * FinTrack Pro — Enterprise Transaction Manager
 * 
 * Manages ACID compliant transactions across financial data operations.
 * Supports interactive transactions, explicit isolation levels, timeout safeguards,
 * and automatic retry policies for serialization deadlocks (PostgreSQL P2034).
 */

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export interface TransactionOptions {
  maxWaitMs?: number;      // Max time to wait to acquire transaction lock (default 2000ms)
  timeoutMs?: number;      // Max execution duration of transaction (default 5000ms)
  isolationLevel?: Prisma.TransactionIsolationLevel;
  maxRetries?: number;     // Max retries on serialization failure (default 3)
}

export class TransactionManager {
  private static instance: TransactionManager;

  private constructor() {}

  public static getInstance(): TransactionManager {
    if (!TransactionManager.instance) {
      TransactionManager.instance = new TransactionManager();
    }
    return TransactionManager.instance;
  }

  /**
   * Executes a callback function inside an interactive Prisma database transaction.
   * Automatically retries on serialization failure or deadlock up to `maxRetries`.
   */
  public async executeTransaction<T>(
    fn: (tx: TransactionClient) => Promise<T>,
    options: TransactionOptions = {}
  ): Promise<T> {
    const {
      maxWaitMs = 2000,
      timeoutMs = 5000,
      isolationLevel = Prisma.TransactionIsolationLevel.Serializable,
      maxRetries = 3,
    } = options;

    const startTime = Date.now();
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      try {
        dbLogger.logTransaction(`Starting interactive transaction (Attempt ${attempt}/${maxRetries})...`);

        const result = await prismaClient.$transaction(
          async (tx) => {
            return await fn(tx as TransactionClient);
          },
          {
            maxWait: maxWaitMs,
            timeout: timeoutMs,
            isolationLevel,
          }
        );

        const durationMs = Date.now() - startTime;
        dbLogger.logTransaction('✅ Transaction committed successfully.', durationMs);
        return result;
      } catch (error) {
        const durationMs = Date.now() - startTime;
        const isSerializationFailure = this.isRetryableError(error);

        if (isSerializationFailure && attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 100 + Math.random() * 50;
          dbLogger.logTransactionError(
            `Serialization failure encountered. Retrying transaction in ${Math.round(backoffMs)}ms (Attempt ${attempt}/${maxRetries})...`,
            error,
            durationMs
          );
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }

        dbLogger.logTransactionError(
          `❌ Transaction failed & rolled back (Attempt ${attempt}/${maxRetries}):`,
          error,
          durationMs
        );
        throw error;
      }
    }

    throw new Error(`Transaction failed after ${maxRetries} execution attempts.`);
  }

  /**
   * Identifies if an error is a retryable serialization error or deadlock (Prisma P2034).
   */
  private isRetryableError(error: unknown): boolean {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      // Prisma P2034: Transaction failed due to a write conflict or deadlock
      return (error as { code: string }).code === 'P2034';
    }
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      return (
        msg.includes('serialization failure') ||
        msg.includes('deadlock detected') ||
        msg.includes('could not serialize access')
      );
    }
    return false;
  }
}

export const transactionManager = TransactionManager.getInstance();
