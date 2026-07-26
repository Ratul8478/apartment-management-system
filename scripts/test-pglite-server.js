const net = require('node:net');
const { PGlite } = require('@electric-sql/pglite');
const { fromNodeSocket } = require('pg-gateway/node');
const { BackendMessageCode, BufferWriter } = require('pg-gateway');

async function main() {
  console.log('Initializing in-memory PGlite instance...');

  const db = new PGlite();
  await db.waitReady;

  try {
    await db.exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await db.exec(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
  } catch (err) {}

  const server = net.createServer(async (socket) => {
    try {
      const conn = await fromNodeSocket(socket, {
        async onQuery(queryStr) {
          try {
            const res = await db.query(queryStr);
            const writer = new BufferWriter();

            // 1. RowDescription
            const fields = res.fields || [];
            writer.addInt16(fields.length);
            for (const f of fields) {
              writer.addCString(f.name);
              writer.addInt32(0);
              writer.addInt16(0);
              writer.addInt32(f.dataTypeID || 25);
              writer.addInt16(-1);
              writer.addInt32(-1);
              writer.addInt16(0);
            }
            const rowDescMsg = writer.flush(BackendMessageCode.RowDescriptionMessage);

            // 2. DataRows
            const rowsMsgs = [];
            const rows = res.rows || [];
            for (const row of rows) {
              const rowWriter = new BufferWriter();
              const values = Object.values(row);
              rowWriter.addInt16(values.length);
              for (const val of values) {
                if (val === null || val === undefined) {
                  rowWriter.addInt32(-1);
                } else {
                  const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
                  const buf = Buffer.from(str, 'utf8');
                  rowWriter.addInt32(buf.length);
                  rowWriter.add(buf);
                }
              }
              rowsMsgs.push(rowWriter.flush(BackendMessageCode.DataRow));
            }

            // 3. CommandComplete
            const cmdTag = queryStr.trim().split(/\s+/)[0].toUpperCase();
            const cmdWriter = new BufferWriter();
            cmdWriter.addCString(`${cmdTag} ${rows.length}`);
            const cmdMsg = cmdWriter.flush(BackendMessageCode.CommandComplete);

            // Combine bytes
            const totalLen = rowDescMsg.length + rowsMsgs.reduce((a, b) => a + b.length, 0) + cmdMsg.length;
            const result = new Uint8Array(totalLen);
            let offset = 0;
            result.set(rowDescMsg, offset);
            offset += rowDescMsg.length;
            for (const rMsg of rowsMsgs) {
              result.set(rMsg, offset);
              offset += rMsg.length;
            }
            result.set(cmdMsg, offset);
            return result;
          } catch (err) {
            console.error('Query execution error:', err.message);
            const errWriter = new BufferWriter();
            errWriter.addCString('SERROR');
            errWriter.addCString('C42000');
            errWriter.addCString(`M${err.message || 'Query error'}`);
            errWriter.addCString('');
            return errWriter.flush(BackendMessageCode.ErrorMessage);
          }
        },
      });

      await conn.listen();
    } catch (err) {}
  });

  server.listen(5432, () => {
    console.log('=====================================================');
    console.log('✅ IN-MEMORY POSTGRESQL SERVER RUNNING ON PORT 5432');
    console.log('=====================================================');
  });
}

main().catch(console.error);
