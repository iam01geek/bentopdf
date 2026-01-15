import { APP_VERSION } from '../../version.js';
import { createLanguageSwitcher } from '../i18n/language-switcher.js';

// Handle simple mode footer replacement for tool pages
if (__SIMPLE_MODE__) {
  const footer = document.querySelector('footer');
  if (footer && !document.querySelector('[data-simple-footer]')) {
    footer.style.display = 'none';

    const simpleFooter = document.createElement('footer');
    simpleFooter.className = 'mt-16 border-t-2 border-gray-700 py-8';
    simpleFooter.setAttribute('data-simple-footer', 'true');
    simpleFooter.innerHTML = `
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p class="text-gray-500 text-xs mt-2">
              Version <span id="app-version-simple">${APP_VERSION}</span>
            </p>
          </div>
          <div id="simple-mode-lang-switcher" class="flex-shrink-0"></div>
        </div>
      </div>
    `;
    document.body.appendChild(simpleFooter);

    const langContainer = simpleFooter.querySelector('#simple-mode-lang-switcher');
    if (langContainer) {
      const switcher = createLanguageSwitcher();
      const dropdown = switcher.querySelector('div[role="menu"]');
      if (dropdown) {
        dropdown.classList.remove('mt-2');
        dropdown.classList.add('bottom-full', 'mb-2');
      }
      langContainer.appendChild(switcher);
    }
  }
}