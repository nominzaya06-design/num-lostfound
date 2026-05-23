import { fetchItems } from '../state/itemStore.js';
import { replaceGrid, updateElementText } from './filters.js';

export function initListPageFilters() {
  const listPage = document.querySelector('[data-list-page="true"]');
  if (!listPage) return;

  const form = document.getElementById('list-filter-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    applyListFilters(listPage, form);
  });
}

async function applyListFilters(listPage, form) {
  const pageStatus = listPage.dataset.status;
  const query = form.querySelector('#list-keyword')?.value.trim() || '';
  const location = form.querySelector('#list-location')?.value || 'All Location';
  const selectedCategories = [...form.querySelectorAll('input[name="list-category"]')]
    .filter(input => input.checked)
    .map(input => input.value);

  const items = await fetchItems();
  const filtered = items.filter(item =>
    item.status === pageStatus &&
    item.matchesQuery(query) &&
    (location === 'All Location' || item.location === location) &&
    (selectedCategories.length === 0 || selectedCategories.includes(item.category))
  );

  replaceGrid(filtered);
  updateElementText('listResultCount', `${filtered.length} items`);
}
