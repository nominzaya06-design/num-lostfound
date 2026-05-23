import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

// React Hooks нь зөвхөн Admin dashboard-ийн жижиг statistics хэсэгт ашиглагдана.
// Үндсэн сайт Vanilla JavaScript SPA хэвээр байна.
export function mountAdminStatsWidget() {
  const rootElement = document.getElementById('react-admin-stats-root');
  if (!rootElement) return;

  if (rootElement._reactRoot) {
    rootElement._reactRoot.unmount();
  }

  rootElement._reactRoot = createRoot(rootElement);
  rootElement._reactRoot.render(<AdminStatsWidget />);
}

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

  return (
    <section className="react-widget">
      <header className="react-widget__header">
        <div>
          <h3>Live Report Statistics</h3>
          <p>Admin dashboard summary loaded from API data.</p>
        </div>
      </header>

      <div className="react-widget__stats">
        <StatBox label="Total" value={computedStats.total} />
        <StatBox label="Lost" value={computedStats.lost} />
        <StatBox label="Found" value={computedStats.found} />
        <StatBox label="Active" value={computedStats.active} />
        <StatBox label="Resolved" value={computedStats.resolved} />
        <StatBox label="Claims" value={computedStats.pendingClaims} />
      </div>

      <div className="react-widget__controls">
        {['All', 'Lost', 'Found', 'Active', 'Resolved'].map(option => (
          <button
            key={option}
            type="button"
            className={option === selectedStatus ? 'is-active' : ''}
            onClick={() => setSelectedStatus(option)}
          >
            {option}
          </button>
        ))}

        <input
          type="search"
          placeholder="Search inside reports..."
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
        />
      </div>

      {message ? <p className="react-widget__empty">{message}</p> : null}

      <ul className="react-widget__list">
        {filteredItems.slice(0, 4).map(item => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <span>{item.status} · {item.reportStatus} · {item.location}</span>
          </li>
        ))}

        {!message && filteredItems.length === 0 ? (
          <li className="react-widget__empty">No matching reports</li>
        ) : null}
      </ul>
    </section>
  );
}

function StatBox({ label, value }) {
  return (
    <article className="react-widget__stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
