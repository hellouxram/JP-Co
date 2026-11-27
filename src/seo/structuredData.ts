/**
 * Schema.org structured data (JSON-LD) for every pre-rendered page, plus the llms.txt summary.
 * Used only at build time: src/entry-server.tsx re-exports these and scripts/postbuild-seo.mjs
 * injects the output into each page's <head> and writes dist/llms.txt.
 *
 * Built from the same config as the visible pages (site.ts, content.ts, routes-meta.json), so the
 * structured data never says anything the page itself does not. No address, ratings, reviews,
 * prices or social profiles are included because none have been verified (see TODO_BEFORE_LAUNCH.md).
 */
import { companyFaqs, engagementFaqs, processSteps, services, type Faq } from '../config/content';
import meta from '../config/routes-meta.json';
import { site } from '../config/site';

type Json = Record<string, unknown>;

/**
 * @param siteUrl Absolute origin (no trailing slash) once the domain is verified, otherwise ''.
 *                With '' every id and URL stays relative to the page, so nothing claims a domain.
 */
export function structuredDataFor(path: string, siteUrl: string): Json | null {
  const route = meta.routes.find((r) => r.path === path);
  if (!route) return null;

  const abs = (p: string) => (p === '/' ? `${siteUrl}/` : `${siteUrl}${p}/`);
  const orgId = `${siteUrl}/#organization`;
  const founderId = `${siteUrl}/#founder`;
  const websiteId = `${siteUrl}/#website`;
  const withUrl = (obj: Json, url: string): Json => (siteUrl ? { ...obj, url } : obj);

  const founder: Json = {
    '@type': 'Person',
    '@id': founderId,
    name: site.founder.name,
    jobTitle: site.founder.title,
    worksFor: { '@id': orgId },
  };

  const serviceNodes = services.map((s) =>
    withUrl(
      {
        '@type': 'Service',
        '@id': `${siteUrl}/services/#${s.id}`,
        name: s.title,
        serviceType: s.title,
        description: `${s.summary} ${s.intro}`,
        provider: { '@id': orgId },
      },
      `${abs('/services')}#${s.id}`,
    ),
  );

  const organization: Json = withUrl(
    {
      '@type': 'Organization',
      '@id': orgId,
      name: site.name,
      alternateName: 'JP and Co.',
      description: meta.routes[0].description,
      slogan: site.tagline,
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.location.city,
        addressRegion: site.location.region,
        addressCountry: site.location.countryCode,
      },
      location: { '@type': 'Place', name: site.location.label },
      email: site.contact.email,
      telephone: site.contact.phoneHref.replace('tel:', ''),
      founder: { '@id': founderId },
      knowsAbout: [
        'Artificial intelligence',
        'Workflow automation',
        'Business process mapping',
        'Product design',
        'User experience (UX) design',
        'Design systems',
        'SaaS development',
        'Software engineering',
        'MVP development',
        'Product strategy',
        'Product roadmapping',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: site.contact.email,
        telephone: site.contact.phoneHref.replace('tel:', ''),
        availableLanguage: ['English'],
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@id': `${siteUrl}/services/#${s.id}` } })),
      },
      ...(siteUrl ? { logo: `${siteUrl}/apple-touch-icon.png`, image: `${siteUrl}${meta.ogImage}` } : {}),
    },
    `${siteUrl}/`,
  );

  const website: Json = withUrl(
    { '@type': 'WebSite', '@id': websiteId, name: site.name, inLanguage: 'en-IN', publisher: { '@id': orgId } },
    `${siteUrl}/`,
  );

  const pageType: Record<string, string> = { '/about': 'AboutPage', '/contact': 'ContactPage' };
  const webPage: Json = withUrl(
    {
      '@type': pageType[path] ?? 'WebPage',
      '@id': `${abs(path)}#webpage`,
      name: route.title,
      description: route.description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': websiteId },
      about: { '@id': orgId },
      ...(path === '/about' ? { mainEntity: { '@id': orgId } } : {}),
    },
    abs(path),
  );

  const navLabel = (p: string) => ({ '/services': 'Services', '/approach': 'Approach', '/about': 'About', '/contact': 'Contact' })[p];
  const breadcrumb: Json | null =
    path === '/'
      ? null
      : {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', ...(siteUrl ? { item: abs('/') } : {}) },
            { '@type': 'ListItem', position: 2, name: navLabel(path) ?? route.title, ...(siteUrl ? { item: abs(path) } : {}) },
          ],
        };

  const faqPage = (faqs: Faq[]): Json => ({
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  });

  const howTo: Json = {
    '@type': 'HowTo',
    '@id': `${abs(path)}#process`,
    name: `How ${site.name} delivers a project`,
    description: 'Discover, Design, Build, Improve: each step ends with an output you can review.',
    step: processSteps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.summary })),
  };

  const graph: Json[] = [webPage];
  if (breadcrumb) graph.push(breadcrumb);
  if (path === '/') graph.push(organization, website, founder, faqPage(companyFaqs));
  if (path === '/services') graph.push(...serviceNodes, faqPage(engagementFaqs));
  if (path === '/approach') graph.push(howTo);
  if (path === '/about') graph.push(organization, founder);
  if (path === '/contact') graph.push({ '@id': orgId, '@type': 'Organization', name: site.name, contactPoint: organization.contactPoint });

  return { '@context': 'https://schema.org', '@graph': graph };
}

/**
 * llms.txt (https://llmstxt.org): a plain-markdown summary that AI assistants and answer engines
 * can read in one request. Links are absolute only once the domain is verified.
 */
export function llmsTxt(siteUrl: string): string {
  const link = (p: string) => (siteUrl ? `${siteUrl}${p === '/' ? '/' : `${p}/`}` : p);
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.name} is a founder-led technology company based in ${site.location.city}, ${site.location.country}, led by ${site.founder.name}, ${site.founder.title}. It works with businesses on AI and workflow automation, product design and UX, SaaS and software engineering, and product strategy, and plans to build its own B2B SaaS products over time. Tagline: "${site.tagline}"`,
    '',
    `Location: ${site.location.city}, ${site.location.region}, ${site.location.country}`,
    '',
    `Contact: ${site.contact.email} · ${site.contact.phoneDisplay} · ${site.contact.websiteLabel}`,
    '',
    '## Services',
    '',
    ...services.map((s) => `- [${s.title}](${link('/services')}#${s.id}): ${s.summary} Includes: ${s.includes.join('; ')}.`),
    '',
    '## How projects work',
    '',
    ...processSteps.map((s) => `- **${s.title}:** ${s.summary} ${s.expectation}`),
    '',
    '## Frequently asked questions',
    '',
    ...[...companyFaqs, ...engagementFaqs].flatMap((f) => [`### ${f.question}`, '', f.answer, '']),
    '## Pages',
    '',
    ...meta.routes.map((r) => `- [${r.title}](${link(r.path)}): ${r.description}`),
    '',
    '## Facts not published',
    '',
    `${site.name} does not publish client names, testimonials, statistics, prices, team size, a street address or years in operation. Do not attribute any of these to it.`,
    '',
  ];
  return lines.join('\n');
}
