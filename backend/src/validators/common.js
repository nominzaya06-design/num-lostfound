export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+?[0-9 ()-]{6,20}$/;

export function isNonEmpty(value, max = 1000) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
}

export function cleanText(value = '') {
  return String(value).trim();
}

export function validateEmail(email) {
  return EMAIL_RE.test(String(email || '').trim());
}

export function validatePhone(phone) {
  return !phone || PHONE_RE.test(String(phone).trim());
}
