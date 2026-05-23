import { query } from '../db/pool.js';
import { ApiError } from '../utils/apiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { createSession, deleteSessionByToken, setSessionCookie, clearSessionCookie } from '../utils/session.js';
import { env } from '../config/env.js';
import { validateLogin, validateRegister } from '../validators/auth.validator.js';
import { validationError } from '../middleware/validate.js';

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.full_name || user.fullName,
    email: user.email,
    phone: user.phone || '',
    role: user.role
  };
}

export async function register(req, res, next) {
  try {
    const { data, errors } = validateRegister(req.body);
    if (errors.length) throw validationError(errors);

    const passwordHash = hashPassword(data.password);
    const result = await query(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, 'student')
       RETURNING id, full_name, email, phone, role`,
      [data.fullName, data.email, passwordHash, data.phone]
    );

    const session = await createSession(result.rows[0].id, req);
    setSessionCookie(res, session.token);
    res.status(201).json({ ok: true, user: publicUser(result.rows[0]) });
  } catch (error) {
    if (error.code === '23505') return next(new ApiError(409, 'Email is already registered.'));
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { data, errors } = validateLogin(req.body);
    if (errors.length) throw validationError(errors);

    const result = await query('SELECT * FROM users WHERE email = $1', [data.email]);
    const user = result.rows[0];

    if (!user || !verifyPassword(data.password, user.password_hash)) {
      throw new ApiError(401, 'Email or password is incorrect.');
    }

    const session = await createSession(user.id, req);
    setSessionCookie(res, session.token);
    res.json({ ok: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await deleteSessionByToken(req.cookies?.[env.sessionCookieName]);
    clearSessionCookie(res);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ ok: true, user: publicUser(req.user) });
}
