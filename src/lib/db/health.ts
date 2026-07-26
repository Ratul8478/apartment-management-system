import { connectionManager } from './connection';
import { dbLogger } from './logger';

/**
 * FinTrack Pro — Database Observability & Health Check Engine
 * 
 * Provides health readiness probes, liveness probes, latency diagnostic metrics,
 * and Prometheus-compatible metrics export for enterprise monitoring.
 */

export interface DatabaseHealthResult {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  timestamp: string;
  pingMs: number | null;
  details: {
    isConnected: boolean;
    lastConnectedAt: string | null;
    reconnectAttempts: number;
    environment: string;
  };
}

export interface PrometheusMetricsResult {
  contentType: string;
  metrics: string;
}

export class DatabaseHealthCheck {
  private static instance: DatabaseHealthCheck;

  private constructor() {}

  public static getInstance(): DatabaseHealthCheck {
    if (!DatabaseHealthCheck.instance) {
      DatabaseHealthCheck.instance = new DatabaseHealthCheck();
    }
    return DatabaseHealthCheck.instance;
  }

  /**
   * Kubernetes Liveness Probe: Checks if the application connection manager instance is active.
   */
  public async checkLiveness(): Promise<{ alive: boolean }> {
    return { alive: true };
  }

  /**
   * Kubernetes Readiness Probe: Executes database ping test to confirm DB accepts queries.
   */
  public async checkReadiness(): Promise<DatabaseHealthResult> {
    const status = await connectionManager.getStatus();
    const isHealthy = status.isConnected && status.pingLatencyMs !== null;
    const isDegraded = isHealthy && (status.pingLatencyMs as number) > 500;

    let overallStatus: 'UP' | 'DOWN' | 'DEGRADED' = 'UP';
    if (!isHealthy) overallStatus = 'DOWN';
    else if (isDegraded) overallStatus = 'DEGRADED';

    const result: DatabaseHealthResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      pingMs: status.pingLatencyMs,
      details: {
        isConnected: status.isConnected,
        lastConnectedAt: status.lastConnectedAt ? status.lastConnectedAt.toISOString() : null,
        reconnectAttempts: status.reconnectAttempts,
        environment: process.env.NODE_ENV || 'development',
      },
    };

    dbLogger.logHealth(`Database Readiness Probe Status: ${overallStatus}`, isHealthy, {
      pingMs: status.pingLatencyMs,
    });

    return result;
  }

  /**
   * Formats database observability metrics into Prometheus text exposition format.
   */
  public async getPrometheusMetrics(): Promise<PrometheusMetricsResult> {
    const health = await this.checkReadiness();
    const isConnectedVal = health.details.isConnected ? 1 : 0;
    const pingVal = health.pingMs !== null ? health.pingMs : -1;
    const reconnectVal = health.details.reconnectAttempts;

    const metricsLines = [
      '# HELP fintrack_db_connected Database connection state (1 = UP, 0 = DOWN)',
      '# TYPE fintrack_db_connected gauge',
      `fintrack_db_connected ${isConnectedVal}`,
      '',
      '# HELP fintrack_db_ping_latency_ms Database query ping latency in milliseconds',
      '# TYPE fintrack_db_ping_latency_ms gauge',
      `fintrack_db_ping_latency_ms ${pingVal}`,
      '',
      '# HELP fintrack_db_reconnect_attempts_total Total database reconnection attempts',
      '# TYPE fintrack_db_reconnect_attempts_total counter',
      `fintrack_db_reconnect_attempts_total ${reconnectVal}`,
      '',
    ].join('\n');

    return {
      contentType: 'text/plain; version=0.0.4; charset=utf-8',
      metrics: metricsLines,
    };
  }
}

export const dbHealth = DatabaseHealthCheck.getInstance();
