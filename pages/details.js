import { formatDate } from '../components/campusItemCard.js';
import { getCurrentUser } from '../state/sessionStore.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export function details(items, params = {}) {
  const item = items.find(entry => String(entry.id) === String(params.id)) || items[0];
  if (!item) return NotFound();

  const user = getCurrentUser();
  const isOwner = user && item.postedBy === user.email;
  const backHref = item.status === 'Found' ? '#/found' : '#/lost';
  const contactText = item.status === 'Found' ? 'Claim this item' : 'I found this item';
  const resolvedBadge = item.isResolved ? `<span class="resolved-badge">Resolved</span>` : '';

  return `
    <main class="site-main page-width">
      <a class="back-link" href="${backHref}">
        <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Back to items</span>
      </a>

      <div class="detail-layout">
        <figure class="detail-media surface"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"></figure>

        <section class="detail-panel">
          <header class="detail-head">
            <div>
              <div class="detail-badges">
                <num-status-badge status="${escapeHtml(item.status)}"></num-status-badge>
                ${resolvedBadge}
              </div>
              <h1>${escapeHtml(item.title)}</h1>
              <div class="detail-meta">
                <span>${escapeHtml(item.category)}</span>
                <span>${escapeHtml(item.location)}</span>
                <span>${formatDate(item.date)}</span>
              </div>
            </div>
          </header>

          <section class="detail-copy">
            <h2>Description</h2>
            <p>${escapeHtml(item.description)}</p>
          </section>

          <aside class="contact-card surface">
            <div class="contact-card__heading">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              <h2>${isOwner ? 'Report Owner Actions' : 'Contact Information'}</h2>
            </div>

            <p class="contact-card__eyebrow">Posted by</p>
            <p>${escapeHtml(item.postedByName || 'Guest')}</p>
            <p class="contact-card__eyebrow">Email</p>
            <p>${escapeHtml(item.contactEmail || 'Not provided')}</p>
            <p class="contact-card__eyebrow">Phone</p>
            <p>${escapeHtml(item.contactPhone || 'Not provided')}</p>

            <div class="detail-note">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 11.2v4.3M12 8.3h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              <span>${item.isResolved ? 'This report has already been resolved.' : 'Please provide clear proof or unique item details before claiming this item.'}</span>
            </div>

            <div class="contact-card__actions">
              ${ActionButtons(item, user, isOwner, contactText)}
            </div>
          </aside>
        </section>
      </div>
    </main>
  `;
}

function ActionButtons(item, user, isOwner, contactText) {
  if (item.isResolved) return '<span class="btn-disabled">Closed</span>';

  if (isOwner) {
    return `
      <button class="btn-solid" type="button" data-resolve-item="${item.id}">Mark as resolved</button>
      <a class="btn-soft" href="#/profile">My reports</a>
    `;
  }

  if (!user) {
    return `<a class="btn-solid" href="#/login">Sign in to contact</a>`;
  }

  return `
    <a class="btn-soft contact-clear contact-modal-trigger" href="#/contact/${item.id}" data-contact-id="${item.id}">
      <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M5 7l7 6 7-6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
      <span>${escapeHtml(contactText)}</span>
    </a>
  `;
}

function NotFound() {
  return `
    <main class="site-main page-width">
      <section class="surface modal-card">
        <h1>Item not found</h1>
        <p>The requested item could not be loaded.</p>
        <a class="btn-solid" href="#/">Back Home</a>
      </section>
    </main>
  `;
}
