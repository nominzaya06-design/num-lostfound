import { formatDate } from '../components/campusItemCard.js';
import { getCurrentUser, isAdmin } from '../state/sessionStore.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export function profile(items = []) {
  const user = getCurrentUser();
  if (!user) return LoginRequired();

  const myItems = items.filter(item => item.postedBy && user.email && item.postedBy === user.email);
  const activeItems = myItems.filter(item => !item.isResolved);
  const resolvedItems = myItems.filter(item => item.isResolved);
  const initialsText = initials(user.fullName);

  return `
    <main class="profile-page">
      <div class="profile-layout">
        <aside class="profile-card">
          <div class="profile-avatar">${escapeHtml(initialsText)}</div>
          <strong class="profile-name">${escapeHtml(user.fullName)}</strong>
          <span class="profile-badge">${escapeHtml(user.role === 'admin' ? 'Admin' : 'Student')}</span>

          <dl class="profile-info">
            <div class="info-row"><dt>Email</dt><dd>${escapeHtml(user.email)}</dd></div>
            <div class="info-row"><dt>Phone</dt><dd>${escapeHtml(user.phone || 'Not provided')}</dd></div>
          </dl>

          <div class="profile-actions">
            <a href="#/report" class="btn-new-report">New Report</a>
            ${isAdmin() ? '<a href="#/admin" class="btn-admin">Admin Dashboard</a>' : ''}
            <button class="btn-outline profile-logout" type="button" data-logout>Log out</button>
          </div>
        </aside>

        <section class="reports-section">
          <div class="reports-header">
            <h2>My Active Reports <span class="reports-count">${activeItems.length}</span></h2>
          </div>
          ${activeItems.length ? `<div class="reports-grid item-grid">${activeItems.map(ProfileReportCard).join('')}</div>` : EmptyReports('No active reports yet', 'Create a Lost or Found report to see it here.')}

          <div class="reports-header reports-header--secondary">
            <h2>Resolved Reports <span class="reports-count">${resolvedItems.length}</span></h2>
          </div>
          ${resolvedItems.length ? `<div class="reports-grid item-grid">${resolvedItems.map(ProfileReportCard).join('')}</div>` : EmptyReports('No resolved reports yet', 'When an item is returned or claimed, it will appear here.')}

          <div class="reports-header reports-header--secondary">
            <h2>Claim Requests</h2>
          </div>
          <div class="claim-request-list" data-profile-claims>
            <article class="surface profile-claim-card">Loading requests...</article>
          </div>
        </section>
      </div>
    </main>
  `;
}

function ProfileReportCard(item) {
  const resolvedBadge = item.isResolved ? `<span class="resolved-badge">Resolved</span>` : '';

  return `
    <article class="item-card surface profile-report ${item.isResolved ? 'item-card--resolved' : ''}">
      <figure class="item-card__media"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"></figure>
      <div class="item-card__body">
        <div class="item-card__header">
          <h2 class="item-card__title">${escapeHtml(item.title)}</h2>
          <div class="item-card__badges"><num-status-badge status="${escapeHtml(item.status)}"></num-status-badge>${resolvedBadge}</div>
        </div>
        <p class="item-card__text">${escapeHtml(item.description)}</p>
        <div class="meta-list">
          <div><svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="11" r="2.5" stroke="currentColor" stroke-width="2"/></svg><span>${escapeHtml(item.location)}</span></div>
          <div><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2"/></svg><span>${formatDate(item.date)}</span></div>
        </div>
        <div class="card-actions profile-card-actions">
          <a class="btn-soft" href="#/details/${item.id}">Details</a>
          ${item.isResolved ? '' : `<button type="button" class="btn-soft btn-resolve-report" data-resolve-item="${item.id}">Mark resolved</button>`}
          <button type="button" class="btn-outline btn-delete-report" data-delete-item="${item.id}">Delete</button>
        </div>
      </div>
    </article>
  `;
}

function EmptyReports(title, text) {
  return `
    <article class="item-card surface profile-report profile-empty-card">
      <div class="item-card__body">
        <div class="item-card__header"><h2 class="item-card__title">${escapeHtml(title)}</h2></div>
        <p class="item-card__text">${escapeHtml(text)}</p>
        <div class="card-actions"><a class="btn-outline" href="#/report">Create report</a></div>
      </div>
    </article>
  `;
}

function LoginRequired() {
  return `
    <main class="profile-page">
      <section class="surface login-required-card">
        <h1>Sign in required</h1>
        <p>Please sign in to view your profile and manage your reports.</p>
        <div class="card-actions">
          <a class="btn-solid" href="#/login">Sign In</a>
          <a class="btn-outline" href="#/register">Create Account</a>
        </div>
      </section>
    </main>
  `;
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'U';
}
