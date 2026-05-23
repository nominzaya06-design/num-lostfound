import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:0880@localhost:5432/lostfound_db',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'lf_sid',
  sessionDays: Number(process.env.SESSION_DAYS || 7),
  cookieSecure: String(process.env.COOKIE_SECURE || 'false') === 'true'
};
