import { cleanText, isNonEmpty, validateEmail, validatePhone } from './common.js';

const CLAIM_STATUS = ['Pending', 'Accepted', 'Rejected'];

export function validateClaim(body = {}) {
  const data = {
    message: cleanText(body.message),
    contactEmail: cleanText(body.contactEmail).toLowerCase(),
    contactPhone: cleanText(body.contactPhone || '')
  };
  const errors = [];

  if (!isNonEmpty(data.message, 1000)) errors.push('Message is required.');
  if (!validateEmail(data.contactEmail)) errors.push('Valid contact email is required.');
  if (!validatePhone(data.contactPhone)) errors.push('Phone number format is invalid.');

  return { data, errors };
}

export function validateClaimStatus(body = {}) {
  const data = { status: cleanText(body.status) };
  const errors = [];
  if (!CLAIM_STATUS.includes(data.status)) errors.push('Claim status is invalid.');
  return { data, errors };
}
