import { LostFoundItem } from '../components/ItemModel.js';

let cachedItems = null;
let fallbackSeedItems = null;

export async function fetchItems(options = {}) {
  if (cachedItems && !options.fresh) return cachedItems;

  try {
    const query = options.query ? `?${new URLSearchParams(options.query).toString()}` : '';
    const response = await fetch(`/api/items${query}`, { credentials: 'include' });
    if (!response.ok) throw new Error('API items request failed.');

    const data = await response.json();
    cachedItems = (data.items || []).map(item => new LostFoundItem(item));
    return cachedItems;
  } catch (_error) {
    const seed = await fetchSeedItems(options);
    cachedItems = seed.map(item => new LostFoundItem(item));
    return cachedItems;
  }
}

export async function fetchItemById(id) {
  try {
    const response = await fetch(`/api/items/${id}`, { credentials: 'include' });
    if (!response.ok) throw new Error('Item not found.');
    const data = await response.json();
    return new LostFoundItem(data.item);
  } catch (_error) {
    const items = await fetchItems();
    return items.find(item => String(item.id) === String(id));
  }
}

export async function createItem(itemData) {
  const response = await fetch('/api/items', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Could not create report. Please sign in first.');

  cachedItems = null;
  return new LostFoundItem(data.item);
}

export async function deleteItem(id) {
  const response = await fetch(`/api/items/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Could not delete report.');

  cachedItems = null;
  return data;
}

export async function markItemResolved(id) {
  const response = await fetch(`/api/items/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportStatus: 'Resolved' })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Could not update report.');

  cachedItems = null;
  return data.item ? new LostFoundItem(data.item) : null;
}

async function fetchSeedItems(options = {}) {
  if (fallbackSeedItems && !options.fresh) return fallbackSeedItems;

  const response = await fetch('./data/items.json');
  if (!response.ok) throw new Error('Could not load data/items.json');

  fallbackSeedItems = await response.json();
  return fallbackSeedItems;
}
