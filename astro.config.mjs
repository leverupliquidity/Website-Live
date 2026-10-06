import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://leverupliquidity.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(apply\/confirmation|404)$/.test(page.replace(/\/$/, '')),
    }),
  ],
  image: { responsiveStyles: false },
  compressHTML: true,
  cacheDir: '.cache/astro',
});
