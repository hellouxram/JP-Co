/**
 * Post-build SEO step (runs after the client build and the SSR build of src/entry-server.tsx).
 *
 * 1. Pre-renders every route to static HTML (full page content inside #root) and writes a
 *    per-route copy of index.html (dist/services/index.html, …) with that page's <title>,
 *    description, Open Graph and Twitter tags baked in. Crawlers and link-preview bots see the
 *    complete page without running JavaScript; the browser then hydrates it with React.
 *    It also means deep links work on any static host without rewrite rules.
 * 2. Writes dist/404.html (noindex) for static hosts that serve it for unknown paths.
 * 3. Writes robots.txt. Only when the domain is verified (VITE_SITE_URL_VERIFIED=true) does it
 *    add canonical links, absolute og:url / og:image, a Sitemap line and sitemap.xml.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const env = { ...loadEnv('production', root, ''), ...process.env };

const verified = env.VITE_SITE_URL_VERIFIED === 'true';
const siteUrl = (env.VITE_SITE_URL || 'https://www.jpandcotech.com').replace(/\/+$/, '');
const meta = JSON.parse(await readFile(path.join(root, 'src/config/routes-meta.json'), 'utf8'));
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

// Server bundle produced by `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
process.env.NODE_ENV = 'production';
const { render: renderApp } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
const ROOT_EMPTY = '<div id="root"></div>';
if (!template.includes(ROOT_EMPTY)) throw new Error('postbuild-seo: empty <div id="root"></div> not found in index.html');
const inGithubActions = env.GITHUB_ACTIONS === 'true';
const stripTags = (h) => h.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();

/** Server-renders a URL and sanity-checks the result so a broken pre-render fails the build. */
function prerender(url) {
  const appHtml = renderApp(url);
  const h1 = appHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!h1) throw new Error(`postbuild-seo: pre-rendered ${url} has no <h1>`);
  const summary = `${url} → ${Math.round(appHtml.length / 1024)} KB, h1: "${stripTags(h1[1])}"`;
  console.log(`  ssr  ${summary}`);
  if (inGithubActions) console.log(`::notice title=Pre-rendered page::${summary}`);
  return appHtml;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  if (!re.test(html)) throw new Error(`postbuild-seo: <meta ${attr}="${key}"> not found in index.html`);
  return html.replace(re, `<meta ${attr}="${key}" content="${esc(value)}" />`);
}

/**
 * Organization + WebSite structured data for the home page. Only facts supplied in the brand
 * brief — no address, ratings or social profiles. Emitted only once the domain is verified.
 */
function structuredData() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: meta.siteName,
    description: meta.routes.find((r) => r.path === '/').description,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/apple-touch-icon.png`,
    email: 'ram@jpandcotech.com',
    founder: { '@type': 'Person', name: 'Lakshmi Narayana (Ram)', jobTitle: 'CEO & Founder' },
  };
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: meta.siteName, url: `${siteUrl}/` };
  const json = JSON.stringify([org, website]).replace(/</g, '\\u003c');
  return `    <script type="application/ld+json">${json}</script>\n`;
}

function render({ path: routePath, title, description }, { noindex = false, appHtml = '' } = {}) {
  let html = template.replace(ROOT_EMPTY, () => `<div id="root">${appHtml}</div>`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  if (noindex) html = setMeta(html, 'name', 'robots', 'noindex, follow');

  if (verified && routePath) {
    // Trailing slash matches how static hosts (GitHub Pages, Netlify) serve dist/<route>/index.html.
    const url = routePath === '/' ? `${siteUrl}/` : `${siteUrl}${routePath}/`;
    const image = `${siteUrl}${meta.ogImage}`;
    html = setMeta(html, 'property', 'og:image', image);
    html = setMeta(html, 'name', 'twitter:image', image);
    html = html.replace(
      '</head>',
      `    <link rel="canonical" href="${esc(url)}" />\n    <meta property="og:url" content="${esc(url)}" />\n${
        routePath === '/' ? structuredData() : ''
      }  </head>`,
    );
  }
  return html;
}

for (const route of meta.routes) {
  const out = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, route.path.slice(1), 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, render(route, { appHtml: prerender(route.path) }));
  console.log(`  seo  ${route.path.padEnd(10)} → ${path.relative(root, out)}`);
}

await writeFile(
  path.join(dist, '404.html'),
  render({ path: null, ...meta.notFound }, { noindex: true, appHtml: prerender('/404') }),
);
console.log('  seo  404        → dist/404.html (noindex)');

const robots = ['User-agent: *', 'Allow: /', ...(verified ? ['', `Sitemap: ${siteUrl}/sitemap.xml`] : []), ''].join('\n');
await writeFile(path.join(dist, 'robots.txt'), robots);

if (verified) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = meta.routes
    .map((r) => `  <url><loc>${siteUrl}${r.path === '/' ? '/' : `${r.path}/`}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  console.log(`  seo  sitemap.xml + canonical URLs for ${siteUrl}`);
} else {
  console.log('  seo  Domain not verified (VITE_SITE_URL_VERIFIED != "true"): skipped canonical, absolute OG URLs and sitemap.xml');
}
