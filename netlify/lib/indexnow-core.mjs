// IndexNow logic, kept apart from the Netlify handler so it can be tested
// with plain Node (see tools/test-indexnow.mjs).

const MAX_URLS_PER_REQUEST = 10_000; // IndexNow protocol limit

const decode = (s) =>
  s.trim()
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : undefined;
};

/**
 * Parses one sitemap file. Returns { children: [...sitemap URLs] } for a
 * sitemap index, or { urls: [{ loc, lastmod }] } for a URL set.
 * Each <url> block is parsed on its own, so a missing <lastmod> never pulls
 * in the next entry's date.
 */
export function parseSitemap(xml) {
  if (/<sitemapindex[\s>]/.test(xml)) {
    const children = [...xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)]
      .map(([, b]) => tag(b, 'loc'))
      .filter(Boolean);
    return { children };
  }
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map(([, b]) => ({ loc: tag(b, 'loc'), lastmod: tag(b, 'lastmod') }))
    .filter((u) => u.loc);
  return { urls };
}

/** Fetches the sitemap (following a sitemap index) and returns { [url]: lastmod|null }. */
export async function readSitemap(site, { fetchImpl = fetch, cacheBust = String(Date.now()) } = {}) {
  const host = new URL(site).host;
  const get = async (url) => {
    const u = new URL(url);
    u.searchParams.set('v', String(cacheBust)); // skip any stale CDN copy
    const res = await fetchImpl(u, { cache: 'no-store' });
    if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
    return res.text();
  };

  const entries = {};
  const queue = [`${site}/sitemap-index.xml`];
  const seen = new Set();
  while (queue.length) {
    const next = queue.shift();
    if (seen.has(next)) continue;
    seen.add(next);
    const parsed = parseSitemap(await get(next));
    if (parsed.children) queue.push(...parsed.children);
    for (const { loc, lastmod } of parsed.urls ?? []) {
      if (new URL(loc).host === host) entries[loc] = lastmod ?? null; // IndexNow rejects other hosts
    }
  }
  return entries;
}

/**
 * Decides what to submit.
 * - With a previous snapshot: new URLs, URLs whose lastmod changed, and URLs
 *   that disappeared (IndexNow wants removals too, so engines drop the 404).
 * - With no snapshot yet (first run): every URL.
 */
export function diffSitemaps(current, previous) {
  if (!previous) return { changed: Object.keys(current), removed: [], firstRun: true };
  const changed = Object.keys(current).filter(
    (url) => !(url in previous) || current[url] !== previous[url],
  );
  const removed = Object.keys(previous).filter((url) => !(url in current));
  return { changed, removed, firstRun: false };
}

/** Fallback when there's no stored snapshot to compare with: lastmod within `hours`. */
export function recentlyModified(current, hours = 48, now = Date.now()) {
  const since = now - hours * 3600_000;
  return Object.entries(current)
    .filter(([, mod]) => mod && Date.parse(mod) >= since)
    .map(([url]) => url);
}

/** True if the live key file serves exactly the key (otherwise engines answer 403). */
export async function keyFileIsLive({ keyLocation, key, fetchImpl = fetch }) {
  try {
    const res = await fetchImpl(`${keyLocation}?v=${Date.now()}`, { cache: 'no-store' });
    return res.ok && (await res.text()).trim() === key;
  } catch {
    return false;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * POSTs the URLs to IndexNow in batches, retrying 429/5xx with backoff.
 * Returns { ok, results: [{ status, count }] }.
 */
export async function submit({ endpoint, site, key, keyLocation, urls, fetchImpl = fetch, log = console.log }) {
  const results = [];
  for (let i = 0; i < urls.length; i += MAX_URLS_PER_REQUEST) {
    const urlList = urls.slice(i, i + MAX_URLS_PER_REQUEST);
    const body = JSON.stringify({ host: new URL(site).host, key, keyLocation, urlList });
    let status = 0;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetchImpl(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body,
        });
        status = res.status;
      } catch (err) {
        status = 0;
        log(`IndexNow network error: ${err.message}`);
      }
      if (status === 200 || status === 202) break;
      if (status === 429 || status === 0 || status >= 500) { await sleep(2000 * attempt * attempt); continue; }
      break; // 400/403/422: retrying won't help
    }
    log(`IndexNow ${status} ${describe(status)} (${urlList.length} URLs)`);
    results.push({ status, count: urlList.length });
  }
  return { ok: results.every((r) => r.status === 200 || r.status === 202), results };
}

export function describe(status) {
  return {
    200: 'OK: URLs received',
    202: 'Accepted: key validation pending',
    400: 'Bad request: invalid format',
    403: 'Forbidden: key not valid (key file missing or different)',
    422: "Unprocessable: URLs don't belong to the host, or key doesn't match",
    429: 'Too many requests',
  }[status] ?? (status ? 'Unexpected response' : 'No response');
}
