import loc from '../assets/images/03-product-loc.jpg';
import equipment from '../assets/images/04-product-equipment.jpg';
import term from '../assets/images/05-product-term.jpg';
import mca from '../assets/images/06-product-mca.jpg';

const NB = ' ';

// Shared product facts. Copy is verbatim from the Figma copy deck.
export const products = [
  {
    key: 'loc',
    name: 'Lines of credit',
    menuName: 'Lines of credit',
    href: '/financing/lines-of-credit',
    amount: '$5K–$1M',
    term: `6–24${NB}months`,
    cardBlurb: 'Draw as needs come up, repay, then draw again. Made for vendor orders.',
    menuBlurb: 'Draw what you need, pay it back, draw again.',
    image: loc,
    imageAlt: 'Dispensary employee checking stock on a shelf of packaged products',
  },
  {
    key: 'equipment',
    name: 'Equipment financing',
    menuName: 'Equipment',
    href: '/financing/equipment-financing',
    amount: '$10K–$5M',
    term: `24–60${NB}months`,
    cardBlurb: 'Lights, HVAC and extraction gear now, with your cash kept for stock.',
    menuBlurb: 'New gear now, paid off over its working life.',
    image: equipment,
    imageAlt: 'Extraction lab bench with glassware and equipment',
  },
  {
    key: 'term',
    name: 'Term loans',
    menuName: 'Term loans',
    href: '/financing/term-loans',
    amount: '$50K–$5M',
    term: `12–60${NB}months`,
    cardBlurb: 'One lump sum and fixed payments for a build-out or a new location.',
    menuBlurb: 'One lump sum for a build-out, store or buyout.',
    image: term,
    imageAlt: 'Large indoor cannabis grow under rows of lights',
  },
  {
    key: 'mca',
    name: 'Merchant cash advance',
    menuName: 'Cash advance',
    href: '/financing/merchant-cash-advance',
    amount: '$5K–$1M',
    term: `6–18${NB}months`,
    cardBlurb: 'Cash now for a share of future sales. Not a loan. Best for short gaps.',
    menuBlurb: 'Cash now for a share of future sales. Not a loan.',
    image: mca,
    imageAlt: 'Budtender and customer at a dispensary point-of-sale tablet',
  },
] as const;

export type ProductKey = (typeof products)[number]['key'];
export const productByKey = (k: ProductKey) => products.find((p) => p.key === k)!;
