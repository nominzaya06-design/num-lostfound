import { cleanText, isNonEmpty, validateEmail, validatePhone } from './common.js';

const TYPES = ['Lost', 'Found'];
const STATUS = ['Active', 'Resolved'];

export function validateItem(body = {}) {
  const data = {
    title: cleanText(body.title),
    description: cleanText(body.description),
    reportType: cleanText(body.reportType),
    reportStatus: cleanText(body.reportStatus || 'Active'),
    category: cleanText(body.category),
    location: cleanText(body.location),
    imageUrl: cleanText(body.image || ''),
    contactEmail: cleanText(body.contactEmail).toLowerCase(),
    contactPhone: cleanText(body.contactPhone || '')
  };
  const errors = [];

  if (!isNonEmpty(data.title, 160)) errors.push('Title is required.');
  if (!isNonEmpty(data.description, 2000)) errors.push('Description is required.');
  if (!TYPES.includes(data.reportType)) errors.push('Report type must be Lost or Found.');
  if (!STATUS.includes(data.reportStatus)) errors.push('Report status is invalid.');
  if (!isNonEmpty(data.category, 80)) errors.push('Category is required.');
  if (!isNonEmpty(data.location, 120)) errors.push('Location is required.');
  if (!data.imageUrl) data.imageUrl = defaultImage(data.category);
  if (!validateEmail(data.contactEmail)) errors.push('Valid contact email is required.');
  if (!validatePhone(data.contactPhone)) errors.push('Phone number format is invalid.');

  return { data, errors };
}

export function validateItemPatch(body = {}) {
  const data = {};
  const errors = [];

  if (body.reportStatus !== undefined) {
    data.reportStatus = cleanText(body.reportStatus);
    if (!STATUS.includes(data.reportStatus)) errors.push('Report status is invalid.');
  }

  if (body.title !== undefined) {
    data.title = cleanText(body.title);
    if (!isNonEmpty(data.title, 160)) errors.push('Title is invalid.');
  }

  if (body.description !== undefined) {
    data.description = cleanText(body.description);
    if (!isNonEmpty(data.description, 2000)) errors.push('Description is invalid.');
  }

  return { data, errors };
}

function defaultImage(category = '') {
  const key = category.toLowerCase();
  if (key.includes('phone')) return 'images/phone.jpg';
  if (key.includes('wallet')) return 'images/wallet.jpg';
  if (key.includes('id')) return 'images/idcard.jpg';
  if (key.includes('key')) return 'images/keys.jpg';
  if (key.includes('bag')) return 'images/bag.jpg';
  if (key.includes('laptop')) return 'images/laptop.jpg';
  return 'images/bag.jpg';
}
