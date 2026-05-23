export function initAdminTabs() {
  const tabs = [...document.querySelectorAll('.admin-tab')];
  const panels = [...document.querySelectorAll('.admin-panel')];
  const title = document.getElementById('admin-title');

  if (tabs.length && panels.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;

        tabs.forEach(item => item.classList.remove('is-active'));
        tab.classList.add('is-active');

        panels.forEach(panel => {
          panel.classList.toggle('is-active', panel.id === `panel-${target}`);
        });

        if (title) {
          title.textContent = target === 'dashboard' ? 'Dashboard' : 'Manage Posts';
        }
      });
    });
  }

  initAdminSearch();
}

function initAdminSearch() {
  const input = document.querySelector('[data-admin-search]');
  const rows = [...document.querySelectorAll('.admin-table tbody tr')];
  if (!input || !rows.length || input.dataset.bound === 'true') return;
  input.dataset.bound = 'true';

  input.addEventListener('input', () => {
    const keyword = input.value.trim().toLowerCase();

    rows.forEach(row => {
      row.hidden = keyword && !row.textContent.toLowerCase().includes(keyword);
    });
  });
}
