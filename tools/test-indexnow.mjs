// Dry run of the IndexNow deploy hook against the local build.
// Usage: npx astro build && node tools/test-indexnow.mjs
// Serves dist/ in memory, fakes the IndexNow endpoint, and checks the diff logic.

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { INDEXNOW_KEY, SITE, KEY_LOCATION, INDEXNOW_ENDPOINT } from '../indexnow.config.mjs';
import { readSitemap, diffSitemaps, keyFileIsLive, submit, parseSitemap } from '../netlify/lib/indexnow-core.mjs';

const dist = new URL('../dist/', import.meta.url);
const sent = [];
const fakeFetch = async (input, init = {}) => {
  const url = new URL(input);
  if (url.href.startsWith(INDEXNOW_ENDPOINT)) {
    sent.push(JSON.parse(init.body));
    return new Response(null, { status: 200 });
  }
  assert.equal(url.origin, SITE);
  try {
    return new Response(readFileSync(new URL('.' + url.pathname, dist)));
  } catch {
    return new Response('not found', { status: 404 });
  }
};

// Parser: an entry with no <lastmod> must not borrow the next entry's date.
const p = parseSitemap('<urlset><url><loc>https://a/x</loc></url><url><loc>https://a/y</loc><lastmod>2026-01-01</lastmod></url></urlset>');
assert.deepEqual(p.urls, [{ loc: 'https://a/x', lastmod: undefined }, { loc: 'https://a/y', lastmod: '2026-01-01' }]);

const current = await readSitemap(SITE, { fetchImpl: fakeFetch });
const n = Object.keys(current).length;
assert.ok(n > 0, 'sitemap has URLs');
assert.ok(Object.values(current).every(Boolean), 'every URL has a lastmod');
console.log(`sitemap: ${n} URLs, all with lastmod`);

assert.ok(await keyFileIsLive({ keyLocation: KEY_LOCATION, key: INDEXNOW_KEY, fetchImpl: fakeFetch }), 'key file served');
console.log('key file: OK');

// First run → everything.
let d = diffSitemaps(current, null);
assert.equal(d.changed.length, n);

// Nothing changed → nothing.
d = diffSitemaps(current, { ...current });
assert.equal(d.changed.length + d.removed.length, 0);

// One page edited, one page added, one page removed.
const prev = { ...current };
prev[`${SITE}/faq`] = '2020-01-01T00:00:00.000Z';
delete prev[`${SITE}/about`];
prev[`${SITE}/old-page`] = '2020-01-01T00:00:00.000Z';
d = diffSitemaps(current, prev);
assert.deepEqual(d.changed.sort(), [`${SITE}/about`, `${SITE}/faq`]);
assert.deepEqual(d.removed, [`${SITE}/old-page`]);
console.log('diff: edit/add/remove detected');

const { ok } = await submit({
  endpoint: INDEXNOW_ENDPOINT, site: SITE, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION,
  urls: [...d.changed, ...d.removed], fetchImpl: fakeFetch, log: () => {},
});
assert.ok(ok);
assert.deepEqual(sent[0], {
  host: 'leverupliquidity.com', key: INDEXNOW_KEY, keyLocation: KEY_LOCATION,
  urlList: [...d.changed, ...d.removed],
});
console.log('submit payload:', JSON.stringify(sent[0]));
console.log('All IndexNow checks passed.');
