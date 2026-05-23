import { deleteItem, markItemResolved } from '../state/itemStore.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export function initProfileListeners() {
  if (document.body.dataset.profileActionsBound !== 'true') {
    document.body.dataset.profileActionsBound = 'true';
    document.body.addEventListener('click', handleProfileClick);
  }

  loadProfileClaims();
}

async function handleProfileClick(event) {
  const deleteButton = event.target.closest('[data-delete-item]');
  const resolveButton = event.target.closest('[data-resolve-item]');
  const claimButton = event.target.closest('[data-claim-action]');

  if (deleteButton) {
    event.preventDefault();
    await handleDelete(deleteButton);
  }

  if (resolveButton) {
    event.preventDefault();
    await handleResolve(resolveButton);
  }

  if (claimButton) {
    event.preventDefault();
    await handleClaimAction(claimButton);
  }
}

async function handleDelete(button) {
  const id = button.dataset.deleteItem;
  const ok = window.confirm('Delete this post? This action cannot be undone.');
  if (!ok) return;

  button.disabled = true;
  button.textContent = 'Deleting...';

  try {
    await deleteItem(id);
    reloadProfile();
  } catch (error) {
    button.disabled = false;
    button.textContent = 'Delete';
    window.alert(error.message || 'Could not delete this post.');
  }
}

async function handleResolve(button) {
  const id = button.dataset.resolveItem;
  const ok = window.confirm('Mark this report as resolved?');
  if (!ok) return;

  button.disabled = true;
  button.textContent = 'Saving...';

  try {
    await markItemResolved(id);
    reloadProfile();
  } catch (error) {
    button.disabled = false;
    button.textContent = 'Mark resolved';
    window.alert(error.message || 'Could not update this post.');
  }
}

async function loadProfileClaims() {
  const target = document.querySelector('[data-profile-claims]');
  if (!target || target.dataset.loaded === 'true') return;
  target.dataset.loaded = 'true';

  try {
    const response = await fetch('/api/profile/claims', { credentials: 'include' });
    if (!response.ok) throw new Error('Could not load claim requests.');
    const data = await response.json();
    target.innerHTML = renderClaims(data.claims || []);
  } catch (_error) {
    target.innerHTML = `<article class="surface profile-claim-card">No claim requests yet.</article>`;
  }
}

function renderClaims(claims) {
  if (!claims.length) return `<article class="surface profile-claim-card">No claim requests yet.</article>`;

  return claims.map(claim => `
    <article class="surface profile-claim-card">
      <div>
        <strong>${escapeHtml(claim.itemTitle || 'Item')}</strong>
        <p>${escapeHtml(claim.message)}</p>
        <span>${escapeHtml(claim.claimantName || 'User')} · ${escapeHtml(claim.status)}</span>
      </div>
      ${claim.status === 'Pending' ? `
        <div class="profile-claim-actions">
          <button class="btn-soft" type="button" data-claim-action="Accepted" data-item-id="${claim.itemId}" data-claim-id="${claim.id}">Accept</button>
          <button class="btn-outline" type="button" data-claim-action="Rejected" data-item-id="${claim.itemId}" data-claim-id="${claim.id}">Reject</button>
        </div>
      ` : ''}
    </article>
  `).join('');
}

async function handleClaimAction(button) {
  const status = button.dataset.claimAction;
  const itemId = button.dataset.itemId;
  const claimId = button.dataset.claimId;

  button.disabled = true;
  button.textContent = 'Saving...';

  try {
    const response = await fetch(`/api/items/${itemId}/claims/${claimId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Could not update request.');
    reloadProfile();
  } catch (error) {
    button.disabled = false;
    button.textContent = status;
    window.alert(error.message || 'Could not update request.');
  }
}

function reloadProfile() {
  if (window.location.hash === '#/profile') {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = '#/profile';
  }
}
