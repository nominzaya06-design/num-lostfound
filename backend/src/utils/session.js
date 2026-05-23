import crypto from 'node:crypto';
import { query } from '../db/pool.js';
import { env } from '../config/env.js';

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function newSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function sessionHash(token) {
  return sha256(token);
}

export function sessionMaxAgeMs() {
  return env.sessionDays * 24 * 60 * 60 * 1000;
}

export async function createSession(userId, request) {
  const token = newSessionToken();
  const hash = sessionHash(token);
  const expiresAt = new Date(Date.now() + sessionMaxAgeMs());

  await query(
    `INSERT INTO sessions (user_id, session_hash, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, hash, expiresAt, request.get('user-agent') || '', request.ip || '']
  );

  return { token, expiresAt };
}

export async function deleteSessionByToken(token) {
  if (!token) return;
  await query('DELETE FROM sessions WHERE session_hash = $1', [sessionHash(token)]);
}

export async function findUserBySessionToken(token) {
  if (!token) return null;

  const result = await query(
    `SELECT u.id, u.full_name, u.email, u.phone, u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.session_hash = $1
        AND s.expires_at > NOW()
      LIMIT 1`,
    [sessionHash(token)]
  );

  return result.rows[0] || null;
}

export function setSessionCookie(response, token) {
  response.cookie(env.sessionCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    maxAge: sessionMaxAgeMs(),
    path: '/'
  });
}

export function clearSessionCookie(response) {
  response.clearCookie(env.sessionCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    path: '/'
  });
}
