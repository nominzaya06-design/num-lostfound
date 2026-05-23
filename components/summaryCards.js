export function SummaryCards(items) {
  const summary = items.reduce((acc, item) => {
    acc.total++;
    if (item.status === 'Lost') acc.lost++;
    if (item.status === 'Found') acc.found++;
    acc.locations.add(item.location);
    return acc;
  }, {
    total: 0,
    lost: 0,
    found: 0,
    locations: new Set()
  });

  return `
    <section class="summary-grid">
      <article class="summary-card">
        <strong>${summary.total}</strong>
        <span>Total Items</span>
      </article>
      <article class="summary-card">
        <strong>${summary.lost}</strong>
        <span>Lost Posts</span>
      </article>
      <article class="summary-card">
        <strong>${summary.found}</strong>
        <span>Found Posts</span>
      </article>
      <article class="summary-card">
        <strong>${summary.locations.size}</strong>
        <span>Active Locations</span>
      </article>
    </section>
  `;
}
