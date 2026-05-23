
import { HeroSection } from '../components/hero.js';
import { AdvancedFilters } from '../components/advancedFilters.js';
import { CampusItemGrid } from '../components/campusItemCard.js';
import { SummaryCards } from '../components/summaryCards.js';
import { Footer } from '../components/footer.js';

export function homepage(items) {
  return `
    ${HeroSection()}
    <div class="Main-body">
      ${AdvancedFilters()}
    </div>
    <main class="container">
      <header class="ri recent-items-header">
        <div>
          <h2>Recent Items</h2>
        </div>
        <span id="resultCount" class="results-count">${items.length} items shown</span>
      </header>
      ${SummaryCards(items)}
      ${CampusItemGrid(items)}
    </main>
    ${Footer()}
  `;
}