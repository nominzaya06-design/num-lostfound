import { ApiError } from '../utils/apiError.js';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

export function sameOriginGuard(req, _res, next) {
  if (SAFE_METHODS.includes(req.method)) return next();

  const origin = req.get('origin');
  if (!origin) return next();

  try {
    const originUrl = new URL(origin);
    const host = req.get('host');
    if (originUrl.host !== host) {
      return next(new ApiError(403, 'Cross-site request blocked.'));
    }
  } catch (_error) {
    return next(new ApiError(403, 'Invalid request origin.'));
  }

  next();
}
