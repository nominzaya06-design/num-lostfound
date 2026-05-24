// constants/filterOptions.js
export const LOCATION_OPTIONS = [
  'Library',
  'Cafeteria',
  'Main gate',
  'Bus stop',
  '1-r bair',
  '2-r bair',
  '3-r bair',
  '4-r bair',
  '5-r bair',
  '7-r bair',
  '8-r bair'
];

export const CATEGORY_OPTIONS = [
  'Phone',
  'Wallet',
  'ID card',
  'Bag',
  'Laptop',
  'Keys',
  'Other'
];

export const STATUS_FILTER_OPTIONS = ['Lost & found', 'Lost', 'Found'];
export const SORT_OPTIONS = ['Newest first', 'Oldest first'];

export function optionTags(options, placeholder = '') {
  const first = placeholder ? `<option>${placeholder}</option>` : '';
  return `${first}${options.map(option => `<option>${option}</option>`).join('')}`;
}
