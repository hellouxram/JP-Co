# JP & Co. — Website (plain HTML)

This is the website for **JP & Co.** (Technology Company), live at https://www.jpandcotech.com. It is plain HTML, CSS and a small JavaScript file, with no framework and no build step. Every page is a complete HTML file, so search engines read all of the content straight from the page.

> The original React + TypeScript + Tailwind source is kept on the **`react-source`** branch of this repository. It is no longer used to build the live site.

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
├─ js/site.js              Menu, scroll reveal, hero motion, contact form, footer year
├─ fonts/                  Self-hosted Inter + Playfair Display (no third-party requests)
├─ assets/brand/           Logo lockup + monogram (WebP + PNG)
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

Brand colours are navy `#0B1F3B`, gold `#D4B483`, ivory `#F8F5EB`, slate `#5B6470`, ink `#172337` and border `#D9DDE3`. Don't use gold for text on light backgrounds; it doesn't meet contrast requirements.

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
