import { CampusItemGrid } from '../components/campusItemCard.js';
import { ListSidebar } from '../components/listSidebar.js';

const CONFIG = {
  Lost: {
    noticeClass: 'notice--lost',
    noticeTitle: 'Looking for something?',
    noticeText: "Browse the items below that others have reported lost. If you've found one of these items, open the details page and use the contact actions.",
    headingClass: 'list-heading',
  },
  Found: {
    noticeClass: 'notice--found',
    noticeTitle: 'Found something?',
    noticeText: 'Browse the items below that were found around campus. If one belongs to you, open the details page and use the claim action.',
    headingClass: 'list-heading list-heading--found',
  },
};

export function lost(items) {
  return renderItemListPage(items, 'Lost');
}

export function found(items) {
  return renderItemListPage(items, 'Found');
}

function renderItemListPage(items, status) {
  const cfg = CONFIG[status];
  const pageItems = items.filter(item => item.status === status);

  return `
    <main class="site-main page-width" data-list-page="true" data-status="${status}">
      <div class="page-split">
        ${ListSidebar(status)}
        <section>
          <div class="notice ${cfg.noticeClass}">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 11.2v4.3M12 8.3h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <div><strong>${cfg.noticeTitle}</strong><span>${cfg.noticeText}</span></div>
          </div>
          <div class="${cfg.headingClass}">
            <div>
              <h1>${status} Items</h1>
              <span>Recently posted ${status.toLowerCase()} items around campus.</span>
            </div>
            <span class="muted-count" id="listResultCount">${pageItems.length} items</span>
          </div>
          ${CampusItemGrid(pageItems)}
        </section>
      </div>
    </main>
  `;
}
