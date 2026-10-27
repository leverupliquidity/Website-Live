// ─────────────────────────────────────────────────────────────
// Rules Desk data. Every rule card, status chip, date, Updated chip and the
// hemp page's facts, questions and changelog come from this one file, so a
// date is never typed twice. Prompt 4 (Phase 1), facts checked Oct 27, 2026.
//
// Rules for editing (strategy: Compliance rules > Rule content):
//   - Every number shares its sentence with its date and source.
//   - Status reflects the latest verified status, with the source linked.
//   - Under /rules/** the guard blocks both tiers of the banned-term list.
//   - When anything material changes: update the fact, add a changelog entry,
//     move `updated` (it becomes dateModified), and get the page re-reviewed.
// ─────────────────────────────────────────────────────────────

export type Day = { iso: string; display: string };
const day = (iso: string): Day => {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return { iso, display: `${months[m - 1]} ${d}, ${y}` };
};

// Schema datetime with an explicit New York offset (Google flags dates without a time zone).
export const schemaDate = (d: Day) => {
  const noon = new Date(d.iso + 'T16:00:00Z');
  const tz = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'shortOffset' }).formatToParts(noon).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-5';
  const h = Number(tz.replace('GMT', '')) || -5;
  return `${d.iso}T12:00:00${h < 0 ? '-' : '+'}${String(Math.abs(h)).padStart(2, '0')}:00`;
};

export type Source = { label: string; href: string; date?: string };
export type Status = 'in-effect' | 'pending' | 'starts' | 'changed';

export const SOURCES = {
  pl11937: {
    label: 'Public Law 119-37, Division B, Section 781 (govinfo.gov)',
    href: 'https://www.govinfo.gov/content/pkg/PLAW-119publ37/html/PLAW-119publ37.htm',
    date: 'signed November 12, 2025',
  },
  hr6500: {
    label: 'H.R. 6500, Continuing Appropriations and Extensions Act, 2027, Sections 106 and 2019 (govinfo.gov)',
    href: 'https://www.govinfo.gov/content/pkg/BILLS-119hr6500enr/html/BILLS-119hr6500enr.htm',
    date: 'signed September 2, 2026',
  },
  crsLsb11381: {
    label: 'Congressional Research Service, Legal Sidebar LSB11381',
    href: 'https://www.everycrsreport.com/reports/LSB11381.html',
    date: 'updated December 22, 2025',
  },
  vicente: {
    label: 'Vicente LLP, Federal Hemp Update: Definition Change Delayed to December 11',
    href: 'https://vicentellp.com/insights/federal-hemp-definition-change-delay/',
    date: 'October 13, 2026',
  },
  tracker: {
    label: 'Next Level Leaf, Section 781 Hemp Deadline Tracker',
    href: 'https://www.nextlevelleaf.com/blog/section-781-hemp-deadline-tracker/',
    date: 'updated October 21, 2026',
  },
  miTreasury: {
    label: 'Michigan Department of Treasury, Wholesale Marijuana Tax',
    href: 'https://www.michigan.gov/taxes/business-taxes/wholesale-marijuana-tax',
  },
  fedReg: {
    label: 'DEA final rule, 91 FR 22714 (Federal Register)',
    href: 'https://www.federalregister.gov/documents/2026/04/28/2026-08176/schedules-of-controlled-substances-rescheduling-of-food-and-drug-administration-approved-products',
    date: 'published and effective April 28, 2026',
  },
  deaHearing: {
    label: 'DEA, Marijuana Rescheduling Regulatory Actions',
    href: 'https://www.dea.gov/marijuana-rescheduling-regulatory-actions',
  },
  usc280e: {
    label: '26 U.S.C. § 280E (Cornell Legal Information Institute)',
    href: 'https://www.law.cornell.edu/uscode/text/26/280E',
  },
  ogletree: {
    label: 'Ogletree, Marijuana Rescheduling Temporarily Paused',
    href: 'https://ogletree.com/insights-resources/blog-posts/marijuana-rescheduling-temporarily-paused/',
    date: 'October 8, 2026',
  },
} satisfies Record<string, Source>;

export const ryan = {
  name: 'Ryan Rodriguez',
  role: 'Founder and CEO, Leverup Liquidity',
  jobTitle: 'Founder and CEO',
  linkedin: 'https://www.linkedin.com/in/ryan-rodriguez-78a544444/',
};

export const GENERAL_INFO = 'General information, not legal or tax advice.';

// ── Hemp page ───────────────────────────────────────────────
export const hemp = {
  slug: '/rules/hemp-thc-ban',
  name: 'Federal hemp THC ban',
  status: 'starts' as Status,
  statusLabel: 'Starts November 12, 2026',
  published: day('2026-10-27'),
  updated: day('2026-10-27'),
  dates: [
    { date: day('2026-11-12'), firm: true, what: 'Hemp products made with cannabinoids a cannabis plant can’t produce naturally lose federal hemp status.' },
    { date: day('2026-12-11'), firm: false, what: 'The total THC test and the 0.4 mg per-container cap take effect. Subject to change: it is also the day the current stopgap spending law expires.' },
  ],
  affects: ['Dispensaries carrying hemp products', 'Brands and processors', 'Hemp growers'],
  // Review: set reviewer + date once the attorney or CPA signs off. Until then the page shows a "review pending" chip.
  review: null as null | { reviewer: string; credential: string; date: Day },

  answer:
    'Federal law redefines hemp in two steps: November 12, 2026 for hemp products made with cannabinoids the plant can’t produce, and December 11, 2026, subject to change, for anything over 0.4 mg of total THC per container (Public Law 119-37). Dispensaries, brands and processors still holding hemp THC stock by then may hold stock they can’t sell.',

  facts: [
    {
      text: 'From December 11, 2026, hemp means a cannabis plant or derivative with no more than 0.3% total THC, THCA included, on a dry-weight basis, under Public Law 119-37, Section 781, signed November 12, 2025, as delayed by H.R. 6500, Section 2019, signed September 2, 2026.',
      sources: ['pl11937', 'hr6500'],
    },
    {
      text: 'From December 11, 2026, a finished hemp product with more than 0.4 milligrams of total THC per container, THCA included, is no longer hemp under federal law (Public Law 119-37, Section 781; H.R. 6500, Section 2019, signed September 2, 2026).',
      sources: ['pl11937', 'hr6500'],
    },
    {
      text: 'From November 12, 2026, hemp products that contain cannabinoids a cannabis plant can’t produce naturally lose hemp status, because H.R. 6500, Section 2019, signed September 2, 2026, left that part on its original date.',
      sources: ['hr6500', 'pl11937'],
    },
    {
      text: 'The 0.4 milligram cap counts the whole container, which Section 781 of Public Law 119-37 (November 12, 2025) defines as the innermost wrapping, package or vessel in direct contact with the product.',
      sources: ['pl11937'],
    },
    {
      text: 'Products that fall outside the hemp definition are treated as marijuana or THC under the federal Controlled Substances Act, according to the Congressional Research Service (Legal Sidebar LSB11381, updated December 22, 2025).',
      sources: ['crsLsb11381'],
    },
    {
      text: 'December 11, 2026 is also the day the current stopgap spending law expires under H.R. 6500, Section 106, signed September 2, 2026, and Vicente LLP noted on October 13, 2026 that the next spending bill is another chance to extend the hemp delay.',
      sources: ['hr6500', 'vicente'],
    },
  ] as { text: string; sources: (keyof typeof SOURCES)[] }[],

  // Worked example (no sourced industry figure supports a calculator default).
  // Defaults are stated assumptions, not statistics.
  impact: {
    asOf: day('2026-10-27'),
    defaults: { onHand: 12000, weekly: 1500, deadline: '2026-12-11' },
  },

  questions: [
    {
      q: 'When does the hemp THC ban start?',
      a: 'In two steps. On November 12, 2026, hemp products made with cannabinoids the plant can’t produce naturally lose federal hemp status. On December 11, 2026, the total THC test and the 0.4 mg per-container cap take effect (Public Law 119-37, Section 781; H.R. 6500, Section 2019). Congress could still move the December date.',
    },
    {
      q: 'Which of my products are affected?',
      a: 'From November 12, 2026, any hemp product made with cannabinoids the plant can’t produce naturally. From December 11, 2026, any finished hemp product over 0.4 mg of total THC per container, THCA included (Public Law 119-37, Section 781). Start with hemp THC gummies, drinks, vapes and flower, and read each certificate of analysis.',
    },
    {
      q: 'Does the 0.4 mg limit count per serving or per package?',
      a: 'Per package. Section 781 of Public Law 119-37, signed November 12, 2025, caps total THC, THCA included, at 0.4 mg per container: the innermost package touching the product. A gummy with several milligrams of THC in each piece is over the cap on its own, before you count the rest of the jar.',
    },
    {
      q: 'Does the ban cover THCA flower?',
      a: 'Yes, from December 11, 2026. The new definition counts THCA toward the 0.3% total THC limit on a dry-weight basis (Public Law 119-37, Section 781). Flower that passes today’s delta-9 test but carries high THCA won’t meet the total THC test. Check each lot’s certificate of analysis with your attorney before that date.',
    },
    {
      q: 'What happens to hemp products still on my shelf after the date?',
      a: 'Section 781 sets effective dates but no separate sell-off window for stock you already hold. Products outside the hemp definition are treated as marijuana or THC under the federal Controlled Substances Act (Congressional Research Service, December 22, 2025). Your state may set its own dates too. Ask your attorney before selling affected stock after either date.',
    },
    {
      q: 'Could the December 11 date change again?',
      a: 'It could. December 11, 2026 is also the day the current stopgap spending law runs out under H.R. 6500, signed September 2, 2026, so the next spending bill could extend or change the hemp delay. As of October 21, 2026, no new law had moved either date. The changelog on this page records each change we make.',
    },
  ],

  checklist: [
    { t: 'Talk to your attorney or CPA', d: 'Ask which products you carry are affected under federal law and your state’s law, and what to do with stock you can’t sell after each date.' },
    { t: 'Check every hemp SKU', d: 'Pull each certificate of analysis. Multiply total THC concentration, THCA included, by what the container holds to get milligrams per container.' },
    { t: 'Flag converted or lab-made cannabinoids', d: 'Ask each supplier in writing how the cannabinoids in their products are made. A cannabinoid the plant can’t produce naturally faces the November 12 date.' },
    { t: 'Plan sell-through', d: 'Compare what you hold of each affected SKU with what you sell in a typical week. Use the worked example above for the dollar figure.' },
    { t: 'Adjust your buys', d: 'Pause reorders of affected SKUs that won’t clear by the date, review open purchase orders, and ask vendors about returns.' },
  ],

  changelog: [
    { date: day('2026-10-27'), text: 'First version. Dates checked against Public Law 119-37, Section 781, and H.R. 6500, Sections 106 and 2019.' },
  ],
};

// ── Rule board (the /rules hub) ────────────────────────────
// Only rules with a verified status, date and source. Linked only when their page exists.
export type RuleCardData = {
  name: string; status: Status; statusLabel: string; date: Day; dateNote: string;
  line: string; affects: string[]; sources: (keyof typeof SOURCES)[]; href?: string; updated: Day;
};

export const board: RuleCardData[] = [
  {
    name: 'Federal hemp THC ban', status: 'starts', statusLabel: 'Starts November 12, 2026',
    date: day('2026-11-12'), dateNote: 'Second step December 11, 2026, subject to change',
    line: 'Hemp products made with cannabinoids the plant can’t produce lose hemp status on November 12, 2026; the 0.4 mg per-container cap follows on December 11, 2026 (Public Law 119-37; H.R. 6500).',
    affects: hemp.affects, sources: ['pl11937', 'hr6500'], href: hemp.slug, updated: hemp.updated,
  },
  {
    name: 'Michigan’s 24% wholesale marijuana tax', status: 'in-effect', statusLabel: 'In effect',
    date: day('2026-01-01'), dateNote: 'Applies to sales and transfers on or after this date',
    line: 'Michigan’s 24% wholesale marijuana tax applies to the wholesale price of certain adult-use marijuana sales and transfers from January 1, 2026 (Michigan Department of Treasury).',
    affects: ['Michigan', 'Cultivation', 'Processing'], sources: ['miTreasury'], updated: day('2026-10-27'),
  },
  {
    name: 'Schedule III for state-licensed medical marijuana', status: 'in-effect', statusLabel: 'In effect',
    date: day('2026-04-28'), dateNote: 'DEA final rule, effective on publication',
    line: 'Marijuana under a state medical license and FDA-approved marijuana products moved from Schedule I to Schedule III on April 28, 2026; adult-use and unlicensed marijuana stayed in Schedule I (DEA final rule, 91 FR 22714).',
    affects: ['Medical dispensaries', 'Medical processors'], sources: ['fedReg'], updated: day('2026-10-27'),
  },
  {
    name: 'Rescheduling all marijuana to Schedule III', status: 'pending', statusLabel: 'Pending',
    date: day('2026-09-29'), dateNote: 'Proceeding paused by the DEA’s chief administrative law judge',
    line: 'The DEA hearing on moving the rest of marijuana to Schedule III began June 29, 2026 (DEA), and the judge paused it on September 29, 2026 to weigh a new GAO report (Ogletree, October 8, 2026). Until it moves, 280E bars deductions for businesses that traffic in Schedule I or II substances (26 U.S.C. § 280E).',
    affects: ['Adult-use dispensaries', 'Cultivation', 'Processing'], sources: ['deaHearing', 'ogletree', 'usc280e'], updated: day('2026-10-27'),
  },
];

export const hubUpdated = day('2026-10-27');
export const hubPublished = day('2026-10-27');

export const hubAnswer =
  'Three rules are moving cash for licensed operators now. Hemp products lose federal hemp status in two steps, on November 12 and December 11, 2026 (Public Law 119-37). Michigan’s 24% wholesale marijuana tax has applied since January 1, 2026 (Michigan Treasury). State-licensed medical marijuana moved to Schedule III on April 28, 2026 (DEA); adult-use marijuana hasn’t.';

// Upcoming effective dates only, each verified and linked.
export const ahead = [
  { date: day('2026-11-12'), firm: true, text: 'Hemp products made with cannabinoids the plant can’t produce lose federal hemp status.', href: hemp.slug, source: 'pl11937' as const },
  { date: day('2026-12-11'), firm: false, text: 'Hemp total THC test and 0.4 mg per-container cap take effect. Subject to change: also the day the stopgap spending law expires.', href: hemp.slug, source: 'hr6500' as const },
];

export const statusText: Record<Status, string> = {
  'in-effect': 'In effect', pending: 'Pending', starts: 'Starts on a date', changed: 'Changed',
};
