import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';

async function startEmbeddedDatabase() {
  const dbDir = path.resolve('./.embedded_pg');
  console.log('=====================================================');
  console.log('🐘 STARTING EMBEDDED POSTGRESQL DATABASE ENGINE');
  console.log(`📁 Database Location: ${dbDir}`);
  console.log('=====================================================\n');

  const pg = new EmbeddedPostgres({
    port: 5432,
    databaseDir: dbDir,
    user: 'fintrack_dev',
    password: 'fintrack_dev_pass',
    persistent: true,
  });

  try {
    await pg.initialise();
  } catch (err: any) {
    // Initialized already
  }

  await pg.start();

  try {
    await pg.createDatabase('fintrack_db');
  } catch (err: any) {
    // Database created
  }

  console.log('=====================================================');
  console.log('✅ EMBEDDED POSTGRESQL READY ON LOCALHOST:5432');
  console.log('=====================================================\n');

  // Keep process active
  await new Promise(() => {});
}

startEmbeddedDatabase().catch((err) => {
  console.error('❌ Failed to start embedded PostgreSQL database:', err);
});
