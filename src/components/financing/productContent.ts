// ─────────────────────────────────────────────────────────────
// Financing pages: per-product content. Copy is verbatim from the Figma
// copy deck (structure-and-copy.json, page "2 · Financing").
// Shared facts (name, amount, term, card blurb, image) live in src/data/products.ts.
// Use the NB constant where the design keeps words together.
// ─────────────────────────────────────────────────────────────
import type { ProductKey } from '../../data/products';

const NB = ' ';

export interface UseTile { title: string; icon: string }
export interface Step { title: string; body: string }
export interface CostRow { item: string; figure: string; when: string; broker?: boolean }

export interface ProductContent {
  key: ProductKey;
  faqKey: 'loc' | 'equipment' | 'term' | 'mca';
  h1: string;
  lede: string;
  /** Key figures panel rows (no Payment row, per layout-fit change 1). Values may contain HTML. */
  keyFigures: [string, string][];
  photoAlt: string;
  /** CSS object-position for the full-width photo band crop. */
  photoPosition?: string;
  usesLede: string;
  uses: UseTile[];
  steps: [Step, Step, Step];
  /** Only the rows visible in the design (hidden fee rows are parked; see saved-for-later §1). */
  costs: CostRow[];
  goodFit: string[];
  passWhen: string[];
  closeTitle: string;
  closeLede: string;
}

// Shared hero / section copy used on all four product pages.
export const productShared = {
  ctaPrimary: 'See my options',
  ctaSecondary: 'Talk with us first',
  heroChecks: [
    'Every fee shown. Total cost, before you sign.',
    'No obligation. Stop anytime, no fee owed.',
    'Not a fit yet? Get a written plan to qualify.',
  ],
  keyFiguresLink: 'See the full cost below',
  usesTitle: 'What owners use it for',
  howTitle: 'How it works',
  howLede: 'Three steps, and you see every number.',
  howLink: 'See the full process',
  costsTitle: `What it costs, line${NB}by${NB}line`,
  costsLede: 'Every charge and when it hits. Your offer shows the exact figures before you sign.',
  goodFitTitle: "It's a good fit when",
  passTitle: "We'd tell you to pass when",
  faqTitle: 'Questions owners ask',
  faqLink: 'Read the FAQ',
  otherTitle: 'Other ways to fund it',
  otherLede: 'Different need? One of these may fit.',
  otherLink: 'Compare financing',
};

const BROKER_LENDER = 'At funding, by the lender';

export const productContent: Record<ProductKey, ProductContent> = {
  loc: {
    key: 'loc',
    faqKey: 'loc',
    h1: 'Lines of credit for cannabis',
    lede: "Draw cash when a vendor order lands, pay it back from sales, and draw again. You'll see every fee before you sign.",
    keyFigures: [
      ['Amount', '$5K–$1M'],
      ['Term', '6–24 months'],
      ['How often', 'Weekly, bi-weekly or monthly'],
      ['Time to fund', '2–12 hours'],
    ],
    photoAlt: 'Dispensary employee checking stock on a shelf of packaged products',
    photoPosition: '50% 40%',
    usesLede: 'Costs that show up before the sales do.',
    uses: [
      { title: 'Vendor orders', icon: 'repeat' },
      { title: 'Uneven months', icon: 'package' },
      { title: 'Payroll timing', icon: 'users' },
      { title: 'Holiday stock', icon: 'receipt' },
      { title: 'Repairs', icon: 'calendar' },
      { title: 'Tax bills', icon: 'ledger' },
    ],
    steps: [
      { title: 'Apply in 5 minutes', body: 'Tell us about your sales and license. We find lenders that offer lines to cannabis operators.' },
      { title: 'Compare real offers', body: 'See the limit, draw fees and payment terms side by side before you sign anything.' },
      { title: 'Draw as you need it', body: 'Pull cash for an order, repay from sales, and your limit opens back up.' },
    ],
    costs: [
      { item: 'Interest or draw fee', figure: '1–3% a month based on draw amount', when: 'Monthly, on what you draw' },
      { item: 'Paying off early', figure: 'No penalty', when: 'Never' },
      { item: "What we're paid", figure: '2.5%, paid by the lender', when: BROKER_LENDER, broker: true },
    ],
    goodFit: [
      'You need cash on and off, not all at once',
      'You can repay draws within 12 months',
      'You have 6 months of sales history',
      "You want a cushion for orders that can't wait",
    ],
    passWhen: [
      'You need one large sum for a long project',
      'Your only way to repay is another draw',
      'The draw costs more than the purchase earns',
      'You want one fixed payment',
    ],
    closeTitle: 'Have a line ready before the next big order.',
    closeLede: 'Five minutes to apply. No obligation to sign.',
  },

  equipment: {
    key: 'equipment',
    faqKey: 'equipment',
    h1: 'Equipment financing for cannabis',
    lede: 'Get the lights, HVAC or extraction gear now and pay it off while it earns. Your cash stays free for inventory and payroll.',
    keyFigures: [
      ['Amount', '$10K–$5M'],
      ['Term', '24–60 months'],
      ['How often', 'Monthly'],
      ['Time to fund', '2–12 hours'],
    ],
    photoAlt: 'Extraction lab bench with glassware and equipment',
    photoPosition: '50% 55%',
    usesLede: 'Gear that earns its keep.',
    uses: [
      { title: 'Grow lights', icon: 'layers' },
      { title: 'HVAC and dehumidifiers', icon: 'wrench' },
      { title: 'Extraction equipment', icon: 'package' },
      { title: 'Packaging lines', icon: 'package' },
      { title: 'Security and vaults', icon: 'shield' },
      { title: 'POS and displays', icon: 'receipt' },
    ],
    steps: [
      { title: 'Send your vendor quote', body: 'Share the quote and basic business details. Used equipment often works too.' },
      { title: 'Compare real offers', body: 'Loan or lease, payment, buyout and every fee, laid out before you sign.' },
      { title: 'Get your gear', body: 'The deal funds, the lender pays the vendor, and your payments start.' },
    ],
    costs: [
      { item: 'Rate or money factor', figure: '9.5–25% APR', when: 'Built into each payment' },
      { item: "What we're paid", figure: '2.5%, paid by the lender', when: BROKER_LENDER, broker: true },
    ],
    goodFit: [
      'The gear earns or saves more than its payment',
      'You have a vendor quote in hand',
      'It stays useful for the life of the deal',
      "You'd rather keep cash for inventory",
    ],
    passWhen: [
      "The gear will be outdated before it's paid off",
      'You need cash, not equipment',
      "The vendor quote isn't final",
      'You can pay cash without squeezing operations',
    ],
    closeTitle: 'Get the gear without draining your cash.',
    closeLede: 'Five minutes to apply. No obligation to sign.',
  },

  term: {
    key: 'term',
    faqKey: 'term',
    h1: 'Term loans for cannabis growth',
    lede: 'One lump sum for a build-out, a second store or a buyout, with fixed payments you can plan around.',
    keyFigures: [
      ['Amount', '$50K–$5M'],
      ['Term', '12–60 months'],
      ['How often', 'Weekly, bi-weekly or monthly'],
      ['Time to fund', '3–14 days'],
    ],
    photoAlt: 'Large indoor cannabis grow under rows of lights',
    photoPosition: '50% 60%',
    usesLede: 'Big projects with a clear payoff.',
    uses: [
      { title: 'A second location', icon: 'map-pin' },
      { title: 'A build-out', icon: 'building' },
      { title: 'Buying out a partner', icon: 'users' },
      { title: 'Refinancing', icon: 'repeat' },
      { title: 'Major equipment', icon: 'wrench' },
      { title: 'A cash reserve', icon: 'ledger' },
    ],
    steps: [
      { title: 'Apply in 5 minutes', body: 'Basic details first. Lenders will want books, tax returns and license records next.' },
      { title: 'Compare real offers', body: "Rate, term and every fee, side by side. Most need no collateral, and there's no prepayment penalty." },
      { title: 'Fund your project', body: 'Funds land, fixed payments start, and you know the full cost from day one.' },
    ],
    costs: [
      { item: 'Interest rate (APR where required)', figure: '8–22% APR', when: 'Built into each payment' },
      { item: 'Prepayment terms', figure: 'No penalty', when: 'Never' },
      { item: "What we're paid", figure: '3%, paid by the lender', when: BROKER_LENDER, broker: true },
    ],
    goodFit: [
      'You have a planned project with a clear payoff',
      'You want one fixed payment',
      'You can wait 1–2 weeks for a deeper review',
      'Your books and license records are in order',
    ],
    passWhen: [
      'You need the money this week',
      'The payoff is still a guess',
      "You'd need to borrow again to make payments",
      'Your license status could change soon',
    ],
    closeTitle: 'Fund the project with one plan and one payment.',
    closeLede: 'Five minutes to apply. No obligation to sign.',
  },

  mca: {
    key: 'mca',
    faqKey: 'mca',
    h1: 'Cash advances for cannabis',
    lede: "Cash now for a share of future sales. It's not a loan, and it isn't for everyone. You'll see the total payback first.",
    keyFigures: [
      ['Amount', '$5K–$1M'],
      ['Term', '6–18 months'],
      ['How often', 'Daily, weekly or monthly'],
      ['Time to fund', '2–12 hours'],
    ],
    photoAlt: 'Budtender and customer at a dispensary point-of-sale tablet',
    photoPosition: '50% 50%',
    usesLede: 'Short gaps with a clear way out.',
    uses: [
      { title: "A vendor's COD discount", icon: 'receipt' },
      { title: 'A short cash gap', icon: 'clock' },
      { title: 'Holiday inventory', icon: 'package' },
      { title: 'An urgent repair', icon: 'wrench' },
      { title: 'A tax bill', icon: 'ledger' },
      { title: 'Opening stock', icon: 'building' },
    ],
    steps: [
      { title: 'Apply in 5 minutes', body: 'Share recent bank statements and license details. Sales history matters most here.' },
      { title: 'See total payback', body: 'Factor rate, total payback and the daily, weekly or monthly payment, before you agree.' },
      { title: 'Get the cash', body: 'Funds land, and a set amount or share of sales repays it until the total is paid.' },
    ],
    costs: [
      // Layout-fit change 7: the figure no longer repeats its label ("Factor rate · 1.10–1.40").
      { item: 'Factor rate', figure: '1.10–1.40', when: 'Built into each payment' },
      { item: 'Early payoff', figure: 'No penalty, plus discounts', when: 'Never' },
      { item: "What we're paid", figure: '0.05 factor points, paid by the funder', when: 'At funding, by the funder', broker: true },
    ],
    goodFit: [
      'You need a short bridge with a clear way to repay',
      'The return beats the cost, like a COD discount',
      'Your sales can support daily, weekly or monthly payments',
      'You have no other advances open',
    ],
    passWhen: [
      "You'd need a second advance to cover the first",
      "It's for a long project like a build-out",
      'Regular payments would squeeze payroll',
      "You haven't compared the total payback",
    ],
    closeTitle: 'Know the total payback before you take a dollar.',
    closeLede: 'Five minutes to apply. No obligation to sign.',
  },
};

// ─────────────────────────────────────────────────────────────
// /financing hub: "All four, side by side" compare table.
// Values may contain <br> where the design sets a line break (layout-fit change 8).
// `mobile: false` rows are not in the Mobile 390 frame's swipe cards.
// ─────────────────────────────────────────────────────────────
export interface CompareRow {
  label: string;
  values: Record<ProductKey, string>;
  mono: boolean;
  mobile: boolean;
  broker?: boolean;
}

export const compareRows: CompareRow[] = [
  { label: 'Amount', mono: true, mobile: true, values: { loc: '$5K–$1M', equipment: '$10K–$5M', term: '$50K–$5M', mca: '$5K–$1M' } },
  { label: 'Term', mono: true, mobile: true, values: { loc: '6–24 months', equipment: '24–60 months', term: '12–60 months', mca: '6–18 months' } },
  {
    label: 'Total cost', mono: true, mobile: true,
    values: { loc: '1–3% a month based on draw amount', equipment: '9.5–25% APR', term: '8–22% APR', mca: 'Factor rate<br>1.10–1.40' },
  },
  {
    label: 'How often', mono: true, mobile: true,
    values: { loc: 'Weekly, bi-weekly or monthly', equipment: 'Monthly', term: 'Weekly, bi-weekly or monthly', mca: 'Daily, weekly or monthly' },
  },
  { label: 'Time to fund', mono: true, mobile: true, values: { loc: '2–12 hours', equipment: '2–12 hours', term: '3–14 days', mca: '2–12 hours' } },
  {
    label: 'Security', mono: false, mobile: false,
    values: { loc: 'No collateral required', equipment: 'No collateral required', term: 'Not required for<br>most term loans', mca: 'No collateral required' },
  },
  {
    label: 'Paying off early', mono: false, mobile: false,
    values: { loc: 'No penalty', equipment: 'No penalty', term: 'No penalty', mca: 'No penalty, plus discounts' },
  },
  {
    label: "What we're paid", mono: true, mobile: true, broker: true,
    values: { loc: '2.5%, paid by the lender', equipment: '2.5%, paid by the lender', term: '3%, paid by the lender', mca: '0.05 factor points, paid by the funder' },
  },
];
