/**
 * Server entry used only at build time (see scripts/postbuild-seo.mjs).
 * Renders a route to an HTML string so every page ships with its full content
 * in the HTML file. The browser then hydrates it with src/main.tsx.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
