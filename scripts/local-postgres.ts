import net from 'node:net';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { fromNodeSocket } from 'pg-gateway/node';

async function startLocalPostgres() {
  const dataDir = path.join(__dirname, '../.pglite_data');
  console.log(`Starting embedded PostgreSQL database in: ${dataDir}`);

  const db = new PGlite(dataDir);
  await db.waitReady;

  try {
    await db.exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await db.exec(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
  } catch (err) {
    // extensions ok
  }

  const server = net.createServer(async (socket) => {
    try {
      const conn = await fromNodeSocket(socket, {
        async onQuery(query) {
          try {
            const res = await db.query(query.text);
            return res;
          } catch (err: any) {
            console.error('Database query error:', err.message);
            throw err;
          }
        },
      });

      await conn.listen();
    } catch (err) {
      // socket disconnected
    }
  });

  server.listen(5432, () => {
    console.log('=====================================================');
    console.log('✅ EMBEDDED POSTGRESQL SERVER RUNNING ON LOCALHOST:5432');
    console.log('=====================================================');
  });
}

startLocalPostgres().catch((err) => {
  console.error('❌ Failed to start local database:', err);
});
