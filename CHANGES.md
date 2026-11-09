# VITAS website — update bundle

Unzip this over the root of your local `Vitas-Limited` working copy (it mirrors
the repo structure), then commit and push. It contains 61 changed/new files.

## One deletion NOT in this zip (do it manually)
    git rm assets/img/badge-zero-toxins.svg
(retired "Zero toxins" badge — dead asset, no longer generated)

## One step to run locally before launch
The social-share PNG still shows the OLD slogan until you regenerate it:
    npm install playwright
    node src/make-og.mjs
(og-cover.svg in this zip is already updated; only the .png needs rasterizing)

## Source files changed
- src/data.mjs      slogan, hero lede, proof strip, disclaimer, trust + safety
                    lines, free-from list, purity marks, STANDARD table, medicine FAQ
- src/pages.mjs     hero eyebrow, purity lede, VITAS Standard section (homepage),
                    Prime/Perform/Recover band (how-to-use)
- src/layout.mjs    footer intro copy, global safety line, Xiaohongshu placeholder
- src/make-art.mjs  og-cover slogan/proof updated; zero-toxins badge removed
- assets/css/site.css   styles for .standard, .ppr, .footer__safety
- assets/img/social/xiaohongshu.svg   NEW placeholder icon
- docs/claims-guide.md   NEW — compliance/claims discipline for future copy

## Three decisions still open (outstanding list)
1. EU GMP -> EEC GMP: CONFIRMED by owner (9 Nov 2026) — "EEC GMP" is the certificate wording.
2. Children's age limit: RESOLVED — "under 5" on all topical products (owner, 9 Nov 2026).
3. "Trusted for over 20 years": owner chose this as the single time-span, now used consistently (incl. FAQ and footer). Still worth having a date on paper.

The regenerated HTML pages (EN + /zh/) and sitemap.xml are included so you can
commit without running the build yourself. If you prefer, you can instead run
`node src/build.mjs` after applying the src/ files and let it regenerate the HTML.
