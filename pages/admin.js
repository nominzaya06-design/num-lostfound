import { formatDate } from '../components/campusItemCard.js';
import { getCurrentUser, isAdmin } from '../state/sessionStore.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export function admin(items = []) {
  const user = getCurrentUser();
  if (!user) return AdminRequired('Please sign in with an admin account to open the dashboard.');
  if (!isAdmin()) return AdminRequired('Your account does not have admin permission.');

  return `
    <main class="admin-page">
      <div class="admin-shell">
        <aside class="admin-sidebar">
          <h1>Admin Panel</h1>
          <p class="admin-sidebar__text">Manage reported lost and found items.</p>

          <nav class="admin-nav">
            <button class="admin-tab is-active" type="button" data-target="dashboard">Dashboard</button>
            <button class="admin-tab" type="button" data-target="posts">Manage Posts</button>
            <a class="admin-back-link" href="#/profile">Back to Profile</a>
          </nav>
        </aside>

        <section class="admin-main">
          <header class="admin-header"><div><h2 id="admin-title">Dashboard</h2></div></header>

          <div class="admin-panel is-active" id="panel-dashboard"><div id="react-admin-stats-root"></div></div>

          <div class="admin-panel" id="panel-posts">
            <section class="admin-card">
              <div class="admin-card-head">
                <div><h3>All Item Reports</h3><p>Reports loaded from the API.</p></div>
                <div class="admin-search"><input type="search" placeholder="Search posts..." data-admin-search></div>
              </div>

              <div class="admin-table-wrap">
                <table class="admin-table">
                  <thead><tr><th>Item</th><th>Type</th><th>Status</th><th>Posted By</th><th>Date</th><th style="text-align:right;">Actions</th></tr></thead>
                  <tbody>${items.map(AdminItemRow).join('')}</tbody>
                </table>
              </div>
            </section>
          </div>

        </section>
      </div>
    </main>
  `;
}

function AdminItemRow(item) {
  return `
    <tr>
      <td><div class="admin-item"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"><span>${escapeHtml(item.title)}</span></div></td>
      <td><num-status-badge status="${escapeHtml(item.status)}"></num-status-badge></td>
      <td>${item.isResolved ? '<span class="resolved-badge">Resolved</span>' : '<span class="active-badge">Active</span>'}</td>
      <td class="admin-muted">${escapeHtml(item.postedByName || 'Guest')}</td>
      <td class="admin-muted">${formatDate(item.date)}</td>
      <td><div class="admin-actions"><a class="admin-action admin-action--approve" href="#/details/${item.id}" title="View details">✓</a><button class="admin-action admin-action--delete" type="button" data-delete-item="${item.id}" title="Remove row">✕</button></div></td>
    </tr>
  `;
}

function AdminRequired(message) {
  return `
    <main class="admin-page">
      <section class="surface login-required-card">
        <h1>Admin access required</h1>
        <p>${escapeHtml(message)}</p>
        <div class="card-actions"><a class="btn-solid" href="#/login">Sign In</a><a class="btn-outline" href="#/profile">Profile</a></div>
      </section>
    </main>
  `;
}
