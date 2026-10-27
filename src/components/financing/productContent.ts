// ─────────────────────────────────────────────────────────────
// Financing pages: per-product content. Copy is verbatim from the Figma
// copy deck (structure-and-copy.json, page "2 · Financing").
// Shared facts (name, amount, term, card blurb, image) live in src/data/products.ts.
// ─────────────────────────────────────────────────────────────
import type { ProductKey } from '../../data/products';

export interface UseTile { title: string; icon: string }
export interface Step { title: string; body: string }

export interface ProductContent {
  key: ProductKey;
  faqKey: 'loc' | 'equipment' | 'term' | 'mca';
  h1: string;
  lede: string;
  photoAlt: string;
  /** CSS object-position for the full-width photo band crop. */
  photoPosition?: string;
  usesLede: string;
  uses: UseTile[];
  steps: Step[];
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
    'No obligation. Stop anytime.',
    'Not a fit yet? Get a written plan to qualify.',
  ],
  usesTitle: 'What owners use it for',
  howTitle: 'How it works',
  howLink: 'See the full process',
  goodFitTitle: "It's a good fit when",
  passTitle: "We'd tell you to pass when",
  faqTitle: 'Questions owners ask',
  faqLink: 'Read the FAQ',
  otherTitle: 'Other ways to fund it',
  otherLede: 'Different need? One of these may fit.',
  otherLink: 'Financing overview',
};

export const productContent: Record<ProductKey, ProductContent> = {
  loc: {
    key: 'loc',
    faqKey: 'loc',
    h1: 'Lines of credit for cannabis',
    lede: "Draw cash when a vendor order lands, pay it back from sales, and draw again.",
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
      { title: 'Apply', body: 'Tell us about your sales and license. We find lenders that offer lines to cannabis operators.' },
      { title: 'Draw as you need it', body: 'Pull cash for an order, repay from sales, and your limit opens back up.' },
    ],
    goodFit: [
      'You need cash on and off, not all at once',
      'You have 6 months of sales history',
      "You want a cushion for orders that can't wait",
    ],
    passWhen: [
      'You need one large sum for a long project',
      'Your only way to repay is another draw',
      'The draw costs more than the purchase earns',
    ],
    closeTitle: 'Have a line ready before the next big order.',
    closeLede: 'No obligation to sign.',
  },

  equipment: {
    key: 'equipment',
    faqKey: 'equipment',
    h1: 'Equipment financing for cannabis',
    lede: 'Get the lights, HVAC or extraction gear now and pay it off while it earns. Your cash stays free for inventory and payroll.',
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
      { title: 'Get your gear', body: 'The deal funds, the lender pays the vendor, and your payments start.' },
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
    closeLede: 'No obligation to sign.',
  },

  term: {
    key: 'term',
    faqKey: 'term',
    h1: 'Term loans for cannabis growth',
    lede: 'One lump sum for a build-out, a second store or a buyout.',
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
      { title: 'Apply', body: 'Basic details first. Lenders will want books, tax returns and license records next.' },
      { title: 'Fund your project', body: 'Funds land.' },
    ],
    goodFit: [
      'You have a planned project with a clear payoff',
      'Your books and license records are in order',
    ],
    passWhen: [
      'You need the money this week',
      'The payoff is still a guess',
      "You'd need to borrow again to make payments",
      'Your license status could change soon',
    ],
    closeTitle: 'Fund the project with one plan and one payment.',
    closeLede: 'No obligation to sign.',
  },

  mca: {
    key: 'mca',
    faqKey: 'mca',
    h1: 'Cash advances for cannabis',
    lede: "Cash now for a share of future sales. It's not a loan, and it isn't for everyone.",
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
      { title: 'Apply', body: 'Share recent bank statements and license details. Sales history matters most here.' },
      { title: 'Get the cash', body: 'Funds land, and a set amount or share of sales repays it until the total is paid.' },
    ],
    goodFit: [
      'You need a short bridge with a clear way to repay',
      'The return beats the cost, like a COD discount',
      'You have no other advances open',
    ],
    passWhen: [
      "You'd need a second advance to cover the first",
      "It's for a long project like a build-out",
      'Regular payments would squeeze payroll',
    ],
    closeTitle: 'Talk it through before you take a dollar.',
    closeLede: 'No obligation to sign.',
  },
};
