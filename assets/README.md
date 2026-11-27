# Brand assets

## What is here

| File | Source | Used for |
|---|---|---|
| `source/linkedin_banner_final_1584x396.png` | Final approved LinkedIn banner, extracted unmodified from *JP_Co_Brand_Guidelines.docx* (v2.0) | Reference only (and LinkedIn cover). Not used as a website header or hero. |
| `source/email_signature_ram_1200x300.png` | Founder email signature, extracted unmodified from the guidelines | Reference only. Not used on the website. |
| `brand/jp-co-lockup-on-dark.{webp,png}` (672 × 158) | Crop of the lockup (monogram, divider, wordmark, descriptor) from the final banner, with the baked navy background removed | Header and footer logo, on navy only |
| `brand/jp-monogram-gold.{webp,png}` (162 × 158) | Crop of the gold JP monogram from the final banner, background removed | About page founder panel |
| `brand/jp-co-lockup-baked-reference.png` | Same crop with its original background left in place | Reference for checking the derived files |
| `../favicon-32.png`, `../apple-touch-icon.png` | Monogram on a `#0B1F3B` tile | Browser and home-screen icons |
| `../og-image-1200x630.png` | Lockup and tagline from the banner, centred on `#0B1F3B` | Open Graph and Twitter card image |

## How the logo files were made

The individual PNG kit files listed in the brief (`logo_usage_dark_reference.png`, `logo_monogram_gold_reference.png`, `hero_background_2400x1050.png` and so on) were not supplied with this build. The only approved artwork available was the final banner and email signature embedded in the brand guidelines document.

The logo files were cropped from the final banner at its native resolution. They were not redrawn, recoloured, stretched or retyped. The navy background was removed with a colour-to-alpha step: each pixel's opacity is worked out from its distance to the banner's background colour (`#04182B`). This keeps the letterforms and the gold gradient exactly as they appear in the banner, while letting the logo sit on the brand navy `#0B1F3B`, which is slightly lighter than the banner background.

**Limits.** These files are raster images at roughly 1× resolution for the header and below 1× for very large displays. They are fine as interim assets. Before launch, replace them with exports from a professionally redrawn vector master (see `TODO_BEFORE_LAUNCH.md`).

## Replacing the files

1. Export the new transparent lockup as WebP and PNG, and keep the filenames above. You can also use new filenames and update `brandAssets` in `src/config/site.ts`.
2. If the aspect ratio changes, update `width` and `height` in `brandAssets` so the browser reserves the right space and the layout doesn't shift as images load.
3. Use the lockup only on navy surfaces. A light-background (navy wordmark) version has not been approved yet.
4. If you want to use the asset kit's `hero_background_2400x1050.png`, add it to this folder and set `brandAssets.heroBackground` in `src/config/site.ts`. The built-in SVG ribbon is used until then.
