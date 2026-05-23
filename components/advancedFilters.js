// components/advancedFilters.js
import { AFSearchType } from './AFSearchtype.js';
import { CATEGORY_OPTIONS, LOCATION_OPTIONS, SORT_OPTIONS, STATUS_FILTER_OPTIONS } from '../constants/filterOptions.js';

export function AdvancedFilters() {
  return `
    <form class="AdvancedFilters" id="home-filter-form">
      <input type="checkbox" id="filterToggle">
      <div class="AdvancedFilterTitle">
        <label for="filterToggle">
          <img id="filtherImg" src="images/filter.png" alt="Filter Icon" />
          <span>Advanced Filters</span>
        </label>
      </div>
      <div class="AdvencedSearchOptions">
        ${AFSearchType('Location', ['All Location', ...LOCATION_OPTIONS])}
        ${AFSearchType('Category', ['All Category', ...CATEGORY_OPTIONS])}
        ${AFSearchType('Status', STATUS_FILTER_OPTIONS)}
        ${AFSearchType('Sort by', SORT_OPTIONS)}
      </div>
    </form>
  `;
}
