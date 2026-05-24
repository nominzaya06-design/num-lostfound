
export function mountAdminStatsWidget() {
  const rootElement = document.getElementById('react-admin-stats-root');
  if (!rootElement) return;

  if (!window.React || !window.ReactDOM) {
    rootElement.innerHTML = `
      <section class="react-widget react-widget--fallback">
        <h3>Live Report Statistics</h3>
        <p>React library could not be loaded. Please check your internet connection.</p>
      </section>
    `;
    return;
  }

  const { createElement: h, useEffect, useMemo, useState } = window.React;
  const { createRoot } = window.ReactDOM;

  function AdminStatsWidget() {
    const [items, setItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [keyword, setKeyword] = useState('');
    const [message, setMessage] = useState('Loading report statistics...');

    useEffect(() => {
      let isMounted = true;

      async function loadAdminData() {
        try {
          const [itemsResponse, statsResponse] = await Promise.all([
            fetch('/api/items?limit=100', { credentials: 'include' }),
            fetch('/api/admin/stats', { credentials: 'include' })
          ]);

          const itemsData = itemsResponse.ok ? await itemsResponse.json() : { items: [] };
          const statsData = statsResponse.ok ? await statsResponse.json() : null;

          if (!isMounted) return;

          setItems(itemsData.items || []);
          setStats(statsData?.ok ? statsData.stats : null);
          setMessage('');
        } catch (error) {
          console.error(error);
          if (isMounted) setMessage('Statistics could not be loaded.');
        }
      }

      loadAdminData();

      return () => {
        isMounted = false;
      };
    }, []);

    const filteredItems = useMemo(() => {
      const text = keyword.trim().toLowerCase();

      return items.filter(item => {
        const statusMatches =
          selectedStatus === 'All' ||
          item.status === selectedStatus ||
          item.reportStatus === selectedStatus;

        const searchText = [
          item.title,
          item.description,
          item.location,
          item.category,
          item.status,
          item.reportStatus
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return statusMatches && (!text || searchText.includes(text));
      });
    }, [items, selectedStatus, keyword]);

    const computedStats = useMemo(() => {
      if (stats) {
        return {
          total: stats.total || 0,
          lost: stats.lost || 0,
          found: stats.found || 0,
          active: stats.active || 0,
          resolved: stats.resolved || 0,
          pendingClaims: stats.pending_claims || 0
        };
      }

      const lost = items.filter(item => item.status === 'Lost').length;
      const found = items.filter(item => item.status === 'Found').length;
      const resolved = items.filter(item => item.reportStatus === 'Resolved').length;

      return {
        total: items.length,
        lost,
        found,
        active: items.length - resolved,
        resolved,
        pendingClaims: 0
      };
    }, [items, stats]);

    return h('section', { className: 'react-widget' },
      h('header', { className: 'react-widget__header' },
        h('div', null,
          h('h3', null, 'Live Report Statistics'),
          h('p', null, 'Admin dashboard summary loaded from API data.')
        )
      ),

      h('div', { className: 'react-widget__stats' },
        h(StatBox, { label: 'Total', value: computedStats.total }),
        h(StatBox, { label: 'Lost', value: computedStats.lost }),
        h(StatBox, { label: 'Found', value: computedStats.found }),
        h(StatBox, { label: 'Active', value: computedStats.active }),
        h(StatBox, { label: 'Resolved', value: computedStats.resolved }),
        h(StatBox, { label: 'Claims', value: computedStats.pendingClaims })
      ),

      h('div', { className: 'react-widget__controls' },
        ['All', 'Lost', 'Found', 'Active', 'Resolved'].map(option =>
          h('button', {
            key: option,
            type: 'button',
            className: option === selectedStatus ? 'is-active' : '',
            onClick: () => setSelectedStatus(option)
          }, option)
        ),
        h('input', {
          type: 'search',
          placeholder: 'Search inside reports...',
          value: keyword,
          onChange: event => setKeyword(event.target.value)
        })
      ),

      message ? h('p', { className: 'react-widget__empty' }, message) : null,

      h('ul', { className: 'react-widget__list' },
        ...filteredItems.slice(0, 4).map(item =>
          h('li', { key: item.id },
            h('strong', null, item.title),
            h('span', null, `${item.status} · ${item.reportStatus} · ${item.location}`)
          )
        ),
        !message && filteredItems.length === 0
          ? h('li', { className: 'react-widget__empty' }, 'No matching reports')
          : null
      )
    );
  }

  function StatBox({ label, value }) {
    return h('article', { className: 'react-widget__stat' },
      h('strong', null, value),
      h('span', null, label)
    );
  }

  if (rootElement._reactRoot) {
    rootElement._reactRoot.unmount();
  }

  rootElement._reactRoot = createRoot(rootElement);
  rootElement._reactRoot.render(h(AdminStatsWidget));
}
