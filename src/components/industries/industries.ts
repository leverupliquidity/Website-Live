// Industry pages: copy verbatim from the Figma frames "Dispensaries / Cultivation / Processing — Desktop 1440".
// FAQs live in src/data/faq.ts (faqs.dispensaries / .cultivation / .processing).
import type { ImageMetadata } from 'astro';
import type { ProductKey } from '../../data/products';
import heroDisp from '../../assets/images/26-industry-hero-dispensaries.jpg';
import heroCult from '../../assets/images/27-industry-hero-cultivation.jpg';
import heroProc from '../../assets/images/28-industry-hero-processing.jpg';
import tileDisp from '../../assets/images/29-industries-panel-dispensaries.jpg';
import tileCult from '../../assets/images/30-industries-panel-cultivation.jpg';
import tileProc from '../../assets/images/31-industries-panel-processing.jpg';

export type IndustryKey = 'dispensaries' | 'cultivation' | 'processing';

export interface FitCard { product: ProductKey; name: string; amount: string; term: string; blurb: string }
export interface Industry {
  key: IndustryKey;
  label: string;
  href: string;
  h1: string;
  lede: string;
  hero: { src: ImageMetadata; alt: string; position?: string };
  overview: { h2: string; body: string };
  fit: { h2: string; lede: string; cards: FitCard[] };
  uses: { h2: string; lede: string; items: { icon: string; title: string; body: string }[] };
  close: { h2: string; lede: string };
  // Industries hub panel
  hub: { body: string; link: string; image: ImageMetadata; imageAlt: string };
}

const LOC = (blurb: string): FitCard => ({ product: 'loc', name: 'Lines of credit', amount: '$5K–$1M', term: '6–24 months', blurb });
const MCA = (blurb: string): FitCard => ({ product: 'mca', name: 'Cash advance', amount: '$5K–$1M', term: '6–18 months', blurb });
const EQUIP = (blurb: string): FitCard => ({ product: 'equipment', name: 'Equipment', amount: '$10K–$5M', term: '24–60 months', blurb });
const TERM = (blurb: string): FitCard => ({ product: 'term', name: 'Term loans', amount: '$50K–$5M', term: '12–60 months', blurb });

export const industries: Record<IndustryKey, Industry> = {
  dispensaries: {
    key: 'dispensaries',
    label: 'Dispensaries',
    href: '/industries/dispensaries',
    h1: 'Dispensary financing',
    lede: 'Keep top sellers on the shelf and vendors paid, without waiting on a bank.',
    hero: { src: heroDisp, alt: 'Bright retail store interior with a curved wooden ceiling and a display counter lined with plants', position: '50% 62%' },
    overview: {
      h2: 'Empty shelves cost more than you think',
      body: "Running light on your top SKUs costs sales you won't get back. Vendors want cash on delivery, and tax bills don't wait. The right capital covers the gap between buying stock and selling it.",
    },
    fit: {
      h2: 'What fits a dispensary',
      lede: 'Featured first: what shops use most.',
      cards: [
        LOC('Draw for vendor orders and holiday stock, repay from sales, draw again.'),
        MCA('Cash now for a COD discount or a short gap, repaid from sales. Not a loan.'),
        EQUIP('POS, display cases, vaults and cameras, paid off over time.'),
        TERM('A second store, a remodel or a partner buyout.'),
      ],
    },
    uses: {
      h2: 'What owners use it for',
      lede: 'The costs that hit before sales do.',
      items: [
        { icon: 'package', title: 'Vendor orders', body: 'Pay on delivery, sell through later' },
        { icon: 'calendar', title: 'Holiday stock', body: 'Full shelves for Green Wednesday' },
        { icon: 'receipt', title: 'A COD discount', body: 'Take it when a vendor offers' },
        { icon: 'users', title: 'Payroll timing', body: 'Cover slow weeks' },
        { icon: 'lock', title: 'Security upgrades', body: 'Vaults, cameras, access control' },
        { icon: 'ledger', title: 'Tax bills', body: 'Plan for them instead of scrambling' },
      ],
    },
    close: { h2: 'Keep the shelves full without waiting on a bank.', lede: 'Five minutes to apply. No obligation to sign.' },
    hub: {
      body: "Vendors want cash on delivery, and your best sellers can't sit out of stock. Running light on top SKUs before Green Wednesday costs sales you won't get back. A line of credit or short-term capital keeps the shelves full.",
      link: 'See dispensary financing',
      image: tileDisp,
      imageAlt: 'Wooden apothecary cabinet stocked with rows of labeled glass bottles',
    },
  },
  cultivation: {
    key: 'cultivation',
    label: 'Cultivation',
    href: '/industries/cultivation',
    h1: 'Cultivation financing',
    lede: 'Fund lights, HVAC and payroll between harvests, without waiting on a bank.',
    hero: { src: heroCult, alt: 'Young cannabis plants growing under bright lights in an indoor grow room', position: '50% 68%' },
    overview: {
      h2: 'Harvest pays once. Costs come monthly.',
      body: "Power, nutrients and crew payroll don't pause between harvests. Croptober cash has to last. Financing the big gear keeps that cash working on the next run.",
    },
    fit: {
      h2: 'What fits a grow',
      lede: 'Featured first: what grows use most.',
      cards: [
        EQUIP('Lights, HVAC and dehumidifiers, paid off while they earn.'),
        TERM('A new flower room, a greenhouse or a canopy expansion.'),
        LOC('Power, nutrients and payroll between harvests.'),
        MCA('A short gap before a buyer pays. Steady sales only.'),
      ],
    },
    uses: {
      h2: 'What owners use it for',
      lede: 'The costs that hit before sales do.',
      items: [
        { icon: 'layers', title: 'Lighting upgrades', body: 'More yield per square foot' },
        { icon: 'wrench', title: 'HVAC and dehumidifiers', body: 'Protect every run' },
        { icon: 'clock', title: 'Between harvests', body: 'Power, nutrients, crew' },
        { icon: 'building', title: 'Expansion', body: 'A new room or greenhouse' },
        { icon: 'wrench', title: 'Repairs', body: 'Fix it before it costs a crop' },
        { icon: 'ledger', title: 'Tax bills', body: 'Plan for them, not around them' },
      ],
    },
    close: { h2: 'Fund the next run before this one sells.', lede: 'Five minutes to apply. No obligation to sign.' },
    hub: {
      body: 'Harvest pays once. Power, nutrients and payroll come every month. Equipment financing and term loans spread lights, HVAC and build-outs over the years they earn, so harvest cash goes back into the next run.',
      link: 'See grow financing',
      image: tileCult,
      imageAlt: 'Large room of flowering cannabis plants in an indoor grow',
    },
  },
  processing: {
    key: 'processing',
    label: 'Processing',
    href: '/industries/processing',
    h1: 'Processor financing',
    lede: 'Fund extraction gear and inputs while retailers pay on terms.',
    hero: { src: heroProc, alt: 'Rows of labeled glass jars and bottles on wooden lab shelves', position: '50% 50%' },
    overview: {
      h2: "Retailers pay late. Inputs can't wait.",
      body: 'You buy biomass and packaging now and get paid on terms later. Financing the equipment and the gap keeps orders moving without draining your cash.',
    },
    fit: {
      h2: 'What fits a processor',
      lede: 'Featured first: what labs use most.',
      cards: [
        EQUIP('Extraction systems, kitchen gear and packaging lines, paid off over time.'),
        TERM('A new extraction suite, a second line or a brand purchase.'),
        LOC('Biomass, testing fees and packaging for big orders.'),
        MCA('A short gap while retailers pay. Not a loan.'),
      ],
    },
    uses: {
      h2: 'What owners use it for',
      lede: 'The costs that hit before sales do.',
      items: [
        { icon: 'wrench', title: 'Extraction equipment', body: 'Closed-loop systems and ovens' },
        { icon: 'package', title: 'Packaging lines', body: 'Pre-roll and fill machines' },
        { icon: 'layers', title: 'Biomass in volume', body: 'Buy at the right price' },
        { icon: 'clipboard-check', title: 'Testing fees', body: 'Batch and lab costs' },
        { icon: 'repeat', title: 'Retailer terms', body: 'Bridge the wait to get paid' },
        { icon: 'building', title: 'Expansion', body: 'A second line or suite' },
      ],
    },
    close: { h2: 'Keep orders moving while retailers pay.', lede: 'Five minutes to apply. No obligation to sign.' },
    hub: {
      body: "Retailers pay on terms, and biomass doesn't wait. Extraction gear and packaging lines cost real money up front. Equipment financing and term loans cover the build, so cash covers inputs for orders already booked.",
      link: 'See processor financing',
      image: tileProc,
      imageAlt: 'Glass laboratory beakers lit against a dark background',
    },
  },
};

export const industryOrder: IndustryKey[] = ['dispensaries', 'cultivation', 'processing'];
