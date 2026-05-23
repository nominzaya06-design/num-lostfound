import { loginUser, registerUser, logoutUser } from '../state/sessionStore.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmail(value) {
  return EMAIL_RE.test(value);
}

function setMessage(element, text, isError = false) {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle('is-error', isError);
}

export function initAuthListeners() {
  bindLoginForm();
  bindRegisterForm();
  bindLogoutButton();
}

function bindLoginForm() {
  const form = document.querySelector('#login-form');
  if (!form || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const message = form.querySelector('.form-message');
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;

    if (!isEmail(email)) return setMessage(message, 'Please enter a valid email address.', true);
    if (password.length < 6) return setMessage(message, 'Password must be at least 6 characters.', true);

    try {
      setMessage(message, 'Signing in...');
      await loginUser(email, password);
      setMessage(message, 'Signed in ✓');
      window.setTimeout(() => { window.location.hash = '#/profile'; }, 300);
    } catch (error) {
      setMessage(message, error.message, true);
    }
  });
}

function bindRegisterForm() {
  const form = document.querySelector('#register-form');
  if (!form || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const message = form.querySelector('.form-message');
    const fullName = form.querySelector('#fullname').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const password = form.querySelector('#password').value;

    if (!fullName) return setMessage(message, 'Full name is required.', true);
    if (!isEmail(email)) return setMessage(message, 'Please enter a valid university email.', true);
    if (password.length < 6) return setMessage(message, 'Password must be at least 6 characters.', true);

    try {
      setMessage(message, 'Creating account...');
      await registerUser({ fullName, email, phone, password });
      setMessage(message, 'Account created ✓');
      window.setTimeout(() => { window.location.hash = '#/profile'; }, 300);
    } catch (error) {
      setMessage(message, error.message, true);
    }
  });
}

function bindLogoutButton() {
  const button = document.querySelector('[data-logout]');
  if (!button || button.dataset.bound === 'true') return;
  button.dataset.bound = 'true';

  button.addEventListener('click', async event => {
    event.preventDefault();
    await logoutUser();
    window.location.hash = '#/';
  });
}
