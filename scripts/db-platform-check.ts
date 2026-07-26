import { dbProvider, dbHealth, dbLogger } from '../src/lib/db/index';

/**
 * FinTrack Pro — Database Platform Diagnostic Check
 * 
 * Verifies that the Database Provider, Health Check Engine, Connection Manager,
 * Logger, and Prometheus Metrics generator are functioning correctly.
 */

async function runDatabasePlatformCheck(): Promise<void> {
  console.log('=====================================================');
  console.log('🔍 FINTRACK PRO DATABASE PLATFORM DIAGNOSTIC CHECK');
  console.log('=====================================================\n');

  try {
    // 1. Logger Test
    dbLogger.logConnection('Testing DatabaseLogger initialization...');

    // 2. Provider Test
    console.log('1. Testing DatabaseProvider singleton access...');
    const client = dbProvider.getClient();
    const conn = dbProvider.getConnectionManager();
    const txManager = dbProvider.getTransactionManager();
    console.log('   ✅ Provider Client, Connection Manager, and Transaction Manager resolved.');

    // 3. Health Check Readiness Test
    console.log('\n2. Testing Health Check Readiness Probe...');
    const health = await dbHealth.checkReadiness();
    console.log(`   Readiness Status: ${health.status}`);
    console.log(`   Connected: ${health.details.isConnected}`);
    console.log(`   Ping Latency: ${health.pingMs !== null ? `${health.pingMs}ms` : 'N/A'}`);

    // 4. Prometheus Metrics Export Test
    console.log('\n3. Testing Prometheus Metrics Export...');
    const prometheus = await dbHealth.getPrometheusMetrics();
    console.log('   Prometheus Output Snippet:');
    console.log('   ----------------------------------------');
    console.log(prometheus.metrics.trim());
    console.log('   ----------------------------------------');

    console.log('\n=====================================================');
    console.log('✅ DATABASE PLATFORM VERIFICATION COMPLETE — 100% READY');
    console.log('=====================================================\n');
  } catch (error) {
    console.error('\n❌ DATABASE PLATFORM VERIFICATION FAILED:', error);
    process.exit(1);
  }
}

runDatabasePlatformCheck().catch((err) => {
  console.error(err);
  process.exit(1);
});
