/**
 * mobile-rewrite — serves a genuinely SEPARATE mobile landing page at "/".
 *
 * Returning a same-site URL object performs a REWRITE, not a redirect: the
 * response is a 200 carrying /index-mobile.html while the address bar stays "/".
 *
 * TRADEOFF (deliberate, per spec):
 *   - User-agent branching makes "/" dynamic rather than fully cache-static, so
 *     "/" can no longer be served straight from the CDN edge cache for everyone.
 *   - UA strings are trivially spoofed, so this is a presentation hint, never a
 *     security or entitlement boundary.
 *   - SEO is protected by pairing this with:
 *       index.html         -> <link rel="alternate" media="only screen and (max-width: 640px)" href="/index-mobile.html">
 *       index-mobile.html  -> <link rel="canonical" href="https://leverupliquidity.com/">
 *     so crawlers consolidate both variants onto the "/" URL.
 *   - A CSS-only responsive single page would be simpler and stay fully static,
 *     but that is NOT a separate page; a separate page was explicitly requested.
 */
export default async (request, context) => {
  const ua = request.headers.get("user-agent") || "";
  if (/iPhone|iPad|iPod|Android|Mobile/i.test(ua)) {
    return new URL("/index-mobile.html", request.url); // 200 rewrite, URL unchanged
  }
  return context.next();
};

// Only run on the landing route. Every other path bypasses the function entirely.
export const config = { path: "/" };
