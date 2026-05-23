let currentUser = null;

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function notifyAuthChanged() {
  window.dispatchEvent(new CustomEvent('auth:changed', {
    detail: { user: currentUser }
  }));
}

export function getCurrentUser() {
  return currentUser;
}

export function isAdmin() {
  return currentUser?.role === 'admin';
}

export async function loadCurrentUser() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include'
  });

  const data = await readJson(response);

  if (response.ok && data.ok) {
    currentUser = data.user;
  } else {
    currentUser = null;
  }

  notifyAuthChanged();
  return currentUser;
}

export async function loginUser(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });

  const data = await readJson(response);

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'Login failed.');
  }

  currentUser = data.user;
  notifyAuthChanged();

  return currentUser;
}

export async function registerUser({ fullName, email, phone, password }) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      fullName,
      email,
      phone,
      password
    })
  });

  const data = await readJson(response);

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'Registration failed.');
  }

  currentUser = data.user || null;
  notifyAuthChanged();

  return currentUser;
}

export async function logoutUser() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });

  currentUser = null;
  notifyAuthChanged();
}