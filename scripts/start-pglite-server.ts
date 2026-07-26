import { PGlite } from '@electric-sql/pglite';
import { createServer } from 'pg-gateway';
import path from 'path';

async function startServer() {
  const dbDir = path.join(__dirname, '../.pglite_data');
  console.log(`Initializing PGlite database in local workspace: ${dbDir}`);

  const db = new PGlite(dbDir);
  await db.waitReady;

  // Create extension 'uuid-ossp' if needed
  try {
    await db.exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await db.exec(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
  } catch (err) {
    // Ignore extensions if already loaded
  }

  const server = createServer(async (connection) => {
    connection.on('startup', () => {
      connection.sendAuthenticationOk();
      connection.sendParameterStatus('server_version', '16.0');
      connection.sendParameterStatus('client_encoding', 'UTF8');
      connection.sendReadyForQuery();
    });

    connection.on('query', async (query) => {
      try {
        const res = await db.query(query.text);
        const fields = res.fields.map((f) => ({
          name: f.name,
          dataTypeID: f.dataTypeID || 25,
        }));
        const rows = res.rows.map((row: any) =>
          Object.values(row).map((v) => (v === null || v === undefined ? null : String(v)))
        );

        connection.sendRowDescription(fields as any);
        for (const row of rows) {
          connection.sendDataRow(row as any);
        }
        connection.sendCommandComplete(query.text.split(' ')[0].toUpperCase());
      } catch (err: any) {
        connection.sendErrorResponse({
          severity: 'ERROR',
          code: '42000',
          message: err.message || 'Query execution failed',
        });
      } finally {
        connection.sendReadyForQuery();
      }
    });
  });

  server.listen(5432, () => {
    console.log('✅ PGlite PostgreSQL Server running on localhost:5432');
  });
}

startServer().catch(console.error);
