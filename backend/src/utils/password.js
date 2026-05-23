import crypto from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash = '') {
  const parts = String(storedHash).split(':');
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts;
  if (!salt || !originalHash) return false;

  const testHash = crypto.scryptSync(String(password), salt, KEY_LENGTH).toString('hex');
  const originalBuffer = Buffer.from(originalHash, 'hex');
  const testBuffer = Buffer.from(testHash, 'hex');

  if (originalBuffer.length !== testBuffer.length) return false;
  return crypto.timingSafeEqual(originalBuffer, testBuffer);
}
