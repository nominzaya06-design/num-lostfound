// Shared auth page layout used by login.js and register.js
export function authLayout({ leftHeading, leftSubtext, rightContent, footerContent }) {
  return `
    <main class="auth-page">
      <section class="auth-layout">

        <div class="auth-left">
          <img src="images/num-building.jpg" alt="NUM building">
          <div class="auth-overlay"></div>
          <div class="auth-left-text">
            <h2>${leftHeading}</h2>
            <p>Exclusively for National University of Mongolia —
              Staff, Faculty &amp; Students.</p>
          </div>
        </div>

        <div class="auth-card">
          <div class="auth-card-inner">
            ${rightContent}
          </div>
          <div class="auth-card-footer">
            ${footerContent}
          </div>
        </div>

      </section>
    </main>
  `;
}
