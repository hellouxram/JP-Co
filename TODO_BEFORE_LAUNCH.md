# TODO before launch

This site uses only details the founder supplied in the brand brief (v2.0, 27 Nov 2026). Several of those still need to be confirmed before the site goes public. Tick items off as you go.

## 1. Domain and email
- [ ] Confirm that **jpandcotech.com** is registered to the business and that you control its DNS.
- [ ] Deploy the site and confirm that `https://www.jpandcotech.com` serves it over HTTPS. Decide whether the apex domain redirects to `www` or the other way round.
- [x] Canonical links, absolute OG URLs and `sitemap.xml` are switched on (the domain is serving the site).
- [ ] Confirm that the mailbox **ram@jpandcotech.com** exists and can receive mail. Send a test from Gmail and from Outlook. Set up SPF, DKIM and DMARC.
- [ ] Confirm the phone number **9573319095** (tel link `+919573319095`) is correct and answered during business hours.
- [ ] Click every `mailto:`, `tel:` and website link on desktop and mobile.

## 2. Legal and company
- [ ] Confirm the final legal entity name and whether it has been incorporated (MCA). The site deliberately shows only "JP & Co." with the descriptor "Technology Company" and no legal suffix. Add the registered name, CIN and registered address to the footer only once they exist.
- [ ] Get trademark clearance for "JP & Co." and the JP monogram in the relevant classes. Avoid any presentation that could be confused with financial institutions.
- [x] Write a full **Privacy Policy** (published at /privacy/ on 28 Nov 2026; have it reviewed by a lawyer, and confirm the 12-month retention period and 30-day response time suit you) covering the contact form, email handling, hosting and any analytics. India's DPDP Act 2023 is likely to apply. Link it from the footer and the form's privacy notice. The current notice is a short interim statement.
- [ ] Add **Terms of Use** if needed.
- [ ] Review all marketing copy for claims you can support. The site currently has no testimonials, client logos, statistics, team members, street address or years in operation. Keep it that way until each item is verified.

## 3. Brand assets

On 28 Nov 2026 the site's logos, favicons, app icons and share image were replaced with exports from the final logo kit (see `docs/ASSETS.md`). A light-background lockup now exists (`jp-co-lockup-on-light`).
- [ ] Commission a **professionally redrawn vector master** (SVG/AI/PDF) of the JP monogram and the JP & Co. lockup. The current logo files are background-removed crops of the approved LinkedIn banner (see `docs/ASSETS.md`).
- [ ] Get an approved **light-background lockup** (navy wordmark with gold monogram) if you ever need the logo on ivory. Until then the site only places the logo on navy.
- [ ] Replace `site/favicon-32.png` and `site/apple-touch-icon.png` with exports from the vector master, and add a 512 px icon for a web manifest if you want one.
- [ ] Review `og-image-1200x630.png` against the final artwork. Share a page on LinkedIn, WhatsApp and X to check the preview.
- [ ] Confirm usage rights or licensing for all imagery, including the banner's ribbon artwork.
- [ ] If the original asset kit (`logo_usage_dark_reference.png`, `hero_background_2400x1050.png` and so on) is used, check each file against the final banner before adding it.

## 4. Contact form

Connected to Formspree (`https://formspree.io/f/xqpqoabj`) on 28 Nov 2026. Still to do: a live test submission, allowed-domain and spam settings in Formspree, and the final privacy notice.
- [x] Choose a submission backend, such as Formspree, Basin, Getform or your own serverless function, that accepts a JSON POST and returns a 2xx response on success.
- [ ] Paste the endpoint into `data-endpoint=""` on the `<form>` in `site/contact/index.html`, then commit and push.
- [ ] Turn on spam protection at the provider (the honeypot is only a first line of defence). Consider rate limiting or a privacy-friendly CAPTCHA.
- [ ] Send test submissions. Confirm delivery to the inbox, check the error state (for example, with the endpoint temporarily broken) and confirm the success message appears only after real delivery.
- [ ] Update the form's privacy notice once the backend and retention policy are known.

## 5. Analytics and consent
- [ ] Decide whether you need analytics at all. If you do, prefer a cookieless, privacy-friendly tool.
- [ ] If any tool sets cookies or processes personal data, add a consent banner **before** loading it, and update the Privacy Policy.

## 6. Performance and images
- [ ] Run Lighthouse on the production build (mobile and desktop). Target 90+ for Performance, Accessibility, Best Practices and SEO.
- [ ] Compress the final vector-derived exports (WebP/AVIF) and keep each `<img>` tag's `width` and `height` in sync with the new files.
- [ ] Check there is no layout shift (CLS) while fonts and logos load.

## 7. Manual QA
- [ ] Test responsive layouts at 320, 375, 768, 1024, 1280 and 1920 px wide.
- [ ] Test in Safari (iOS and macOS), Chrome (Android and desktop), Firefox and Edge.
- [ ] Do a keyboard-only pass: skip link, nav, mobile menu (open, Tab cycling, Escape), all buttons, the form and its error summary.
- [ ] Do a screen reader pass with VoiceOver and NVDA: landmarks, headings, link names, form errors and status messages.
- [ ] Turn on reduced motion in the OS and confirm animations are off.
- [ ] Zoom to 200% and 400% and check that content reflows without horizontal scrolling.
- [ ] Proofread every page. Check spelling of **JP & Co.** (with ampersand and period), **Lakshmi Narayana (Ram)** and **CEO & Founder**.
- [ ] Visit a non-existent URL and confirm the 404 page appears and is `noindex`.
- [ ] Check `robots.txt`, and `sitemap.xml` once the domain is verified.
