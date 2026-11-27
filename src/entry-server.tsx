/**
 * Server entry used only at build time.
 *  - render():       HTML + React hydration markers (scripts/postbuild-seo.mjs, React build)
 *  - renderStatic(): plain HTML without React markers (scripts/export-static.mjs, plain-HTML site)
 */
import { StrictMode } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

const tree = (url: string) => (
  <StrictMode>
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  </StrictMode>
);

export function render(url: string): string {
  return renderToString(tree(url));
}

export function renderStatic(url: string): string {
  return renderToStaticMarkup(tree(url));
}
