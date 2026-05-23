import { env } from '../config/env.js';
import { findUserBySessionToken } from '../utils/session.js';
import { ApiError } from '../utils/apiError.js';

export async function attachUser(req, _res, next) {
  try {
    const token = req.cookies?.[env.sessionCookieName];
    req.user = await findUserBySessionToken(token);
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(req, _res, next) {
  if (!req.user) return next(new ApiError(401, 'Authentication required.'));
  next();
}

export function requireAdmin(req, _res, next) {
  if (!req.user) return next(new ApiError(401, 'Authentication required.'));
  if (req.user.role !== 'admin') return next(new ApiError(403, 'Admin access required.'));
  next();
}
