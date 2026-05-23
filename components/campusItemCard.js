import { escapeHtml } from '../utils/escapeHtml.js';

export function CampusItemCard(item) {
  const actionText = item.contactAction || (item.status === 'Found' ? 'Claim' : 'Found it?');
  const resolvedBadge = item.isResolved ? `<span class="resolved-badge">Resolved</span>` : '';

  return `
    <article class="item-card surface ${item.isResolved ? 'item-card--resolved' : ''}">
      <figure class="item-card__media">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
      </figure>
      <div class="item-card__body">
        <div class="item-card__header">
          <h2 class="item-card__title">${escapeHtml(item.title)}</h2>
          <div class="item-card__badges">
            <num-status-badge status="${escapeHtml(item.status)}"></num-status-badge>
            ${resolvedBadge}
          </div>
        </div>
        <p class="item-card__text">${escapeHtml(item.description)}</p>
        <div class="meta-list">
          <div>
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="11" r="2.5" stroke="currentColor" stroke-width="2"/></svg>
            <span>${escapeHtml(item.location)}</span>
          </div>
          <div>
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2"/></svg>
            <span>${formatDate(item.date)}</span>
          </div>
        </div>
        <div class="card-actions">
          <a class="btn-soft" href="#/details/${item.id}">Details</a>
          ${item.isResolved ? '<span class="btn-disabled">Closed</span>' : `<a class="btn-outline" href="#/contact/${item.id}">${escapeHtml(actionText)}</a>`}
        </div>
      </div>
    </article>
  `;
}

export function CampusItemGrid(items) {
  if (!items.length) {
    return `<div class="item-grid"><article class="item-card surface"><div class="item-card__body"><h2 class="item-card__title">No items found</h2><p class="item-card__text">Try changing the search keyword, location, or category filter.</p></div></article></div>`;
  }

  return `<div class="item-grid">${items.map(item => CampusItemCard(item)).join('')}</div>`;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (Number.isNaN(date.getTime())) return '';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
