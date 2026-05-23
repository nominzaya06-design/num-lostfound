import './components/wc/num-status-badge.js';
import { Nav } from './components/nav.js';
import { MobileBottomNav } from './components/mobileBottomNav.js';
import { fetchItems } from './state/itemStore.js';
import { loadCurrentUser } from './state/sessionStore.js';

let routes = [];

async function loadRoutes() {
  const res = await fetch('./data/webpages.json');
  routes = await res.json();
}

function renderShell() {
  return `
    <header>
      ${Nav(routes)}
    </header>
    <div id="page-view"></div>
    ${MobileBottomNav()}
  `;
}

function getCurrentPath() {
  return window.location.hash.slice(1) || '/';
}

function getRoute(path) {
  const hashPath = `#${path}`;

  return routes.find(route => route.lnk === hashPath)
    || routes.find(route => route.base && path.startsWith(route.base))
    || routes[0];
}

function getRouteParams(path) {
  const [, page, id] = path.split('/');
  return { page, id };
}

async function loadPageContent() {
  const path = getCurrentPath();
  const route = getRoute(path);
  const pageView = document.getElementById('page-view');

  try {
    const module = await import(`./pages/${route.component}.js`);
    const renderPage = module[route.component];

    if (typeof renderPage !== 'function') {
      throw new Error(`Page renderer not found: ${route.component}`);
    }

    const items = await fetchItems();
    pageView.innerHTML = renderPage(items, getRouteParams(path));
  } catch (error) {
    console.error(error);
    pageView.innerHTML = `
      <main class="site-main page-width">
        <section class="surface modal-card">
          <h1>Page not found</h1>
          <p>The requested page could not be loaded.</p>
          <a class="btn-solid" href="#/">Back Home</a>
        </section>
      </main>
    `;
  }

  highlightActiveNav(path);
  await initPageScripts(route.component);
}

const pageScripts = {
  homepage: [initHomeSearch, initHomeFilters, initContactModal],
  lost: [initListFilters, initContactModal],
  found: [initListFilters, initContactModal],
  details: [initContactModal],
  report: [initReport, initFormGuards],
  login: [initAuth, initFormGuards],
  register: [initAuth, initFormGuards],
  profile: [initAuth, initProfile],
  admin: [initAdminTabs, initReactAdminWidget]
};

async function initPageScripts(componentName) {
  const initializers = pageScripts[componentName] || [];
  for (const init of initializers) {
    await init();
  }
}

async function initHomeSearch() {
  const { initSearchListeners } = await import('./eventListeners/search.js');
  initSearchListeners();
}

async function initHomeFilters() {
  const { initFilterListeners } = await import('./eventListeners/filters.js');
  initFilterListeners();
}

async function initListFilters() {
  const { initListPageFilters } = await import('./eventListeners/listPageFilters.js');
  initListPageFilters();
}

async function initAdminTabs() {
  const { initAdminTabs } = await import('./eventListeners/adminTabs.js');
  initAdminTabs();
}

async function initAuth() {
  const { initAuthListeners } = await import('./eventListeners/auth.js');
  initAuthListeners();
}

async function initReport() {
  const { initReportListeners } = await import('./eventListeners/report.js');
  initReportListeners();
}

async function initFormGuards() {
  const { initFormSubmitGuards } = await import('./eventListeners/forms.js');
  initFormSubmitGuards();
}

async function initContactModal() {
  const { initContactModal } = await import('./eventListeners/contactModal.js');
  initContactModal();
}

async function initProfile() {
  const { initProfileListeners } = await import('./eventListeners/profile.js');
  initProfileListeners();
}

async function initReactAdminWidget() {
  try {
    const { mountAdminStatsWidget } = await import('./assets/react-admin-widget.js');
    mountAdminStatsWidget();
  } catch (error) {
    console.warn('React admin widget was not loaded. Run npm start to build it.', error);
  }
}

function highlightActiveNav(path) {
  const firstSegment = path === '/' ? '/' : `/${path.split('/')[1]}`;
  const activeHref = `#${firstSegment}`;

  document.querySelectorAll('.nav-center a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === activeHref);
  });

  document.querySelectorAll('.bottom-nav a').forEach(link => {
    link.classList.toggle('mobile-active', link.getAttribute('href') === activeHref);
  });
}

async function render() {
  document.getElementById('app').innerHTML = renderShell();
  await loadPageContent();
}

(async () => {
  try {
    await loadRoutes();

    try {
      await loadCurrentUser();
    } catch (error) {
      console.warn('Could not load current user. Continue as guest.', error);
    }

    await render();
    window.addEventListener('hashchange', render);
  } catch (error) {
    console.error('Application failed to start.', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <main class="site-main page-width">
          <section class="surface modal-card">
            <h1>Application error</h1>
            <p>The application could not be loaded. Please check the console.</p>
          </section>
        </main>
      `;
    }
  }
})();
