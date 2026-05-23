// components/wc/num-status-badge.js
// Web Component: Lost / Found төлөвийг өөрийн custom tag-аар харуулах.
class NumStatusBadge extends HTMLElement {
  static get observedAttributes() {
    return ['status'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const rawStatus = this.getAttribute('status') || 'Lost';
    const status = rawStatus.toLowerCase() === 'found' ? 'found' : 'lost';
    const label = status === 'found' ? 'Found' : 'Lost';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          flex-shrink: 0;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 1.45rem;
          padding: 0.28rem 0.65rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
        }

        .badge--found {
          background-color: #e6f6ed;
          color: #41b06e;
        }

        .badge--lost {
          background-color: #fdeceb;
          color: #e65c52;
        }
      </style>

      <span class="badge badge--${status}">${label}</span>
    `;
  }
}

if (!customElements.get('num-status-badge')) {
  customElements.define('num-status-badge', NumStatusBadge);
}
