import { cleanText, isNonEmpty, validateEmail, validatePhone } from './common.js';

export function validateRegister(body = {}) {
  const data = {
    fullName: cleanText(body.fullName || body.full_name),
    email: cleanText(body.email).toLowerCase(),
    password: String(body.password || ''),
    phone: cleanText(body.phone || '')
  };
  const errors = [];

  if (!isNonEmpty(data.fullName, 120)) errors.push('Full name is required.');
  if (!validateEmail(data.email)) errors.push('Valid email is required.');
  if (data.password.length < 6) errors.push('Password must be at least 6 characters.');
  if (!validatePhone(data.phone)) errors.push('Phone number format is invalid.');

  return { data, errors };
}

export function validateLogin(body = {}) {
  const data = {
    email: cleanText(body.email).toLowerCase(),
    password: String(body.password || '')
  };
  const errors = [];

  if (!validateEmail(data.email)) errors.push('Valid email is required.');
  if (!data.password) errors.push('Password is required.');

  return { data, errors };
}
