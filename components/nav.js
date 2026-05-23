
import { LeftNav } from './leftNav.js';
import { NavCenter } from './navCenterLinksToPages.js';
import { NavRight } from './navRight.js';

export function Nav(routes) {
  return `
    <nav class="nav">
      ${LeftNav()}
      ${NavCenter(routes)}
      ${NavRight()}
    </nav>
  `;
}