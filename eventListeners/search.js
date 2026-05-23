import { setSearchQuery } from './filters.js';

function bindSearchInput(inputId, { onEnter } = {}) {
  const input = document.getElementById(inputId);
  if (!input || input.dataset.searchBound === 'true') return null;
  input.dataset.searchBound = 'true';
  if (onEnter) {
    input.addEventListener('keypress', e => { if (e.key === 'Enter') onEnter(input); });
  }
  return input;
}

export function initSearchListeners() {
  const heroInput = bindSearchInput('hero-search-input', {
    onEnter: input => setSearchQuery(input.value),
  });

  const heroBtn = document.getElementById('hero-search-btn');
  if (heroBtn && heroInput && !heroBtn.dataset.searchBound) {
    heroBtn.dataset.searchBound = 'true';
    heroBtn.addEventListener('click', () => setSearchQuery(heroInput.value));
  }
}
