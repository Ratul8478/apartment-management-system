/**
 * FinTrack Pro — Enterprise Database Logger
 * 
 * Provides structured JSON logging for database queries, connection events,
 * slow queries, transaction events, and database errors. Implements automatic
 * parameter masking to ensure sensitive financial data and secrets are never leaked into log streams.
 */

export enum DbLogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface DbLogPayload {
  timestamp: string;
  level: DbLogLevel;
  category: 'query' | 'connection' | 'transaction' | 'migration' | 'health' | 'error';
  message: string;
  durationMs?: number;
  target?: string;
  query?: string;
  params?: Record<string, unknown> | string;
  error?: string;
  meta?: Record<string, unknown>;
}

// Sensitive field keys that must be redacted in query logs
const SENSITIVE_KEYS = new Set([
  'password',
  'password_hash',
  'mfa_secret',
  'jwt_secret',
  'nextauth_secret',
  'token',
  'access_token',
  'secret',
  'api_key',
  'ssn',
  'card_number',
  'bank_account_number',
]);

export class DatabaseLogger {
  private static instance: DatabaseLogger;
  private readonly slowQueryThresholdMs: number;

  private constructor() {
    this.slowQueryThresholdMs = Number(process.env.DB_SLOW_QUERY_THRESHOLD_MS) || 200;
  }

  public static getInstance(): DatabaseLogger {
    if (!DatabaseLogger.instance) {
      DatabaseLogger.instance = new DatabaseLogger();
    }
    return DatabaseLogger.instance;
  }

  /**
   * Masks sensitive fields in query parameters or objects before logging.
   */
  public maskSensitiveData(data: unknown): unknown {
    if (data === null || data === undefined) return data;

    if (typeof data === 'string') {
      // Basic heuristic for connection strings or token strings
      if (data.includes('postgres://') || data.includes('postgresql://')) {
        return data.replace(/(postgresql?:\/\/[^:]+:)[^@]+(@.+)/, '$1[REDACTED]$2');
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.maskSensitiveData(item));
    }

    if (typeof data === 'object') {
      const maskedObj: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        if (SENSITIVE_KEYS.has(key.toLowerCase())) {
          maskedObj[key] = '[REDACTED_SENSITIVE_FIELD]';
        } else if (typeof value === 'object' && value !== null) {
          maskedObj[key] = this.maskSensitiveData(value);
        } else {
          maskedObj[key] = value;
        }
      }
      return maskedObj;
    }

    return data;
  }

  /**
   * Emits a structured log payload to console standard output or error stream.
   */
  private emit(payload: DbLogPayload): void {
    const formattedPayload = {
      ...payload,
      timestamp: new Date().toISOString(),
      params: payload.params ? this.maskSensitiveData(payload.params) : undefined,
    };

    const output = JSON.stringify(formattedPayload);

    switch (payload.level) {
      case DbLogLevel.ERROR:
        console.error(output);
        break;
      case DbLogLevel.WARN:
        console.warn(output);
        break;
      case DbLogLevel.INFO:
      case DbLogLevel.DEBUG:
      default:
        console.log(output);
        break;
    }
  }

  public logQuery(query: string, durationMs: number, target?: string): void {
    const isSlow = durationMs >= this.slowQueryThresholdMs;
    const level = isSlow ? DbLogLevel.WARN : DbLogLevel.DEBUG;
    const message = isSlow
      ? `[SLOW QUERY DETECTED] Query took ${durationMs}ms (Threshold: ${this.slowQueryThresholdMs}ms)`
      : `Database Query Executed (${durationMs}ms)`;

    this.emit({
      timestamp: '',
      level,
      category: 'query',
      message,
      durationMs,
      target,
      query: this.maskSensitiveData(query) as string,
    });
  }

  public logConnection(message: string, meta?: Record<string, unknown>): void {
    this.emit({
      timestamp: '',
      level: DbLogLevel.INFO,
      category: 'connection',
      message,
      meta,
    });
  }

  public logConnectionError(message: string, error: Error | unknown): void {
    this.emit({
      timestamp: '',
      level: DbLogLevel.ERROR,
      category: 'connection',
      message,
      error: error instanceof Error ? error.message : String(error),
      meta: error instanceof Error && error.stack ? { stack: error.stack } : undefined,
    });
  }

  public logTransaction(message: string, durationMs?: number, meta?: Record<string, unknown>): void {
    this.emit({
      timestamp: '',
      level: DbLogLevel.INFO,
      category: 'transaction',
      message,
      durationMs,
      meta,
    });
  }

  public logTransactionError(message: string, error: Error | unknown, durationMs?: number): void {
    this.emit({
      timestamp: '',
      level: DbLogLevel.ERROR,
      category: 'transaction',
      message,
      durationMs,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  public logHealth(message: string, isHealthy: boolean, meta?: Record<string, unknown>): void {
    this.emit({
      timestamp: '',
      level: isHealthy ? DbLogLevel.INFO : DbLogLevel.ERROR,
      category: 'health',
      message,
      meta,
    });
  }
}

export const dbLogger = DatabaseLogger.getInstance();
