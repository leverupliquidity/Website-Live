// Works out a real <lastmod> date for each sitemap URL from git history:
// the date of the last commit that touched the files that make up that page.
// Used by the sitemap integration in astro.config.mjs.
//
// Why git and not the build time: if every URL gets "today" on every deploy,
// search engines learn the dates are noise and ignore them, and the IndexNow
// hook would resubmit every page on every deploy. Commit dates only move when
// the page actually changes.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

// Section folders under src/components whose name differs from the URL.
const COMPONENT_DIRS = {
  '': ['src/components/home'],
  about: ['src/components/company'],
  'how-it-works': ['src/components/h1-how'],
  privacy: ['src/components/legal', 'src/content/legal/privacy.html'],
  'sms-terms': ['src/components/legal'],
  faq: ['src/data/faq.ts'],
  financing: ['src/components/financing'],
  industries: ['src/components/industries'],
  guides: ['src/components/guides'],
  apply: ['src/components/apply'],
};

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

let usable = null;
function gitHistoryUsable() {
  if (usable !== null) return usable;
  try {
    if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
      // Netlify and CI sometimes clone shallow; a shallow clone makes every file
      // look like it changed in the newest commit. Try to fetch the full history.
      try { git(['fetch', '--unshallow', '--quiet']); } catch { /* offline or not allowed */ }
    }
    usable = git(['rev-parse', '--is-shallow-repository']) === 'false';
    if (!usable) console.warn('[sitemap] shallow git clone: leaving <lastmod> out rather than guessing.');
  } catch {
    usable = false;
    console.warn('[sitemap] git not available: leaving <lastmod> out.');
  }
  return usable;
}

/** Files whose changes count as a change to the page at `pathname`. */
export function sourcesFor(pathname) {
  const path = pathname.replace(/^\/|\/$/g, '');
  const parts = path.split('/');
  const files = [];

  // The page file itself.
  for (const f of [`src/pages/${path || 'index'}.astro`, `src/pages/${path}/index.astro`]) {
    if (existsSync(join(ROOT, f))) files.push(f);
  }
  // Guide articles come from markdown through a dynamic route.
  if (parts[0] === 'guides' && parts[1]) {
    files.push(`src/content/guides/${parts[1]}.md`, 'src/pages/guides/[slug].astro');
  }
  // Section components / data the page is built from.
  for (const f of COMPONENT_DIRS[parts[0]] ?? []) {
    if (existsSync(join(ROOT, f))) files.push(f);
  }
  return files.filter((f) => existsSync(join(ROOT, f)));
}

const cache = new Map();

/** ISO date of the last commit touching this page's sources, or undefined. */
export function lastmodFor(url) {
  if (!gitHistoryUsable()) return undefined;
  const { pathname } = new URL(url);
  if (cache.has(pathname)) return cache.get(pathname);
  const files = sourcesFor(pathname);
  let date;
  if (files.length) {
    try {
      date = git(['log', '-1', '--format=%cI', '--', ...files]) || undefined;
    } catch { /* leave undefined */ }
  }
  cache.set(pathname, date);
  return date;
}
