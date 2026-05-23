import { CATEGORY_OPTIONS, LOCATION_OPTIONS, optionTags } from '../constants/filterOptions.js';
import { getCurrentUser } from '../state/sessionStore.js';

export function report() {
  if (!getCurrentUser()) {
    return `
      <main class="site-main page-width">
        <section class="surface login-required-card">
          <h1>Sign in required</h1>
          <p>Please sign in before posting a Lost or Found report.</p>
          <div class="card-actions">
            <a class="btn-solid" href="#/login">Sign In</a>
            <a class="btn-outline" href="#/register">Create Account</a>
          </div>
        </section>
      </main>
    `;
  }

  return `
    <main class="site-main">
      <section class="form-page">
        <h1>Report an Item</h1>
        <p>Help us keep the campus community safe and connected.</p>

        <!-- TOGGLE: Lost / Found сонголт -->
        <input 
          class="report-controller" 
          type="radio" 
          name="report-state" 
          id="report-lost" 
          checked
        >

        <input 
          class="report-controller" 
          type="radio" 
          name="report-state" 
          id="report-found"
        >

        <div class="form-card surface">
          <div class="report-tabs">
            <label class="report-tab" for="report-lost">
              I Lost Something
            </label>

            <label class="report-tab" for="report-found">
              I Found Something
            </label>
          </div>

          <!-- LOST FORM: Алдагдсан зүйл оруулах form -->
          <section class="form-panel form-panel--lost">
            <form class="form-stack" id="lost-report-form">
              <div class="form-group">
                <label for="lost-item-name">Item Name *</label>
                <input 
                  id="lost-item-name" 
                  type="text" 
                  placeholder="e.g., Blue Nike Backpack, Keys with Honda tag"
                  required
                >
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="lost-category">Category *</label>
                  <select id="lost-category">
                    ${optionTags(CATEGORY_OPTIONS, 'Select category')}
                  </select>
                </div>

                <div class="form-group">
                  <label for="lost-location">Location *</label>
                  <select id="lost-location">
                    ${optionTags(LOCATION_OPTIONS, 'Select building/area')}
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="date-lost">Date Lost *</label>
                <input id="date-lost" type="date" required>
              </div>

              <div class="form-group">
                <label for="lost-description">Detailed Description *</label>
                <textarea 
                  id="lost-description" 
                  placeholder="Provide details, unique identifying marks, contents, etc."
                ></textarea>
              </div>

              <div class="form-group">
                <label>Image Upload</label>

                <label class="upload-box" for="lost-upload">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect 
                      x="3" 
                      y="4" 
                      width="18" 
                      height="16" 
                      rx="2" 
                      stroke="currentColor" 
                      stroke-width="1.8"
                    />
                    <path 
                      d="M8 14l2.5-2.5 2 2 3.5-4 2 3" 
                      stroke="currentColor" 
                      stroke-width="1.8" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    />
                    <circle 
                      cx="9" 
                      cy="9" 
                      r="1.2" 
                      fill="currentColor"
                    />
                  </svg>

                  <div>
                    <strong>Click to upload an image</strong>
                    <p>PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </label>

                <input id="lost-upload" type="file" accept="image/png,image/jpeg,image/webp" hidden>
              </div>

              <section class="form-stack" aria-label="Contact information">
                <h2>Contact Information</h2>

                <div class="form-grid">
                  <div class="form-group">
                    <label for="lost-phone">Phone Number</label>
                    <input 
                      id="lost-phone" 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                    >
                  </div>

                  <div class="form-group">
                    <label for="lost-email">Email Address *</label>
                    <input 
                      id="lost-email" 
                      type="email" 
                      placeholder="student@university.edu"
                      required
                    >
                  </div>
                </div>
              </section>

              <p class="form-message" aria-live="polite"></p>

              <button class="form-submit form-submit--lost" type="submit">
                Submit Lost Item Report
              </button>
            </form>
          </section>

          <!-- FOUND FORM: Олсон зүйл оруулах form -->
          <section class="form-panel form-panel--found">
            <form class="form-stack" id="found-report-form">
              <div class="form-group">
                <label for="found-item-name">Item Name *</label>
                <input 
                  id="found-item-name" 
                  type="text" 
                  placeholder="e.g., Blue Nike Backpack, Keys with Honda tag"
                  required
                >
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="found-category">Category *</label>
                  <select id="found-category">
                    ${optionTags(CATEGORY_OPTIONS, 'Select category')}
                  </select>
                </div>

                <div class="form-group">
                  <label for="found-location">Location *</label>
                  <select id="found-location">
                    ${optionTags(LOCATION_OPTIONS, 'Select building/area')}
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="date-found">Date Found *</label>
                <input id="date-found" type="date" required>
              </div>

              <div class="form-group">
                <label for="found-description">Detailed Description *</label>
                <textarea 
                  id="found-description" 
                  placeholder="Provide details, unique identifying marks, contents, etc."
                ></textarea>
              </div>

              <div class="form-group">
                <label>Image Upload</label>

                <label class="upload-box" for="found-upload">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect 
                      x="3" 
                      y="4" 
                      width="18" 
                      height="16" 
                      rx="2" 
                      stroke="currentColor" 
                      stroke-width="1.8"
                    />
                    <path 
                      d="M8 14l2.5-2.5 2 2 3.5-4 2 3" 
                      stroke="currentColor" 
                      stroke-width="1.8" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    />
                    <circle 
                      cx="9" 
                      cy="9" 
                      r="1.2" 
                      fill="currentColor"
                    />
                  </svg>

                  <div>
                    <strong>Click to upload an image</strong>
                    <p>PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </label>

                <input id="found-upload" type="file" accept="image/png,image/jpeg,image/webp" hidden>
              </div>

              <section class="form-stack" aria-label="Contact information">
                <h2>Contact Information</h2>

                <div class="form-grid">
                  <div class="form-group">
                    <label for="found-phone">Phone Number</label>
                    <input 
                      id="found-phone" 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                    >
                  </div>

                  <div class="form-group">
                    <label for="found-email">Email Address *</label>
                    <input 
                      id="found-email" 
                      type="email" 
                      placeholder="student@university.edu"
                      required
                    >
                  </div>
                </div>
              </section>

              <p class="form-message" aria-live="polite"></p>

              <button class="form-submit form-submit--found" type="submit">
                Submit Found Item Report
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  `;
}