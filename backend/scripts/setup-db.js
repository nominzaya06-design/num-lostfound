import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db/pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '../sql/schema.sql');

try {
  const schema = await fs.readFile(schemaPath, 'utf8');
  await pool.query(schema);
  console.log('Database schema created.');
} catch (error) {
  console.error('Database setup failed.');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
