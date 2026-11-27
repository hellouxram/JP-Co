# JP & Co. — Website (plain HTML)

This is the website for **JP & Co.** (Technology Company), live at https://www.jpandcotech.com. It is plain HTML, CSS and a small JavaScript file, with no framework and no build step. The site has **light and dark themes**: it follows the visitor's system setting, and the sun/moon button in the header lets them choose. Every page is a complete HTML file, so search engines read all of the content straight from the page.

> The React + TypeScript + Tailwind source is kept on the **`react-source`** branch. It works as the design system and page template. Every push there triggers the "Export plain HTML" workflow, which writes framework-free output to the `static-export` branch. The pages in `site/` were produced that way. You can edit them directly, but a later re-export from `react-source` would replace hand edits.

## Structure

```
site/                      ← everything in here is published
├─ index.html              Home
├─ services/index.html     Services
├─ approach/index.html     Approach
├─ about/index.html        About
├─ contact/index.html      Contact (enquiry form)
├─ 404.html                Not-found page (noindex)
├─ css/site.css            All styles (compiled from the Tailwind design system)
├─ js/site.js              Theme toggle, menu, scroll reveal, hero motion, contact form, footer year
├─ fonts/                  Self-hosted Inter + Playfair Display (no third-party requests)
├─ assets/brand/           Light + dark logo lockups, monogram (WebP + PNG)
├─ og-image-1200x630.png, favicon-32.png, apple-touch-icon.png
├─ robots.txt, sitemap.xml, CNAME
brand-source/              Original approved banner, email signature, reference crop (not published)
docs/ASSETS.md             How the logo files were derived
.github/workflows/deploy.yml   Publishes /site to GitHub Pages on every push to main
```

## Editing content

Open the page's `index.html` and edit the text directly. Keep these in mind:

- **Header and footer are repeated in every page.** If you change navigation, contact details or the footer, make the same edit in all six HTML files. Find-and-replace across the `site/` folder is the easiest way to do this.
- **Each page's `<head>` has its own SEO tags:** `<title>`, `<meta name="description">`, Open Graph/Twitter tags and `<link rel="canonical">`. Update them when a page's topic changes.
- **Styling uses the existing utility classes** in `css/site.css`, such as `text-jp-navy`, `bg-jp-ivory`, `py-section` and `text-h2`. Only classes already used somewhere on the site exist in the stylesheet. To add new visual styles, add plain CSS at the end of `site.css`.
- **Keep internal links ending in `/`** (for example `/services/`). This avoids a redirect on GitHub Pages.
- **After adding or removing a page,** update `sitemap.xml`.

## Light and dark themes

- **Before first paint,** an inline script in each page's `<head>` sets `data-theme="light"` or `"dark"` on `<html>`. It uses the visitor's saved choice if there is one, otherwise their system setting, so the page never flashes the wrong theme. Without JavaScript, CSS follows `prefers-color-scheme`.
- **The header toggle** is a button with `aria-label="Dark theme"` and `aria-pressed`. A choice is saved in `localStorage` (`jp-theme`) only after the visitor clicks it. Until then the site follows the operating-system setting, even when it changes.
- **Colours are semantic tokens** defined at the top of `css/site.css`: `--c-page`, `--c-surface`, `--c-raised`, `--c-fg`, `--c-muted`, `--c-line`, `--c-accent`, `--c-accent-ink`, `--c-btn` and so on, with one set of values for each theme. Use classes such as `bg-page`, `bg-surface`, `text-fg`, `text-muted`, `border-line`, `text-accent-ink` and `card`. Don't hard-code colours.
- **The footer, the founder tile and feature bands** (`surface-brand`) stay deep navy in both themes, as the brand anchor.
- **Logos:** the header shows the navy-wordmark lockup in light mode and the ivory-wordmark lockup in dark mode. The `.show-light` / `.show-dark` CSS classes handle the switch.

| Token | Light | Dark |
|---|---|---|
| Page / surface / raised | `#FFFFFF` / `#F8F5EB` / `#FFFFFF` | `#071527` / `#0B1F3B` / `#132B49` |
| Text / muted | `#0B1F3B` / `#5B6470` | `#F8F5EB` / `#B8C3D0` |
| Border | `#D9DDE3` | `#2C4159` |
| Gold accent / small gold text | `#A47C38` / `#8C6826` | `#D4B483` / `#D4B483` |
| Primary button | `#0B1F3B` + white | `#D4B483` + `#071527` |
| Focus outline | `#765319` | `#F3D79B` |

**Accessibility deviation from the brief:** `#A47C38` measures only 3.8:1 on white and 3.5:1 on ivory, which fails WCAG AA for small text. Small gold text in light mode (eyebrows, active links) therefore uses `#8C6826` (5.1:1 on white, 4.7:1 on ivory). `#A47C38` is kept for icons, hovers and large text. Champagne `#D4B483` is decoration only on light backgrounds.

## Contact form

By default the form isn't connected to a sending service. It checks the fields, then opens the visitor's email app with the message addressed to ram@jpandcotech.com.

To connect it to Formspree (or any service that accepts a JSON POST):

1. Create a form at formspree.io and copy its endpoint, for example `https://formspree.io/f/abcd1234`.
2. In `site/contact/index.html`, find `<form data-contact-form="" data-endpoint=""` and paste the endpoint between the quotes of `data-endpoint`.
3. Commit and push. `site.js` then switches the button to "Send Enquiry" and removes the "not connected" notice. It shows a success message only after the service confirms delivery.

## Deploying

Every push to `main` publishes the `site/` folder through GitHub Actions (`.github/workflows/deploy.yml`). The custom domain `www.jpandcotech.com` is set in **Settings → Pages**. The `site/CNAME` file is only there in case you switch Pages to "Deploy from a branch".

To check pages on your computer before pushing, run a local web server from the `site` folder. A server is needed because the pages use absolute paths like `/css/site.css`:

```bash
cd site
python3 -m http.server 8080   # then open http://localhost:8080
```

## SEO checklist

- [x] Complete HTML on every page: one `<h1>`, a logical heading order, descriptive links
- [x] A unique title and description on every page, plus Open Graph and Twitter cards
- [x] Canonical URLs, `sitemap.xml`, `robots.txt`, Organization and WebSite structured data
- [x] Fast pages: no framework JavaScript, self-hosted fonts, WebP logo
- [ ] Verify the domain in Google Search Console, submit `sitemap.xml` and request indexing
- [ ] Turn on **Enforce HTTPS** in Settings → Pages
- [ ] Link to the site from LinkedIn, email signatures and directories
