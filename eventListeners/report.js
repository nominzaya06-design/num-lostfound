import { createItem } from '../state/itemStore.js';
import { getCurrentUser } from '../state/sessionStore.js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function initReportListeners() {
  bindReportForm('lost');
  bindReportForm('found');
  bindUploadPreview('lost');
  bindUploadPreview('found');
  fillContactFromSession();
}

function bindReportForm(type) {
  const form = document.querySelector(`#${type}-report-form`);
  if (!form || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = form.querySelector('.form-message');
    setMessage(message, 'Preparing report preview...');

    try {
      const payload = await readReportForm(type);
      const errors = validateReport(payload);
      if (errors.length) {
        setMessage(message, errors.join(' '), true);
        return;
      }

      const created = await createItem(payload);
      setMessage(message, 'Report added for this session ✓');
      window.location.hash = `#/details/${created.id}`;
    } catch (error) {
      setMessage(message, formatError(error), true);
    }
  });
}

async function readReportForm(type) {
  const reportType = type === 'lost' ? 'Lost' : 'Found';
  const category = value(`#${type}-category`);
  const image = await readSelectedImage(type);

  return {
    title: value(`#${type}-item-name`),
    reportType,
    category,
    location: value(`#${type}-location`),
    date: value(`#date-${type}`),
    description: value(`#${type}-description`),
    contactPhone: value(`#${type}-phone`),
    contactEmail: value(`#${type}-email`),
    image: image || defaultImage(category)
  };
}

function bindUploadPreview(type) {
  const input = document.querySelector(`#${type}-upload`);
  const box = document.querySelector(`label[for="${type}-upload"]`);
  if (!input || !box || input.dataset.previewBound === 'true') return;
  input.dataset.previewBound = 'true';

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) {
      setUploadText(box, 'Click to upload an image', 'PNG, JPG, WEBP up to 5MB');
      box.classList.remove('upload-box--selected', 'upload-box--error');
      return;
    }

    const error = validateImageFile(file);
    if (error) {
      input.value = '';
      setUploadText(box, 'Image not accepted', error);
      box.classList.add('upload-box--error');
      box.classList.remove('upload-box--selected');
      return;
    }

    setUploadText(box, file.name, `${formatBytes(file.size)} selected`);
    box.classList.add('upload-box--selected');
    box.classList.remove('upload-box--error');
  });
}

function setUploadText(box, title, subtitle) {
  const strong = box.querySelector('strong');
  const text = box.querySelector('p');
  if (strong) strong.textContent = title;
  if (text) text.textContent = subtitle;
}

function readSelectedImage(type) {
  const input = document.querySelector(`#${type}-upload`);
  const file = input?.files?.[0];
  if (!file) return Promise.resolve('');

  const error = validateImageFile(file);
  if (error) return Promise.reject(new Error(error));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read selected image.'));
    reader.readAsDataURL(file);
  });
}

function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Only JPG, PNG, or WEBP images are allowed.';
  if (file.size > MAX_IMAGE_SIZE) return 'Image must be smaller than 5MB.';
  return '';
}

function fillContactFromSession() {
  const user = getCurrentUser() || {};

  ['lost', 'found'].forEach(type => {
    const email = document.querySelector(`#${type}-email`);
    const phone = document.querySelector(`#${type}-phone`);
    if (email && !email.value) email.value = user.email || '';
    if (phone && !phone.value) phone.value = user.phone || '';
  });
}

function validateReport(payload) {
  const errors = [];
  if (!payload.title) errors.push('Item name is required.');
  if (!payload.category || payload.category.startsWith('Select')) errors.push('Category is required.');
  if (!payload.location || payload.location.startsWith('Select')) errors.push('Location is required.');
  if (!payload.date) errors.push('Date is required.');
  if (!payload.description) errors.push('Description is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contactEmail)) errors.push('Valid email is required.');
  if (payload.contactPhone && !/^\+?[0-9 ()-]{6,20}$/.test(payload.contactPhone)) errors.push('Phone number format is invalid.');
  return errors;
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

function value(selector) {
  return document.querySelector(selector)?.value.trim() || '';
}

function setMessage(element, text, isError = false) {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle('is-error', isError);
}

function formatError(error) {
  if (error.details?.length) return error.details.join(' ');
  return error.message || 'Request failed';
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
