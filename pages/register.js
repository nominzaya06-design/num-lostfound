import { authLayout } from '../components/authLayout.js';

export function register() {
  return authLayout({
    leftHeading: 'Join Our Community',
    rightContent: `
      <h1>Create Account</h1>
      <p class="auth-subtitle">Join the community to post and claim items</p>

      <form class="auth-form" id="register-form">
        <div class="form-group">
          <label for="fullname">Full Name</label>
          <input id="fullname" type="text" placeholder="John Doe" required>
        </div>

        <div class="form-group">
          <label for="email">University Email</label>
          <input id="email" type="email" placeholder="student@university.edu" required>
        </div>

        <div class="form-group">
          <label for="phone">Phone Number (Optional)</label>
          <input id="phone" type="tel" placeholder="+976 99 000 000">
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" minlength="6" required>
        </div>

        <p class="form-message" aria-live="polite"></p>
        <button type="submit" class="auth-submit">Create Account</button>
      </form>
    `,
    footerContent: "Already have an account? <a href=\"#/login\">Login</a>",
  });
}
