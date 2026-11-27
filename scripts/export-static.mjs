/**
 * Exports the site as framework-free HTML into ./static-site (used for the plain-HTML `main` branch).
 * Run after `npm run build` (needs dist/ and dist-ssr/). React is only used here as a template engine:
 * the output has no React runtime — behaviour comes from site/js/site.js on the main branch.
 */
import { cp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
process.env.NODE_ENV = 'production';
const { renderStatic } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);
const out = path.join(root, 'static-site');
await rm(out, { recursive: true, force: true });
await cp(path.join(root, 'dist'), out, { recursive: true });

const pages = {
  '/': 'index.html',
  '/services': 'services/index.html',
  '/approach': 'approach/index.html',
  '/about': 'about/index.html',
  '/contact': 'contact/index.html',
  '/404': '404.html',
};
for (const [url, file] of Object.entries(pages)) {
  const f = path.join(out, file);
  let html = await readFile(f, 'utf8');
  html = html.replace(/\s*<script type="module"[^>]*><\/script>/g, '').replace(/\s*<link rel="modulepreload"[^>]*>/g, '');
  const start = html.indexOf('<div id="root">');
  const bodyEnd = html.lastIndexOf('</body>');
  const end = html.lastIndexOf('</div>', bodyEnd);
  if (start < 0 || end < start) throw new Error('root not found in ' + file);
  html =
    html.slice(0, start) + renderStatic(url) + '\n    <script src="/js/site.js" defer></script>\n  ' + html.slice(end + 6).replace(/^\s*/, '');
  await writeFile(f, html);
  console.log('static', file, html.length);
}
for (const f of await readdir(path.join(out, 'static'))) if (f.endsWith('.js')) await rm(path.join(out, 'static', f));
