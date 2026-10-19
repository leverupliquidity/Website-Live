import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { lastmodFor } from './tools/sitemap-lastmod.mjs';
import { INDEXNOW_KEY } from './indexnow.config.mjs';

// Fail the build early if the IndexNow key file at the site root is missing or
// doesn't match the key the deploy hook sends. A mismatch makes every
// IndexNow submission fail with 403, silently.
function indexNowKeyCheck() {
  return {
    name: 'indexnow-key-check',
    hooks: {
      'astro:config:setup': () => {
        const file = new URL(`./public/${INDEXNOW_KEY}.txt`, import.meta.url);
        let contents = '';
        try { contents = readFileSync(file, 'utf8').trim(); } catch { /* handled below */ }
        if (contents !== INDEXNOW_KEY) {
          throw new Error(`IndexNow: public/${INDEXNOW_KEY}.txt must exist and contain exactly the key.`);
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://leverupliquidity.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    indexNowKeyCheck(),
    sitemap({
      filter: (page) => !/\/(apply\/confirmation|404)$/.test(page.replace(/\/$/, '')),
      // Real per-page <lastmod> from git history (see tools/sitemap-lastmod.mjs).
      // Bing and Google both use lastmod to decide what to recrawl; the IndexNow
      // deploy hook uses it to decide what to submit. changefreq/priority are
      // left out on purpose: both engines ignore them.
      serialize(item) {
        const lastmod = lastmodFor(item.url);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  image: { responsiveStyles: false },
  compressHTML: true,
  cacheDir: '.cache/astro',
});
