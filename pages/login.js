import { authLayout } from '../components/authLayout.js';

export function login() {
  return authLayout({
    leftHeading: 'Reuniting the NUM Community',
    rightContent: `
      <h1>Welcome Back</h1>
      <p class="auth-subtitle">Login to your Campus Lost &amp; Found account</p>

      <form class="auth-form" id="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" type="email" placeholder="student@university.edu" required>
        </div>

        <div class="form-group">
          <div class="form-row">
            <label for="password">Password</label>
            <a href="#" class="form-link">Forgot password?</a>
          </div>
          <input id="password" type="password" required>
        </div>

        <p class="form-message" aria-live="polite"></p>
        <button type="submit" class="auth-submit">Sign In</button>
      </form>
    `,
    footerContent: "Don't have an account? <a href=\"#/register\">Register</a>",
  });
}
