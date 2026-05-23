// components/hero.js
export function HeroSection() {
  return `
    <section class="hero">
      <p class="hero-badge">NATIONAL UNIVERSITY OF MONGOLIA</p>
      <h1>
        <span>Find What You Lost,</span>
        <span class="hero-blue">Return What You Found</span>
      </h1>
      <div class="hero-search">
        <svg width="25" height="25" viewBox="0 -0.5 25 25" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 10.7655C5.50003 8.01511 7.44296 5.64777 10.1405 5.1113C12.8381 4.57483 15.539 6.01866 16.5913 8.55977C17.6437 11.1009 16.7544 14.0315 14.4674 15.5593C12.1804 17.0871 9.13257 16.7866 7.188 14.8415C6.10716 13.7604 5.49998 12.2942 5.5 10.7655Z" stroke="#000" stroke-width="1.5"/>
          <path d="M17.029 16.5295L19.5 19.0005" stroke="#000" stroke-width="1.5"/>
        </svg>
        <input type="text" placeholder="Search by item name, category, or location..." id="hero-search-input">
        <button id="hero-search-btn">Search</button>
      </div>
    </section>
  `;
}