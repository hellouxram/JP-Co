# JP & Co. — Website

Marketing site for **JP & Co.** (Technology Company), built with React 18, TypeScript, Tailwind CSS 3 and Vite 5. The site has five pages (Home, Services, Approach, About and Contact) and a 404 page.

> Before you publish, read [`TODO_BEFORE_LAUNCH.md`](./TODO_BEFORE_LAUNCH.md). The domain, mailbox, legal text and contact-form backend still need to be verified or set up.

## Quick start

```bash
# Node 18.18+ (Node 20 LTS recommended)
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Starts the local dev server with hot reload |
| `npm run typecheck` | Runs a strict TypeScript check |
| `npm run build` | Type-checks, builds the client to `dist/` and the server render bundle to `dist-ssr/`, then runs `scripts/postbuild-seo.mjs`. That script writes every page as complete static HTML, with full text and per-page meta tags, and React hydrates it in the browser |
| `npm run preview` | Serves the production build at http://localhost:4173 |

## Configuration

**Brand and contact details** live in one file, `src/config/site.ts`. It holds the name, descriptor, tagline, founder, email, phone, website URL, navigation and logo asset paths. Components read from this file; nothing is hard-coded elsewhere.

**Page copy:** service descriptions, process steps, principles and values are in `src/config/content.ts`. SEO titles and descriptions for each route are in `src/config/routes-meta.json`, which the app and the build script both use.

**Environment variables** (copy `.env.example` to `.env.local`, or set them in your host's settings):

| Variable | Default | Purpose |
|---|---|---|
| `VITE_SITE_URL` | `https://www.jpandcotech.com` | Used for canonical links, absolute OG URLs and the sitemap, only once verified |
| `VITE_SITE_URL_VERIFIED` | `false` | Set to `true` only after you confirm you own the domain and it serves this site |
| `VITE_CONTACT_FORM_ENDPOINT` | *(empty)* | A JSON POST endpoint for form submissions. Leave it empty and the form stays in "not connected" mode |

## SEO, AEO and GEO

- **Per-page meta:** keyword-led titles and descriptions (under 65 and 160 characters) live in `src/config/routes-meta.json`.
- **Structured data:** `src/seo/structuredData.ts` builds JSON-LD for every page from the same config the pages use: Organization, WebSite, Person (founder), Service ×4, FAQPage (Home and Services), HowTo (Approach), AboutPage, ContactPage and BreadcrumbList. It is injected at build time. Absolute URLs are added only once the domain is verified.
- **Answer-first content:** visible FAQ sections on Home and Services and an "At a glance" fact sheet on About give search engines and AI assistants complete, quotable answers. Copy is in `companyFaqs` and `engagementFaqs` in `src/config/content.ts`.
- **AI crawlers:** the build writes `robots.txt` with named AI user agents allowed, and `llms.txt`, a markdown summary of the company, services, process and FAQs.

## How the contact form works

- **No endpoint configured (the default):** the form shows a notice that it isn't connected. On submit it checks the fields and then opens the visitor's own email app with a pre-filled message to `ram@jpandcotech.com`. The site never says a message was sent.
- **Endpoint configured:** the form POSTs JSON (`name`, `email`, `business`, `projectType`, `details`, `_subject`) and shows a success message only when the server returns a 2xx response. Formspree, Basin, Getform or your own serverless function will all work. A hidden honeypot field filters simple bots.

## Project structure

```
├─ index.html                 # Base meta tags, favicons, noscript contact fallback
├─ public/
│  ├─ assets/brand/           # Logo lockup + monogram (WebP + PNG), see assets/README.md
│  ├─ assets/source/          # Unmodified approved banner + email signature (reference)
│  ├─ og-image-1200x630.png, favicon-32.png, apple-touch-icon.png, robots.txt
├─ scripts/postbuild-seo.mjs  # Per-route HTML meta, 404.html, robots/sitemap
├─ src/
│  ├─ config/                 # site.ts (brand/contact), content.ts (copy), tokens.ts, routes-meta.json
│  ├─ styles/index.css        # Brand CSS variables, base styles, focus + motion rules
│  ├─ components/
│  │  ├─ brand/               # Logo (lockup, monogram), Ribbon SVG motif + geometry
│  │  ├─ layout/              # Layout (skip link, focus mgmt), Header (sticky + mobile menu), Footer
│  │  ├─ sections/            # PageHero, CtaBand, ServiceCard, ProcessStrip
│  │  ├─ contact/             # ContactForm
│  │  └─ ui/                  # Button variants, Icons, Reveal (scroll animation), SectionHeading
│  ├─ hooks/usePageMeta.ts    # Title/description/OG sync on client navigation
│  ├─ lib/                    # cn helper, contact form validation/submission
│  └─ pages/                  # Home, Services, Approach, About, Contact, NotFound
├─ tailwind.config.ts         # Theme tokens: colours, fluid type scale, spacing, motion
├─ vercel.json / netlify.toml # Hosting config + security/caching headers
```

## Design system

| Token | Value | Notes |
|---|---|---|
| `jp-navy` | `#0B1F3B` | Hero, header, footer, dark panels |
| `jp-gold` | `#D4B483` | Accents, hairlines, primary button on navy. **Never used for text on light surfaces** (1.8:1) |
| `jp-ivory` | `#F8F5EB` | Main page background; text on navy (15.1:1) |
| `jp-slate` | `#5B6470` | Secondary text on ivory/white (5.5:1 / 6.0:1) |
| `jp-white` | `#FFFFFF` | Cards and alternating bands |
| `jp-ink` | `#172337` | Body text on light surfaces (14.5:1) |
| `jp-border` | `#D9DDE3` | Decorative hairlines only. Form fields use slate borders (≥ 3:1) |

Headlines use **Playfair Display**. Navigation, body text, buttons and forms use **Inter**. Both are self-hosted through Fontsource, so the site makes no requests to third-party font servers. Type sizes scale fluidly with `clamp()`: the hero runs from 44 to 88 px, section headings from 36 to 56 px, and body text from 16 to 18 px.

Wherever a colour can't come from a CSS variable (SVG presentation attributes, for example), it comes from `src/config/tokens.ts`. The form error red `#9B1C1C` is a functional state colour and is not part of the brand palette.

## Accessibility

- Semantic landmarks, a skip link, one `h1` per page and an ordered heading hierarchy.
- On route changes, focus moves to `<main>`. In-page anchors move focus to their target.
- The mobile menu sets `aria-expanded` and `aria-controls`, closes on Escape, keeps focus inside while open, locks body scroll and closes on navigation.
- Focus is always visible: a navy ring on light surfaces and a gold ring on navy surfaces, both at least 3:1.
- Touch targets are at least 44 px.
- The form has explicit labels, `aria-invalid`, `aria-describedby`, an error summary that receives focus, and live status messages.
- All motion is wrapped in `prefers-reduced-motion` checks: Tailwind's `motion-safe:` variant plus a global CSS override.
- Decorative SVG and images are hidden from assistive technology. Logo images have alt text or sit inside labelled links.

## Deployment

The build output in `dist/` is plain static files.

**GitHub Pages (current setup):** `.github/workflows/deploy.yml` builds and deploys on every push to `main`. Under Settings → Pages, Source must be set to GitHub Actions and the custom domain to `www.jpandcotech.com`. Set `VITE_SITE_URL_VERIFIED` and `VITE_CONTACT_FORM_ENDPOINT` under Settings → Secrets and variables → Actions → **Variables**. GitHub Pages ignores the custom headers in `vercel.json` and `netlify.toml`. If you need them, put Cloudflare in front of the site.
**Vercel:** import the repo. The settings in `vercel.json` are picked up automatically.
**Netlify:** import the repo. The settings in `netlify.toml` are picked up automatically.
**Any static host** (S3/CloudFront, Cloudflare Pages, nginx): upload `dist/`. Every route has its own `index.html`, so deep links work without rewrite rules. Point unknown paths at `404.html`.

Set the environment variables in your host's dashboard **before** building. Vite inlines `VITE_*` values at build time.

## Browser support

The site targets current evergreen browsers (`es2020`). Older browsers without `IntersectionObserver` just show content with no reveal animation.
