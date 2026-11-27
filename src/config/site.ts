/**
 * Centralised brand + contact configuration.
 *
 * Every value here was supplied in the founder-approved brand brief (v2.0, 27 Nov 2026).
 * Edit this file — not individual components — to change names, contact data or URLs.
 *
 * IMPORTANT: the domain and mailbox are the *intended* brand contact details.
 * They have not been verified as owned/live. See TODO_BEFORE_LAUNCH.md.
 */

const env = import.meta.env;

export const site = {
  name: 'JP & Co.',
  /** Descriptive subtitle — not a legal entity suffix. */
  descriptor: 'Technology Company',
  tagline: 'Built on vision. Driven by innovation.',
  positioning: 'Founder-led AI, product design, software engineering and future B2B SaaS.',

  founder: {
    name: 'Lakshmi Narayana (Ram)',
    title: 'CEO & Founder',
  },

  contact: {
    email: 'ram@jpandcotech.com',
    emailHref: 'mailto:ram@jpandcotech.com',
    phoneDisplay: '9573319095',
    phoneHref: 'tel:+919573319095',
    websiteLabel: 'www.jpandcotech.com',
    websiteHref: 'https://www.jpandcotech.com',
  },

  /**
   * Canonical URLs, absolute OG URLs and sitemap.xml are only emitted once the
   * domain is verified as owned and serving this site. Set VITE_SITE_URL_VERIFIED=true
   * in your deployment environment after verification.
   */
  url: (env.VITE_SITE_URL as string | undefined) || 'https://www.jpandcotech.com',
  domainVerified: env.VITE_SITE_URL_VERIFIED === 'true',

  /**
   * Contact form submission endpoint (e.g. Formspree, Basin, or your own API) that accepts
   * a JSON POST. When empty, the form runs in "not connected" mode and only offers to open
   * the visitor's email app — it never claims a message was sent.
   */
  contactFormEndpoint: (env.VITE_CONTACT_FORM_ENDPOINT as string | undefined)?.trim() || '',
} as const;

export type NavItem = { label: string; to: string };

export const navigation: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Approach', to: '/approach' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

/**
 * Brand image assets (all under /public). The lockups are background-removed crops of the
 * approved v3 dark and light banners (see public/assets/README.md). Replace them with exports
 * from a professionally redrawn vector master when available — dimensions are declared here
 * so swapping files does not cause layout shift.
 */
export const brandAssets = {
  /** Gold monogram + ivory wordmark — dark theme and always-navy brand zones (footer). */
  lockupDark: {
    webp: '/assets/brand/jp-co-lockup-dark.webp',
    png: '/assets/brand/jp-co-lockup-dark.png',
    width: 523,
    height: 158,
    alt: 'JP & Co.',
  },
  /** Gold monogram + navy wordmark — light theme. */
  lockupLight: {
    webp: '/assets/brand/jp-co-lockup-light.webp',
    png: '/assets/brand/jp-co-lockup-light.png',
    width: 526,
    height: 166,
    alt: 'JP & Co.',
  },
  monogram: {
    webp: '/assets/brand/jp-monogram-gold.webp',
    png: '/assets/brand/jp-monogram-gold.png',
    width: 162,
    height: 158,
  },
  /** Optional raster hero accent from the asset kit. Leave null to use the built-in SVG ribbon. */
  heroBackground: null as null | { src: string; width: number; height: number },
} as const;
