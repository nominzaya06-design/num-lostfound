export function initFormSubmitGuards() {
  document.querySelectorAll('form').forEach(form => {
    const apiForms = ['home-filter-form', 'list-filter-form', 'lost-report-form', 'found-report-form', 'login-form', 'register-form'];
    if (apiForms.includes(form.id)) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const button = form.querySelector('button[type="submit"], .auth-submit, .form-submit');
      if (button) {
        const oldText = button.textContent;
        button.textContent = 'Submitted ✓';
        setTimeout(() => {
          button.textContent = oldText;
        }, 1200);
      }
    });
  });
}
