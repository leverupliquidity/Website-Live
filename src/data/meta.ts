// ─────────────────────────────────────────────────────────────
// Page titles and meta descriptions (search results + social shares).
// DRAFT wording for Ryan's approval. Titles aim for ≤ 60 characters, descriptions ≤ 160.
// ─────────────────────────────────────────────────────────────

export type Meta = { title: string; description: string; noindex?: boolean };

export const meta: Record<string, Meta> = {
  '/': {
    title: 'Cannabis Business Financing | Leverup Liquidity',
    description:
      'We match licensed cannabis operators with private lenders. Compare lines of credit, equipment financing, term loans and cash advances, with every fee shown first.',
  },
  '/financing': {
    title: 'Compare Cannabis Financing Options | Leverup Liquidity',
    description:
      "Lines of credit, equipment financing, term loans and cash advances for licensed cannabis businesses, side by side: amounts, terms, costs and what we're paid.",
  },
  '/financing/lines-of-credit': {
    title: 'Cannabis Business Lines of Credit | Leverup Liquidity',
    description:
      '$5K–$1M lines of credit for licensed cannabis operators. Draw for vendor orders, repay from sales, then draw again. See every fee before you sign.',
  },
  '/financing/equipment-financing': {
    title: 'Cannabis Equipment Financing | Leverup Liquidity',
    description:
      'Finance lights, HVAC and extraction gear from $10K to $5M over 24–60 months, and keep your cash for stock. Every cost shown line by line before you sign.',
  },
  '/financing/term-loans': {
    title: 'Cannabis Term Loans | Leverup Liquidity',
    description:
      'One lump sum from $50K to $5M with fixed payments over 12–60 months for a build-out, new location or buyout. Full cost up front.',
  },
  '/financing/merchant-cash-advance': {
    title: 'Cannabis Merchant Cash Advance | Leverup Liquidity',
    description:
      'Cash now for a share of future sales, $5K–$1M. See the factor rate, total payback and payment size before you sign. Not a loan. Best for short gaps.',
  },
  '/industries': {
    title: 'Cannabis Industry Financing | Leverup Liquidity',
    description:
      'Dispensaries, grows and processors each need different money. See which financing fits your license, your cash cycle and your next big expense.',
  },
  '/industries/dispensaries': {
    title: 'Dispensary Financing | Leverup Liquidity',
    description:
      'Financing for licensed dispensaries: inventory, holiday stock-ups, build-outs and tax bills. Compare real offers with every fee shown up front.',
  },
  '/industries/cultivation': {
    title: 'Cannabis Grow Financing | Leverup Liquidity',
    description:
      'Financing for licensed cultivators: lights, HVAC, benching and the months between harvests. Compare offers from lenders who fund grows.',
  },
  '/industries/processing': {
    title: 'Cannabis Processor Financing | Leverup Liquidity',
    description:
      'Financing for licensed processors and labs: extraction gear, packaging and the wait for retailers to pay. See every cost before you sign.',
  },
  '/how-it-works': {
    title: 'How Cannabis Financing Works | Leverup Liquidity',
    description:
      'Apply in five minutes. We match you with lenders, you see real numbers side by side, and you decide. No hard credit pull, no fee if you walk away.',
  },
  '/apply': {
    title: 'Apply for Cannabis Business Financing | Leverup Liquidity',
    description:
      'See what you qualify for in about five minutes. No hard credit pull, no obligation, and your files go only to lenders you approve.',
  },
  '/apply/confirmation': {
    title: 'Application Received | Leverup Liquidity',
    description: "Thanks for applying. Here's what happens next.",
    noindex: true,
  },
  '/about': {
    title: 'About Us | Leverup Liquidity',
    description:
      'Leverup Liquidity is a financing broker for licensed cannabis businesses, founded by Ryan Rodriguez. We walk you through every number before you sign.',
  },
  '/contact': {
    title: 'Contact Us | Leverup Liquidity',
    description:
      'Call or text (313) 329-7157, email info@leverupliquidity.com or book a call. Ask us anything about financing your cannabis business.',
  },
  '/faq': {
    title: 'Cannabis Financing FAQ | Leverup Liquidity',
    description:
      'Straight answers on costs, credit checks, eligibility, timing and privacy before you apply for cannabis business financing.',
  },
  '/guides': {
    title: 'Cannabis Financing Guides | Leverup Liquidity',
    description:
      'Plain-English guides to cannabis business financing: costs, factor rates, APR and how to compare offers before you sign.',
  },
  '/guides/factor-rate-vs-apr': {
    title: 'Factor Rate vs. APR: How to Compare Two Offers',
    description:
      'A factor rate and an APR measure cost differently. Learn how to compare total payback, payment size and fees before you sign a cash advance or loan.',
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
