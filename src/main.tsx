import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Self-hosted variable fonts (no third-party font requests).
import '@fontsource-variable/inter';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import './styles/index.css';

import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

const app = (
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production pages are pre-rendered at build time (scripts/postbuild-seo.mjs), so attach to the
// existing HTML. The dev server serves an empty #root, so render from scratch there.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
