#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// Leverup pre-deploy guard.
//
//   node scripts/guard.mjs                 scan the built site in dist/ (runs in `npm run build`)
//   node scripts/guard.mjs --dist <dir>    scan another build folder
//   node scripts/guard.mjs --text <file>   check a draft (txt, md or html) before anyone uses it
//   node scripts/guard.mjs --text <file> --rules   same, with /rules strictness (warn tier blocks)
//   --no-report   don't rewrite compliance/warn-report.md    --json <file>   dump every hit as JSON
//
// Fails (exit 1) when:
//   - a block-tier banned term appears outside the legal layer, or any banned term under /rules/**
//   - a locked verification item is missing or changed (compliance/site-verification.lock.json)
//   - a redirect, header, edge function or bot rule could match a locked path or block a search crawler
//   - robots.txt disallows a protected crawler, or noindex / X-Robots-Tag lands on an indexable page
//   - the sitemap is missing, lists a redirected URL, or a page links to a redirected URL
// Writes warn-tier hits to compliance/warn-report.md.
// Exit 2 means the guard's own config is broken (a pattern failed its examples).
// No dependencies: Node 18+ only.
// ─────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, extname, sep, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const argVal = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const DIST = resolve(ROOT, argVal('--dist') ?? 'dist');
const TEXT_FILE = argVal('--text');
const STRICT_TEXT = args.includes('--rules');
const WRITE_REPORT = !args.includes('--no-report');

const LOCK = JSON.parse(readFileSync(resolve(ROOT, argVal('--lock') ?? 'compliance/site-verification.lock.json'), 'utf8'));
const TERMS = JSON.parse(readFileSync(join(ROOT, 'compliance/banned-terms.json'), 'utf8'));

// ── Compile and self-test the term list ─────────────────────
function compile(t, tier) {
  let re;
  try { re = new RegExp(t.pattern, 'giu'); } catch (e) { configError(`${t.id}: invalid pattern (${e.message})`); }
  return { ...t, tier, re };
}
const configErrors = [];
function configError(msg) { configErrors.push(msg); }
const BLOCK = TERMS.tiers.block.terms.map((t) => compile(t, 'block'));
const WARN = TERMS.tiers.warn.terms.map((t) => compile(t, 'warn'));
const ALL = [...BLOCK, ...WARN];
const test = (re, s) => { re.lastIndex = 0; const r = re.test(s); re.lastIndex = 0; return r; };
for (const t of ALL) {
  if (!t.re) continue;
  for (const s of t.match ?? []) if (!test(t.re, s)) configError(`${t.id} should match "${s}" but doesn't`);
  for (const s of t.noMatch ?? []) if (test(t.re, s)) configError(`${t.id} should not match "${s}" but does`);
}
for (const s of TERMS.safeContexts?.mustNotMatchBlock ?? []) {
  for (const t of BLOCK) if (t.re && test(t.re, s)) configError(`${t.id} trips on the safe phrase "${s}"`);
}
for (const a of TERMS.allowlist ?? []) {
  if (!a.claimId || !/^LV-[A-Z]\d{2,}$/.test(a.claimId)) configError(`allowlist ${a.id}: needs a claims-register ID (LV-…)`);
  if (!a.phrase) configError(`allowlist ${a.id}: needs a phrase`);
}
if (configErrors.length) {
  console.error('\nGUARD CONFIG ERROR (compliance/banned-terms.json):');
  for (const e of configErrors) console.error('  - ' + e);
  process.exit(2);
}

// ── Text helpers ────────────────────────────────────────────
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', middot: '·', bull: '•', copy: '©', reg: '®', trade: '™', rarr: '→', larr: '←', times: '×', thinsp: ' ', ensp: ' ', emsp: ' ', zwj: '', zwnj: '' };
function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
    return ENT[e.toLowerCase()] ?? m;
  });
}
const norm = (s) => decode(s).replace(/[     ]/g, ' ').replace(/[ \t]+/g, ' ').trim();
const BLOCK_TAGS = 'address|article|aside|blockquote|br|dd|details|dialog|div|dl|dt|fieldset|figcaption|figure|footer|form|h[1-6]|header|hr|li|main|nav|ol|option|p|pre|section|summary|table|tbody|td|tfoot|th|thead|tr|ul|button|label|legend|select|textarea|caption';
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([^\s=/>]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) out[m[1].toLowerCase()] = m[3] ?? m[4] ?? m[5] ?? '';
  return out;
}

// Extract every text surface a reader, search engine or AI assistant sees.
function extractHtml(html) {
  const fields = [];
  const push = (field, text) => { for (const seg of String(text).split('\n')) { const t = norm(seg); if (t) fields.push({ field, text: t }); } };
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) push('title', title[1]);
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    const key = (a.name || a.property || '').toLowerCase();
    if (/^(description|og:title|og:description|og:image:alt|og:site_name|twitter:title|twitter:description|twitter:image:alt|keywords|abstract)$/.test(key)) push(`meta:${key}`, a.content ?? '');
  }
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try { data = JSON.parse(m[1]); } catch { push('jsonld:unparseable', m[1]); continue; }
    const walk = (v, path) => {
      if (typeof v === 'string') { if (!/^(https?:|mailto:|tel:|sms:|\/|#)/.test(v) && !/^@/.test(path.split('.').pop())) push(`jsonld:${path}`, v); }
      else if (typeof v === 'number' && /price|amount|value|rate|min|max/i.test(path)) push(`jsonld:${path}`, `$${v}`);
      else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k);
    };
    walk(data, '');
  }
  for (const m of html.matchAll(/<[a-z][^>]*>/gi)) {
    const a = attrs(m[0]);
    if (a.alt) push('alt', a.alt);
    if (a['aria-label']) push('aria-label', a['aria-label']);
    if (a.title) push('title-attr', a.title);
    if (a.placeholder) push('placeholder', a.placeholder);
  }
  let body = html.replace(/<head\b[\s\S]*?<\/head>/i, ' ')
    .replace(/<(script|style|template|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(new RegExp(`<\\/?(?:${BLOCK_TAGS})\\b[^>]*>`, 'gi'), '\n')
    .replace(/<[^>]+>/g, '');
  push('text', body);
  return fields;
}

function extractPlain(text, ext) {
  if (ext === '.html' || ext === '.htm') return extractHtml(text);
  if (ext === '.xml') text = text.replace(/<[^>]+>/g, '\n');
  if (ext === '.json') { try { const out = []; const walk = (v) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); }; walk(JSON.parse(text)); text = out.join('\n'); } catch { /* scan raw */ } }
  return text.split('\n').map((t) => norm(t)).filter(Boolean).map((t) => ({ field: 'text', text: t }));
}

// ── Banned-term scan ────────────────────────────────────────
function allowed(term, text, idx, len, url) {
  for (const a of TERMS.allowlist ?? []) {
    if (!a.termIds.includes(term.id)) continue;
    if (!(a.pages.includes('*') || a.pages.includes(url))) continue;
    const hay = text.toLowerCase(), needle = a.phrase.toLowerCase();
    for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) if (idx >= i && idx + len <= i + needle.length) return a;
  }
  return null;
}
function scan(fields, url, strict) {
  const hits = [];
  for (const { field, text } of fields) {
    for (const t of ALL) {
      t.re.lastIndex = 0;
      for (const m of text.matchAll(t.re)) {
        if (!m[0]) continue;
        if (allowed(t, text, m.index, m[0].length, url)) continue;
        const s = Math.max(0, m.index - 50), e = Math.min(text.length, m.index + m[0].length + 50);
        hits.push({ url, field, id: t.id, tier: strict ? 'block' : t.tier, category: t.category, match: m[0], snippet: (s ? '…' : '') + text.slice(s, e) + (e < text.length ? '…' : '') });
      }
    }
  }
  return hits;
}
const isUnder = (url, p) => url === p || url.startsWith(p + '/');
const isLegal = (url) => (TERMS.scope.legalLayer ?? []).some((p) => isUnder(url, p));
const isStrict = (url) => (TERMS.scope.strictPrefixes ?? []).some((p) => isUnder(url, p));

// ── Text mode ───────────────────────────────────────────────
if (TEXT_FILE) {
  const raw = readFileSync(TEXT_FILE, 'utf8');
  const hits = scan(extractPlain(raw, extname(TEXT_FILE).toLowerCase()), TEXT_FILE, STRICT_TEXT);
  const block = hits.filter((h) => h.tier === 'block'), warn = hits.filter((h) => h.tier === 'warn');
  console.log(`\nGuard text check: ${TEXT_FILE}${STRICT_TEXT ? ' (rules-page strictness)' : ''}`);
  for (const [label, list] of [['BLOCK', block], ['WARN', warn]]) {
    console.log(`\n${label}: ${list.length}`);
    for (const h of list) console.log(`  [${h.id}] "${h.match}"  ${h.snippet}`);
  }
  console.log(block.length ? '\nFAIL: rewrite the BLOCK lines before this draft is used.\n' : '\nPASS: no block-tier terms.\n');
  process.exit(block.length ? 1 : 0);
}

// ── Build scan ──────────────────────────────────────────────
const failures = [];
const fail = (check, msg) => failures.push({ check, msg });
const passes = [];
const ok = (check, msg) => passes.push({ check, msg });

if (!existsSync(DIST)) { console.error(`Guard: build folder not found: ${DIST}`); process.exit(1); }
function walk(dir) { return readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
const files = walk(DIST).filter((f) => ['.html', '.xml', '.txt', '.json'].includes(extname(f).toLowerCase()));
const relUrl = (f) => '/' + relative(DIST, f).split(sep).join('/');
const pageUrl = (f) => { let u = relUrl(f).replace(/\.html$/, ''); if (u.endsWith('/index')) u = u.slice(0, -6) || '/'; return u === '' ? '/' : u; };
const sha = (buf) => createHash('sha256').update(buf).digest('hex');

// 1. Banned terms
const allHits = [];
let scanned = 0, skippedLegal = [];
for (const f of files) {
  const rel = relative(DIST, f).split(sep).join('/');
  if ((TERMS.scope.skipFiles ?? []).includes(rel)) continue;
  const ext = extname(f).toLowerCase();
  const url = ext === '.html' ? pageUrl(f) : relUrl(f);
  if (isLegal(url)) { skippedLegal.push(url); continue; }
  scanned++;
  allHits.push(...scan(extractPlain(readFileSync(f, 'utf8'), ext), url, isStrict(url)));
}
const blockHits = allHits.filter((h) => h.tier === 'block');
const warnHits = allHits.filter((h) => h.tier === 'warn');
if (blockHits.length) fail('banned-terms', `${blockHits.length} block-tier hit(s) outside the legal layer`);
else ok('banned-terms', `0 block-tier hits in ${scanned} files (legal layer skipped: ${skippedLegal.join(', ') || 'none'})`);

// 2. Locked verification files and meta tags
for (const item of LOCK.files ?? []) {
  const built = join(DIST, item.path), repo = join(ROOT, item.repoPath);
  for (const [where, p] of [['build', built], ['repo', repo]]) {
    if (!existsSync(p)) { fail('verification-lock', `${item.id}: ${where} file missing (${relative(ROOT, p)})`); continue; }
    const buf = readFileSync(p);
    if (sha(buf) !== item.sha256 || buf.length !== item.bytes) fail('verification-lock', `${item.id}: ${where} file changed (${relative(ROOT, p)}: ${buf.length} bytes, sha256 ${sha(buf).slice(0, 12)}…; lock says ${item.bytes} bytes, ${item.sha256.slice(0, 12)}…)`);
    else ok('verification-lock', `${item.id}: ${where} file byte-identical (${item.sha256.slice(0, 12)}…)`);
  }
}
for (const tag of LOCK.metaTags?.required ?? []) {
  for (const page of tag.pages) {
    const f = join(DIST, page === '/' ? 'index.html' : page.replace(/^\//, '') + '.html');
    const head = existsSync(f) ? (readFileSync(f, 'utf8').match(/<head\b[\s\S]*?<\/head>/i)?.[0] ?? '') : '';
    if (!head.includes(tag.exact)) fail('verification-lock', `${tag.id}: exact meta string missing from <head> of ${page}`);
  }
  if ((tag.pages ?? []).length) ok('verification-lock', `${tag.id}: present on ${tag.pages.length} page(s)`);
}
{
  const cfgPath = join(ROOT, LOCK.indexnowConfig.path);
  const cfg = existsSync(cfgPath) ? readFileSync(cfgPath, 'utf8') : '';
  if (!cfg.includes(`INDEXNOW_KEY = '${LOCK.indexnowConfig.key}'`)) fail('verification-lock', `IndexNow key in ${LOCK.indexnowConfig.path} is missing or changed`);
  else if (!cfg.includes(LOCK.indexnowConfig.endpoint)) fail('verification-lock', `IndexNow endpoint in ${LOCK.indexnowConfig.path} changed`);
  else ok('verification-lock', `IndexNow key and endpoint unchanged in ${LOCK.indexnowConfig.path}`);
}

// 3. Redirects, headers, edge functions and bot rules
const sampleFor = (p) => p.replace(/\*/g, 'x1y2z3').replace(/x1y2z3\.html$/, 'abc123.html');
const PROTECTED = (LOCK.protectedPaths ?? []).map((p) => ({ pattern: p, sample: p.includes('*') ? sampleFor(p) : p }));
const CRAWLERS = LOCK.crawlers.userAgents;
const globToRe = (from) => new RegExp('^' + from.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\/:[^/]+/g, '/[^/]+').replace(/\*/g, '.*') + '/?$', 'i');
function tomlBlocks(text, name) {
  const out = [];
  const parts = text.split(/^\s*\[\[/m).slice(1);
  for (const part of parts) {
    const head = part.slice(0, part.indexOf(']]')).trim();
    if (head !== name) continue;
    const body = part.slice(part.indexOf(']]') + 2);
    const get = (k) => body.match(new RegExp(`^\\s*${k}\\s*=\\s*"([^"]*)"`, 'm'))?.[1];
    const values = {};
    for (const m of body.matchAll(/^\s*([A-Za-z0-9-]+)\s*=\s*"([^"]*)"/gm)) values[m[1]] = m[2];
    out.push({ get, values, raw: body });
  }
  return out;
}
const tomlPath = join(ROOT, 'netlify.toml');
const toml = existsSync(tomlPath) ? readFileSync(tomlPath, 'utf8') : '';
const redirectRules = [];
for (const b of tomlBlocks(toml, 'redirects')) redirectRules.push({ src: 'netlify.toml', from: b.get('from'), to: b.get('to'), status: b.get('status') ?? b.raw.match(/status\s*=\s*(\d+)/)?.[1], raw: b.raw });
for (const p of [join(ROOT, 'public/_redirects'), join(DIST, '_redirects')]) {
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue;
    const [from, to, status] = t.split(/\s+/); redirectRules.push({ src: relative(ROOT, p), from, to, status, raw: t });
  }
}
const astroCfg = readFileSync(join(ROOT, 'astro.config.mjs'), 'utf8');
const astroRedirects = astroCfg.match(/redirects\s*:\s*\{([\s\S]*?)\}/);
if (astroRedirects) for (const m of astroRedirects[1].matchAll(/['"]([^'"]+)['"]\s*:\s*['"{]/g)) redirectRules.push({ src: 'astro.config.mjs', from: m[1], to: '?', raw: m[0] });
let redirectProblems = 0;
for (const r of redirectRules) {
  if (!r.from) continue;
  const re = globToRe(r.from);
  for (const p of PROTECTED) if (re.test(p.sample) || re.test(p.pattern)) { fail('redirects', `${r.src}: redirect from "${r.from}" could match locked path ${p.pattern}`); redirectProblems++; }
  if (/user-?agent|googlebot|bingbot|searchbot|claude-user|chatgpt-user|perplexitybot/i.test(r.raw)) { fail('redirects', `${r.src}: redirect "${r.from}" references a crawler or user agent`); redirectProblems++; }
}
if (!redirectProblems) ok('redirects', `${redirectRules.length} redirect rule(s) checked; none can match a locked path or crawler`);

const SAFE_HEADERS = new Set(['x-content-type-options', 'referrer-policy', 'x-frame-options', 'permissions-policy', 'strict-transport-security', 'cache-control', 'content-security-policy', 'cross-origin-opener-policy']);
const headerRules = tomlBlocks(toml, 'headers').map((b) => ({ src: 'netlify.toml', for: b.get('for'), keys: Object.keys(b.values).filter((k) => k !== 'for'), raw: b.raw }));
for (const p of [join(ROOT, 'public/_headers'), join(DIST, '_headers')]) {
  if (!existsSync(p)) continue;
  let cur = null;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (/^\S/.test(line)) { cur = { src: relative(ROOT, p), for: line.trim(), keys: [], raw: line }; headerRules.push(cur); }
    else if (cur) { cur.keys.push(line.split(':')[0].trim()); cur.raw += '\n' + line; }
  }
}
let headerProblems = 0;
for (const h of headerRules) {
  if (!h.for) continue;
  const re = globToRe(h.for);
  if (h.keys.some((k) => k.toLowerCase() === 'x-robots-tag') || /noindex|nofollow/i.test(h.raw)) { fail('headers', `${h.src}: header rule "${h.for}" sets X-Robots-Tag or noindex`); headerProblems++; }
  if (/basic-auth|user-?agent/i.test(h.raw)) { fail('headers', `${h.src}: header rule "${h.for}" adds auth or user-agent logic`); headerProblems++; }
  const touchesLocked = PROTECTED.filter((p) => re.test(p.sample) || re.test(p.pattern));
  if (touchesLocked.length) {
    const bad = h.keys.filter((k) => !SAFE_HEADERS.has(k.toLowerCase()));
    if (bad.length) { fail('headers', `${h.src}: header rule "${h.for}" sets ${bad.join(', ')} on locked path(s) ${touchesLocked.map((p) => p.pattern).join(', ')}`); headerProblems++; }
  }
}
if (!headerProblems) ok('headers', `${headerRules.length} header rule(s) checked; no X-Robots-Tag, auth or non-security header on a locked path`);

let edgeProblems = 0;
const edgeDir = join(ROOT, 'netlify/edge-functions');
const fnDirs = [edgeDir, join(ROOT, 'netlify/functions')].filter(existsSync);
for (const b of tomlBlocks(toml, 'edge_functions')) {
  const path = b.get('path') ?? '';
  const re = globToRe(path);
  for (const p of PROTECTED) if (re.test(p.sample)) { fail('edge-functions', `netlify.toml: edge function on "${path}" could match locked path ${p.pattern}`); edgeProblems++; }
}
for (const d of fnDirs) for (const f of walk(d)) {
  const src = readFileSync(f, 'utf8');
  if (/googlebot|bingbot|oai-searchbot|chatgpt-user|claude-searchbot|claude-user|perplexitybot|user-agent/i.test(src)) { fail('edge-functions', `${relative(ROOT, f)} references crawlers or user agents; review it can't block a protected crawler`); edgeProblems++; }
  for (const m of src.matchAll(/path\s*:\s*\[?\s*['"]([^'"]+)['"]/g)) { const re = globToRe(m[1]); for (const p of PROTECTED) if (re.test(p.sample)) { fail('edge-functions', `${relative(ROOT, f)} serves "${m[1]}", which could match locked path ${p.pattern}`); edgeProblems++; } }
}
if (!edgeProblems) ok('edge-functions', `${existsSync(edgeDir) ? 'edge functions' : 'no edge functions'}; ${fnDirs.length ? 'functions checked' : 'no functions'}; none touch locked paths or crawlers`);

// 4. robots.txt and noindex
const sitemapIndex = join(DIST, LOCK.sitemap.index);
const indexable = new Set();
if (existsSync(sitemapIndex)) {
  const idx = readFileSync(sitemapIndex, 'utf8');
  const children = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  let locs = 0;
  for (const c of children) {
    const local = join(DIST, new URL(c).pathname);
    if (!existsSync(local)) { fail('sitemap', `sitemap index lists ${c}, which isn't in the build`); continue; }
    for (const m of readFileSync(local, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) { indexable.add(new URL(m[1]).pathname.replace(/\/$/, '') || '/'); locs++; }
  }
  if (!locs) fail('sitemap', 'sitemap has no <loc> entries');
  else ok('sitemap', `${LOCK.sitemap.index} present; ${locs} URL(s) listed`);
} else fail('sitemap', `${LOCK.sitemap.index} missing from the build`);

const robotsPath = join(DIST, 'robots.txt');
if (!existsSync(robotsPath)) fail('robots', 'robots.txt missing from the build');
else {
  const robots = readFileSync(robotsPath, 'utf8');
  const groups = []; let cur = null, lastWasUa = false;
  for (const raw of robots.split('\n')) {
    const line = raw.replace(/#.*/, '').trim(); if (!line) continue;
    const [k, ...v] = line.split(':'); const key = k.trim().toLowerCase(), val = v.join(':').trim();
    if (key === 'user-agent') { if (!lastWasUa) { cur = { agents: [], disallow: [] }; groups.push(cur); } cur.agents.push(val.toLowerCase()); lastWasUa = true; continue; }
    lastWasUa = false;
    if (key === 'disallow' && cur && val) cur.disallow.push(val);
  }
  let robotsProblems = 0;
  for (const ua of CRAWLERS) {
    const g = groups.find((x) => x.agents.includes(ua.toLowerCase())) ?? groups.find((x) => x.agents.includes('*'));
    for (const d of g?.disallow ?? []) {
      const re = new RegExp('^' + d.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
      const blocked = ['/', ...indexable].filter((u) => re.test(u));
      if (blocked.length) { fail('robots', `robots.txt "Disallow: ${d}" blocks ${ua} from ${blocked.slice(0, 3).join(', ')}${blocked.length > 3 ? '…' : ''}`); robotsProblems++; }
    }
  }
  if (!robots.includes(LOCK.sitemap.robotsLine)) { fail('robots', `robots.txt lost the line "${LOCK.sitemap.robotsLine}"`); robotsProblems++; }
  if (!robotsProblems) ok('robots', `robots.txt allows all ${CRAWLERS.length} protected crawlers and keeps the sitemap line`);
}
let noindexProblems = 0;
for (const f of files.filter((x) => x.endsWith('.html'))) {
  const url = pageUrl(f);
  if (!indexable.has(url)) continue;
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    const name = (a.name || a['http-equiv'] || '').toLowerCase();
    if ((/^(robots|googlebot|bingbot|googlebot-news)$/.test(name) && /noindex|none/i.test(a.content ?? '')) || name === 'x-robots-tag') { fail('noindex', `${url} is in the sitemap but carries <meta ${name} content="${a.content}">`); noindexProblems++; }
  }
}
if (!noindexProblems) ok('noindex', `no noindex or X-Robots-Tag on ${indexable.size} indexable page(s)`);

// 5. Retired URLs: never in the sitemap, never linked internally
const redirected = redirectRules.filter((r) => r.from && /^30[18]$/.test(String(r.status ?? '301'))).map((r) => ({ ...r, re: globToRe(r.from) }));
let linkProblems = 0;
for (const u of indexable) for (const r of redirected) if (r.re.test(u)) { fail('retired-urls', `sitemap lists ${u}, which redirects (${r.src}: ${r.from} → ${r.to})`); linkProblems++; }
for (const f of files.filter((x) => x.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#?]+)/gi)) {
    let href = m[1];
    if (/^https?:\/\/(www\.)?leverupliquidity\.com/i.test(href)) href = href.replace(/^https?:\/\/(www\.)?leverupliquidity\.com/i, '') || '/';
    if (!href.startsWith('/')) continue;
    for (const r of redirected) if (r.re.test(href)) { fail('retired-urls', `${pageUrl(f)} links to ${href}, which redirects to ${r.to}`); linkProblems++; }
  }
}
if (!linkProblems) ok('retired-urls', `no sitemap entry or internal link points at any of ${redirected.length} redirected path(s)`);

// ── Report ──────────────────────────────────────────────────
const group = (list) => list.reduce((acc, h) => ((acc[h.url] ??= []).push(h), acc), {});
console.log('\n━━ Leverup guard ━━');
for (const p of passes) console.log(`  PASS  ${p.check.padEnd(18)} ${p.msg}`);
for (const f of failures) console.log(`  FAIL  ${f.check.padEnd(18)} ${f.msg}`);
if (blockHits.length) {
  console.log('\nBlock-tier hits (must be removed before deploy):');
  for (const [url, hs] of Object.entries(group(blockHits))) {
    console.log(`\n  ${url}`);
    for (const h of hs) console.log(`    [${h.id}] ${h.field}: "${h.match}"  ${h.snippet}`);
  }
}
console.log(`\nWarn-tier hits: ${warnHits.length} (see compliance/warn-report.md)`);
if (argVal('--json')) writeFileSync(argVal('--json'), JSON.stringify({ failures, passes, hits: allHits }, null, 2));

if (WRITE_REPORT) {
  const lines = [
    '# Warn-tier report',
    '',
    `Generated by scripts/guard.mjs on ${new Date().toISOString()} from ${relative(ROOT, DIST) || 'dist'}. Business-model and product-mechanics language is reported here, not blocked, until Phase 3 replaces these pages. Under /rules/** the same terms fail the build.`,
    '',
    `Total: ${warnHits.length} hits on ${Object.keys(group(warnHits)).length} pages.`,
    '',
    '| Term | Category | Hits |',
    '| --- | --- | --- |',
    ...WARN.map((t) => `| ${t.id} | ${t.category} | ${warnHits.filter((h) => h.id === t.id).length} |`),
    '',
  ];
  for (const [url, hs] of Object.entries(group(warnHits))) {
    lines.push(`## ${url}`, '', '| Term | Where | Match | Context |', '| --- | --- | --- | --- |');
    for (const h of hs) lines.push(`| ${h.id} | ${h.field} | ${h.match.replace(/\|/g, '\\|')} | ${h.snippet.replace(/\|/g, '\\|')} |`);
    lines.push('');
  }
  writeFileSync(join(ROOT, 'compliance/warn-report.md'), lines.join('\n'));
}

if (failures.length) {
  console.log(`\nGUARD FAILED: ${failures.length} problem(s). The deploy is stopped.\n`);
  process.exit(1);
}
console.log('\nGUARD PASSED.\n');
