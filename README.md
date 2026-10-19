# Leverup Liquidity website

Astro static site, hosted on Netlify (build: `npm run build`, publish `dist/`).

- Edit site-wide settings (phone, links, analytics IDs, dates): `src/data/site.ts`
- Page titles and descriptions: `src/data/meta.ts`
- FAQ answers: `src/data/faq.ts`
- Form consent wording: `src/data/consent.ts`
- Guide article text: `src/content/guides/factor-rate-vs-apr.md`
- Developer conventions: `BUILD-GUIDE.md`

Local: `npm install`, then `npm run dev`.

## Search engine indexing (IndexNow)

- Sitemap: `/sitemap-index.xml`, built by `@astrojs/sitemap`. Each URL's `<lastmod>` is the date of the last commit that changed that page (`tools/sitemap-lastmod.mjs`).
- IndexNow key file: `public/e5af999b4e3e75bc8fe912f732b78da7.txt` (key lives in `indexnow.config.mjs`; the build fails if they don't match).
- After every production deploy, `netlify/functions/indexnow.mts` submits new, changed and removed URLs to `https://api.indexnow.org/indexnow` (Bing, Yandex, Seznam, Naver, Yep). Logs: Netlify → Logs → Functions → indexnow.
- Test locally: `npx astro build && npm run test:indexnow`.
