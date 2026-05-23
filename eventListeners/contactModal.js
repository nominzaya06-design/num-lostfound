import { fetchItems } from '../state/itemStore.js';
import { getCurrentUser } from '../state/sessionStore.js';
import { escapeHtml } from '../utils/escapeHtml.js';

let escHandler = null;
let contactModalReady = false;

export function initContactModal() {
  if (contactModalReady) return;
  contactModalReady = true;

  document.addEventListener('click', async (event) => {
    const trigger = event.target.closest('.contact-modal-trigger, a[href^="#/contact/"]');
    if (!trigger) return;

    event.preventDefault();

    const id = trigger.dataset.contactId || trigger.getAttribute('href').split('/').pop();
    const item = await getItemById(id);
    showContactModal(item);
  });
}


async function getItemById(id) {
  const items = await fetchItems();
  return items.find(item => String(item.id) === String(id));
}

function showContactModal(item) {
  closeContactModal();

  if (!item) {
    showFallbackModal();
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    window.location.hash = '#/login';
    return;
  }

  const actionText = item.status === 'Found' ? 'Claim request' : 'Found item message';

  const overlay = document.createElement('div');
  overlay.className = 'contact-modal-overlay';
  overlay.innerHTML = `
    <section class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button class="contact-modal__close" type="button" aria-label="Close contact modal">×</button>

      <header class="modal-header">
        <p class="modal-subtitle">${escapeHtml(actionText)}</p>
        <h1 class="modal-title" id="contact-modal-title">Contact the report owner</h1>
        <p class="modal-copy">Send a short message about <strong>${escapeHtml(item.title)}</strong>. The owner can review it from their profile.</p>
      </header>

      <form class="claim-form" data-claim-form data-item-id="${item.id}">
        <div class="contact-list contact-list--modal">
          <div class="contact-row"><strong>Item</strong><span>${escapeHtml(item.title)}</span></div>
          <div class="contact-row"><strong>Posted by</strong><span>${escapeHtml(item.postedByName || 'Guest')}</span></div>
          <div class="contact-row"><strong>Your email</strong><input name="contactEmail" type="email" value="${escapeHtml(user.email)}" required></div>
          <div class="contact-row"><strong>Your phone</strong><input name="contactPhone" type="tel" value="${escapeHtml(user.phone || '')}" placeholder="+976 ..."></div>
        </div>

        <label class="claim-message-label">
          <span>Message</span>
          <textarea name="message" rows="4" required placeholder="Describe proof or when/where you found the item."></textarea>
        </label>

        <p class="form-message" aria-live="polite"></p>

        <div class="modal-actions contact-modal__actions">
          <button class="btn-solid" type="submit">Send request</button>
          <button class="btn-soft" type="button" data-close-modal>Cancel</button>
        </div>
      </form>
    </section>
  `;

  bindModalEvents(overlay);
  bindClaimForm(overlay);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));
}

function bindClaimForm(overlay) {
  const form = overlay.querySelector('[data-claim-form]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = form.querySelector('.form-message');
    const itemId = form.dataset.itemId;
    const payload = {
      contactEmail: form.elements.contactEmail.value.trim(),
      contactPhone: form.elements.contactPhone.value.trim(),
      message: form.elements.message.value.trim()
    };

    if (!payload.message) {
      setMessage(message, 'Message is required.', true);
      return;
    }

    try {
      setMessage(message, 'Sending request...');
      const response = await fetch(`/api/items/${itemId}/claims`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Could not send request.');
      setMessage(message, 'Request sent ✓');
      window.setTimeout(closeContactModal, 700);
    } catch (error) {
      setMessage(message, error.message, true);
    }
  });
}

function showFallbackModal() {
  const overlay = document.createElement('div');
  overlay.className = 'contact-modal-overlay';
  overlay.innerHTML = `
    <section class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button class="contact-modal__close" type="button" aria-label="Close contact modal">×</button>
      <header class="modal-header">
        <p class="modal-subtitle">Contact</p>
        <h1 class="modal-title" id="contact-modal-title">Item not found</h1>
        <p class="modal-copy">Please open an item from the Lost or Found list first.</p>
      </header>
      <div class="modal-actions contact-modal__actions"><a class="btn-solid" href="#/lost">Lost Items</a><a class="btn-soft" href="#/found">Found Items</a></div>
    </section>
  `;

  bindModalEvents(overlay);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-visible'));
}

function bindModalEvents(overlay) {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.closest('[data-close-modal]')) closeContactModal();
  });

  overlay.querySelector('.contact-modal__close').addEventListener('click', closeContactModal);

  escHandler = (event) => {
    if (event.key === 'Escape') closeContactModal();
  };
  document.addEventListener('keydown', escHandler);
}

function setMessage(element, text, isError = false) {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle('is-error', isError);
}

function closeContactModal() {
  const overlay = document.querySelector('.contact-modal-overlay');
  if (overlay) {
    overlay.classList.remove('is-visible');
    window.setTimeout(() => overlay.remove(), 180);
  }

  if (escHandler) {
    document.removeEventListener('keydown', escHandler);
    escHandler = null;
  }
}
