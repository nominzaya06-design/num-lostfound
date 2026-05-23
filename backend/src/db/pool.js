import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set.');
}

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl.includes('render.com')
    ? { rejectUnauthorized: false }
    : false
});