/**
 * Post-build SEO step (runs after `vite build`).
 *
 * 1. Writes a per-route copy of index.html (dist/services/index.html, …) with that page's
 *    <title>, description, Open Graph and Twitter tags baked in, so crawlers and link-preview
 *    bots that don't run JavaScript still see the right metadata. It also means deep links work
 *    on any static host without rewrite rules.
 * 2. Writes dist/404.html (noindex) for static hosts that serve it for unknown paths.
 * 3. Writes robots.txt. Only when the domain is verified (VITE_SITE_URL_VERIFIED=true) does it
 *    add canonical links, absolute og:url / og:image, a Sitemap line and sitemap.xml.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const env = { ...loadEnv('production', root, ''), ...process.env };

const verified = env.VITE_SITE_URL_VERIFIED === 'true';
const siteUrl = (env.VITE_SITE_URL || 'https://www.jpandcotech.com').replace(/\/+$/, '');
const meta = JSON.parse(await readFile(path.join(root, 'src/config/routes-meta.json'), 'utf8'));
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  if (!re.test(html)) throw new Error(`postbuild-seo: <meta ${attr}="${key}"> not found in index.html`);
  return html.replace(re, `<meta ${attr}="${key}" content="${esc(value)}" />`);
}

function render({ path: routePath, title, description }, { noindex = false } = {}) {
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
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
      `    <link rel="canonical" href="${esc(url)}" />\n    <meta property="og:url" content="${esc(url)}" />\n  </head>`,
    );
  }
  return html;
}

for (const route of meta.routes) {
  const out = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, route.path.slice(1), 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, render(route));
  console.log(`  seo  ${route.path.padEnd(10)} → ${path.relative(root, out)}`);
}

await writeFile(path.join(dist, '404.html'), render({ path: null, ...meta.notFound }, { noindex: true }));
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
