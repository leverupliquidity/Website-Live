// ─────────────────────────────────────────────────────────────
// Page titles and meta descriptions (search results + social shares).
// DRAFT wording for Ryan's approval. Titles aim for ≤ 60 characters, descriptions ≤ 160.
// ─────────────────────────────────────────────────────────────

export type Meta = { title: string; description: string; noindex?: boolean };

export const meta: Record<string, Meta> = {
  '/': {
    title: 'Cannabis Business Financing | Leverup Liquidity',
    description:
      'We match licensed cannabis operators with funders. Lines of credit, equipment financing, term loans and cash advances.',
  },
  '/financing': {
    title: 'Cannabis Financing Options | Leverup Liquidity',
    description:
      'Lines of credit, equipment financing, term loans and cash advances for licensed cannabis businesses.',
  },
  '/financing/lines-of-credit': {
    title: 'Cannabis Business Lines of Credit | Leverup Liquidity',
    description:
      'Lines of credit for licensed cannabis operators. Draw for vendor orders, repay from sales, then draw again.',
  },
  '/financing/equipment-financing': {
    title: 'Cannabis Equipment Financing | Leverup Liquidity',
    description:
      'Finance lights, HVAC and extraction gear, and keep your cash for stock.',
  },
  '/financing/term-loans': {
    title: 'Cannabis Term Loans | Leverup Liquidity',
    description:
      'One lump sum for a build-out, new location or buyout.',
  },
  '/financing/merchant-cash-advance': {
    title: 'Cannabis Merchant Cash Advance | Leverup Liquidity',
    description:
      'Cash now for a share of future sales. Not a loan.',
  },
  '/industries': {
    title: 'Cannabis Industry Financing | Leverup Liquidity',
    description:
      'Dispensaries, grows and processors each need different money. See which financing fits your license, your cash cycle and your next big expense.',
  },
  '/industries/dispensaries': {
    title: 'Dispensary Financing | Leverup Liquidity',
    description:
      'Financing for licensed dispensaries: inventory, holiday stock-ups, build-outs and tax bills.',
  },
  '/industries/cultivation': {
    title: 'Cannabis Grow Financing | Leverup Liquidity',
    description:
      'Financing for licensed cultivators: lights, HVAC, benching and the months between harvests.',
  },
  '/industries/processing': {
    title: 'Cannabis Processor Financing | Leverup Liquidity',
    description:
      'Financing for licensed processors and labs: extraction gear, packaging and the wait for retailers to pay.',
  },
  '/how-it-works': {
    title: 'How Cannabis Financing Works | Leverup Liquidity',
    description:
      'We match you with lenders, and you decide.',
  },
  '/apply': {
    title: 'Apply for Cannabis Business Financing | Leverup Liquidity',
    description:
      'No obligation, and your files go only to lenders you approve.',
  },
  '/apply/confirmation': {
    title: 'Application Received | Leverup Liquidity',
    description: "Thanks for applying. Here's what happens next.",
    noindex: true,
  },
  '/about': {
    title: 'About Us | Leverup Liquidity',
    description:
      'Leverup Liquidity is a financing broker for licensed cannabis businesses, founded by Ryan Rodriguez.',
  },
  '/contact': {
    title: 'Contact Us | Leverup Liquidity',
    description:
      'Call or text (947) 238-6272, email info@leverupliquidity.com or book a call. Ask us anything about financing your cannabis business.',
  },
  '/faq': {
    title: 'Cannabis Financing FAQ | Leverup Liquidity',
    description:
      'Straight answers on eligibility and privacy before you apply for cannabis business financing.',
  },
  '/rules': {
    title: 'Cannabis Rule Changes: Dates and Status | Leverup Liquidity',
    description:
      "Cannabis rule changes by date and status: the federal hemp THC ban, Michigan's wholesale marijuana tax and marijuana rescheduling, with primary sources.",
  },
  '/rules/hemp-thc-ban': {
    title: 'Hemp THC Ban: What Changes Nov 12 and Dec 11, 2026 | Leverup',
    description:
      'Under Public Law 119-37, the hemp THC ban starts November 12, 2026, and the 0.4 mg per-container cap follows December 11, subject to change.',
  },
  '/guides': {
    title: 'Cannabis Financing Guides | Leverup Liquidity',
    description:
      'Plain-English guides to cannabis business financing.',
  },
  '/privacy': {
    title: 'Privacy Policy | Leverup Liquidity',
    description: 'How Leverup Liquidity collects, uses and protects your information. We do not sell your personal information.',
  },
  '/sms-terms': {
    title: 'SMS Terms | Leverup Liquidity',
    description: 'Terms for text messages from Leverup Liquidity: what we send, how often, costs, and how to opt out by replying STOP.',
  },
  '/404': {
    title: 'Page Not Found | Leverup Liquidity',
    description: "We couldn't find that page. Try financing options, how it works, or contact us.",
    noindex: true,
  },
};
