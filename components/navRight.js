import { getCurrentUser } from '../state/sessionStore.js';

export function NavRight() {
  const user = getCurrentUser();
  const initials = user ? getInitials(user.fullName) : '';

  return `
    <div class="nav-right">
      <a href="#/report" class="post-btn">Post Items</a>
      ${user
        ? `<a href="#/profile" class="profile-btn">${initials}</a>`
        : `<a href="#/login" class="login-btn">Sign In</a>`
      }
    </div>
  `;
}

function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'U';
}
