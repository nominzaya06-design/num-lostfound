// components/AFSearchtype.js
export function AFSearchType(label, options) {
  const optionsHTML = options.map(opt => `<option>${opt}</option>`).join('');
  let name;
  if (label === 'Location') name = 'locationFilter';
  else if (label === 'Category') name = 'categoryFilter';
  else if (label === 'Status') name = 'Status';
  else if (label === 'Sort by') name = 'SortBy';
  else name = label.toLowerCase();
  
  return `
    <div class="SearchType">
      <div class="AdvancedFilterHeader">${label}</div>
      <select class="FilterButton" name="${name}">
        ${optionsHTML}
      </select>
    </div>
  `;
}