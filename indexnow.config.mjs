// ─────────────────────────────────────────────────────────────
// IndexNow settings, shared by the build (astro.config.mjs) and the
// deploy hook (netlify/functions/indexnow.mts).
//
// The key is public by design: search engines prove you own the site by
// fetching https://leverupliquidity.com/<KEY>.txt and checking it contains
// the key. The file lives at public/<KEY>.txt. If you change the key, rename
// that file to match; the build fails if they disagree.
// ─────────────────────────────────────────────────────────────

export const INDEXNOW_KEY = 'e5af999b4e3e75bc8fe912f732b78da7';
export const SITE = 'https://leverupliquidity.com';
export const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY}.txt`;

// One endpoint shares the submission with every IndexNow engine
// (Bing, Yandex, Seznam, Naver, Yep, Amazon).
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
