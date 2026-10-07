// ─────────────────────────────────────────────────────────────
// Site-wide settings. Edit values here; every page reads from this file.
// ─────────────────────────────────────────────────────────────

const NBSP = ' ';

export const site = {
  name: 'Leverup Liquidity',
  legalName: 'Leverup Leads LLC',
  url: 'https://leverupliquidity.com',
  description:
    'Leverup Liquidity matches licensed cannabis operators with private lenders and shows the full cost before you sign.',

  // Phone used on the website (call + text buttons). Legal documents keep their own number.
  phone: {
    display: `(313)${NBSP}329-7157`,
    plain: '(313) 329-7157',
    tel: 'tel:+13133297157',
    sms: 'sms:+13133297157',
    e164: '+13133297157',
  },
  email: 'info@leverupliquidity.com',
  hours: '9am–5pm. Text anytime.',

  bookingsUrl:
    'https://bookings.cloud.microsoft/bookwithme/user/195535215dd74a61bab23a5d78df30d8@leverupliquidity.com?anonymous&ismsaljsauthenabled&ep=plink',

  social: {
    instagram: 'https://www.instagram.com/leverupliquidity/',
    facebook: 'https://www.facebook.com/profile.php?id=61589328271662',
    // TODO(Ryan): paste the LinkedIn page address here. Until then the footer link
    // points to the LinkedIn home page.
    linkedin: '',
  },

  // "Updated [DATE]" / "Last updated [DATE]" placeholders in the design.
  updated: { display: 'October 6, 2026', iso: '2026-10-06' },
  // The Privacy Policy keeps its own date (from the policy text).
  privacyUpdated: { display: 'March 12, 2026', iso: '2026-03-12' },
  smsTermsUpdated: { display: 'October 6, 2026', iso: '2026-10-06' },

  year: 2026,
} as const;

// Third-party IDs. Leave a value empty to switch that tool off.
export const integrations = {
  // Web3Forms access key (public by design; it only lets the form send to Ryan's inbox).
  web3formsKey: '8f4f3bf3-4384-4dea-a124-5051c3412137',
  // Google Analytics 4 measurement ID, e.g. 'G-XXXXXXXXXX'
  ga4: '',
  // Umami Cloud website ID (UUID)
  umamiWebsiteId: 'a3e13b85-35fe-4b06-abcf-5b18e6c6130e',
  umamiSrc: 'https://cloud.umami.is/script.js',
  // Microsoft Clarity project ID
  clarity: 'ytiqg1lcp5',
  // Google Search Console HTML-tag verification token (content="..."), if using the meta-tag method
  googleSiteVerification: '',
} as const;

export const nav = {
  primary: [
    { label: 'Financing', href: '/financing', menu: 'financing' },
    { label: 'Industries', href: '/industries', menu: 'industries' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Guides', href: '/guides' },
    { label: 'About', href: '/about' },
  ],
  industries: [
    { label: 'Dispensaries', href: '/industries/dispensaries' },
    { label: 'Cultivation', href: '/industries/cultivation' },
    { label: 'Processing', href: '/industries/processing' },
  ],
} as const;

// Terms of Use page is not live yet (Ryan decision 6 Oct 2026). Flip to true when the text arrives.
export const SHOW_TERMS = false;
