import { CampusItemGrid } from '../components/campusItemCard.js';
import { SummaryCards } from '../components/summaryCards.js';
import { fetchItems } from '../state/itemStore.js';

let appliedFilters = {
  location: 'All Location',
  category: 'All Category',
  status: 'Lost & found',
  sort: 'Newest first'
};

let currentSearchQuery = '';

export function initFilterListeners() {
  const form = document.getElementById('home-filter-form');
  if (!form) return;

  form.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', () => {
      appliedFilters = getFiltersFromForm(form);
      applyFiltersAndSearch();
    });
  });
}

function getFiltersFromForm(form) {
  return {
    location: form.querySelector('select[name="locationFilter"]')?.value || 'All Location',
    category: form.querySelector('select[name="categoryFilter"]')?.value || 'All Category',
    status: form.querySelector('select[name="Status"]')?.value || 'Lost & found',
    sort: form.querySelector('select[name="SortBy"]')?.value || 'Newest first'
  };
}

export async function applyFiltersAndSearch() {
  const items = await fetchItems();

  let filtered = items.filter(item =>
    item.matchesLocation(appliedFilters.location) &&
    item.matchesCategory(appliedFilters.category) &&
    item.matchesStatus(appliedFilters.status) &&
    item.matchesQuery(currentSearchQuery)
  );

  filtered = sortItems(filtered, appliedFilters.sort);

  replaceGrid(filtered);
  updateElementText('resultCount', `${filtered.length} items shown`);

  const summarySection = document.querySelector('.summary-grid');
  if (summarySection) summarySection.outerHTML = SummaryCards(filtered);
}

function sortItems(items, sortBy) {
  return [...items].sort((a, b) => {
    const diff = new Date(b.date) - new Date(a.date);
    return sortBy === 'Newest first' ? diff : -diff;
  });
}

export function setSearchQuery(query) {
  currentSearchQuery = query.trim();
  applyFiltersAndSearch();
}

// Shared DOM helpers — also used by listPageFilters.js
export function replaceGrid(items) {
  const grid = document.querySelector('.item-grid');
  if (grid) grid.outerHTML = CampusItemGrid(items);
}

export function updateElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
