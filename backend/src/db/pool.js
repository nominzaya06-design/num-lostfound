import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set.');
}

const usesRemotePostgres =
  env.databaseUrl.includes('render.com') ||
  env.databaseUrl.includes('sslmode=require');

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: usesRemotePostgres
    ? { rejectUnauthorized: false }
    : false
});

export function query(text, params) {
  return pool.query(text, params);
}