import { createRoot } from 'react-dom/client';
import App from '@src/app';
import tailwindcssOutput from '../dist/tailwind-output.css?inline';

const root = document.createElement('div');
root.id = '1browser-extension-content-view-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

if (navigator.userAgent.includes('Firefox')) {
  /**
   * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
   * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
   *
   * Injecting styles into the document, this may cause style conflicts with the host page
   */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = tailwindcssOutput;
  shadowRoot.appendChild(styleElement);
} else {
  /** Inject styles into shadow dom */
  const globalStyleSheet = new CSSStyleSheet();
  const colorScheme = document.documentElement.getAttribute('data-mantine-color-scheme') ?? 'light';
  root.setAttribute('data-mantine-color-scheme', colorScheme);
  globalStyleSheet.replaceSync(
    tailwindcssOutput
      .replaceAll(':root', ':host')
      .replaceAll(':host[data-mantine-color-scheme=light]', ':host([data-mantine-color-scheme=light])')
      .replaceAll(':host[data-mantine-color-scheme=dark]', ':host([data-mantine-color-scheme=dark])'),
  );
  shadowRoot.adoptedStyleSheets = [globalStyleSheet];
}

shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(<App />);
