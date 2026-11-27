import { useEffect } from 'react';
import meta from '../config/routes-meta.json';
import { site } from '../config/site';

type PageMeta = { title: string; description: string };

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string | null) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Looks up SEO copy for a route from routes-meta.json (shared with the build-time SEO script). */
export function metaForPath(path: string): PageMeta {
  return meta.routes.find((r) => r.path === path) ?? meta.notFound;
}

/**
 * Keeps <title>, description, Open Graph and Twitter tags in sync on client-side navigation.
 * Canonical + og:url are only set when the domain has been verified (site.domainVerified).
 */
export function usePageMeta(path: string, opts: { noindex?: boolean } = {}) {
  const { title, description } = metaForPath(path);
  const { noindex = false } = opts;

  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

    if (site.domainVerified && !noindex) {
      // Trailing slash matches the static host's canonical form of dist/<route>/index.html.
      const url = new URL(path === '/' ? '/' : `${path}/`, site.url).toString();
      setCanonical(url);
      setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    } else {
      setCanonical(null);
    }
  }, [title, description, path, noindex]);
}
