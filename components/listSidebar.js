import { CATEGORY_OPTIONS, LOCATION_OPTIONS } from '../constants/filterOptions.js';

export function ListSidebar(status) {
  const title = status === 'Lost' ? 'Filter Lost Items' : 'Filter Found Items';
  return `
    <aside class="sidebar-card surface">
      <h2 class="sidebar-card__title">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16l-6 7v5l-4 2v-7L4 6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        <span>${title}</span>
      </h2>
      <form class="sidebar-stack" id="list-filter-form">
        <div class="field-group">
          <label for="list-keyword">Search Keyword</label>
          <input id="list-keyword" type="search" placeholder="Search...">
        </div>

        <div class="field-group">
          <label for="list-location">Location</label>
          <select id="list-location">
            <option>All Location</option>
            ${LOCATION_OPTIONS.map(location => `<option>${location}</option>`).join('')}
          </select>
        </div>

        <fieldset class="checkbox-group">
          <legend class="checkbox-group__title">Category</legend>
          ${CATEGORY_OPTIONS.map(category => `
            <label class="checkbox-item"><input type="checkbox" name="list-category" value="${category}">${category}</label>
          `).join('')}
        </fieldset>

        <button class="btn-solid" type="submit">Apply Filters</button>
      </form>
    </aside>
  `;
}
