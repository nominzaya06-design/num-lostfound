export function NavCenter(routes) {
  const linksHTML = routes
    .filter(route => route.showInNav !== false)
    .map(route => `<a href="${route.lnk}">${route.item}</a>`)
    .join('');

  return `<div class="nav-center">${linksHTML}</div>`;
}
