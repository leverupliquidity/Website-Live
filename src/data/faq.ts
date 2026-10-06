// ─────────────────────────────────────────────────────────────
// Every FAQ on the site, grouped by where it appears.
// Questions are verbatim from the Figma design. Answers come from, in priority order:
//   1. Ryan's FAQ copy updates (6 Oct 2026) — final.
//   2. Answers shown in the Figma design.
//   3. docs/faq-answers.md "Approved answers".
// To edit an answer, change the text here. Blank lines inside an answer start a new paragraph.
// ─────────────────────────────────────────────────────────────

export type Faq = { q: string; a: string };

const A = {
  credit: "No. We don't run a hard credit pull, and a soft pull won't affect your score.",
  trust:
    "We get it. Fair question. A lot of owners have been burned by financing offers that looked great until the fine print showed up.\n\nHere's how we work. We're a broker, so we help you compare real offers from funders and walk you through the terms before you commit. If something doesn't make sense for your business, we'll tell you.",
  cost: "Every offer shows the total cost, payment and every fee, including what we're paid.",
  sold: 'No. It goes only to funders you approve.',
  qualify: 'It depends on your license, sales and time in business. Five minutes will tell you.',
  fast: 'About 1–3 days for most deals. Term loans take longer.',
  docs: 'Your license, recent bank statements and basic details. Five minutes to start.',
};

export const faqs: Record<string, Faq[]> = {
  home: [
    { q: 'Why should I trust a financing broker?', a: A.trust },
    { q: 'What will it really cost, including fees?', a: A.cost },
    { q: 'Will my info get sold or my phone start ringing?', a: A.sold },
    { q: 'Can a cannabis business even qualify?', a: A.qualify },
    { q: 'How fast is it, really?', a: A.fast },
    { q: 'Will applying hurt my credit?', a: A.credit },
  ],

  loc: [
    {
      q: 'Can a cannabis business get a line of credit?',
      a: "Some providers offer them to licensed operators. We'll tell you plainly if one fits your state and license.",
    },
    {
      q: 'Do I pay on the full limit or just what I use?',
      a: 'Usually just what you draw. If a lender charges a fee on the full limit, your offer will show it.',
    },
    { q: 'How big a line can I get?', a: 'Lines typically run $5K to $1M. Lenders size yours to your monthly sales.' },
    { q: 'Will applying hurt my credit?', a: A.credit },
    {
      q: 'How is this different from a cash advance?',
      a: 'A line is a limit you draw from and repay. An advance is a lump sum paid back from future sales.',
    },
  ],

  equipment: [
    {
      q: 'Can I finance used equipment?',
      a: "Often, yes. Lenders look at age, condition and resale value. Send the quote and we'll check.",
    },
    {
      q: 'Do I need a down payment?',
      a: 'It depends on the lender and your file. Down payments typically run 0–20% of the price.',
    },
    {
      q: 'Who owns the equipment?',
      a: "With a loan, it's yours, and the lender holds a lien. With a lease, the lender owns it until you buy it out.",
    },
    {
      q: 'Can I roll in install and shipping?',
      a: "Often, yes. Get install and shipping on the vendor's quote and send it to us first.",
    },
    {
      q: 'What happens at the end of a lease?',
      a: "It depends on the lease type. With a $1 buyout lease, it's yours for a dollar. With a fair market value lease, you can buy it at its current value, keep leasing or hand it back.",
    },
  ],

  term: [
    {
      q: 'Can a plant-touching business get a term loan?',
      a: "Some can, mostly through specialty lenders. We'll tell you plainly if it's realistic for your file.",
    },
    {
      q: 'What do lenders look at?',
      a: 'Your license, time in business, bank statements, tax returns and how clean your books are.',
    },
    { q: 'Is there a prepayment penalty?', a: 'No. You can pay it off early with no penalty.' },
    { q: 'Do I need collateral?', a: 'Not for most term loans. If one needs it, your offer will say so.' },
    { q: 'How long does it take?', a: "Plan on 1–3 weeks. Tell us your deadline and we'll work back from it." },
  ],

  mca: [
    {
      q: 'Is a cash advance a loan?',
      a: 'No. You sell a share of future sales for cash now, so it uses a factor rate, not an interest rate.',
    },
    {
      q: "What's a factor rate?",
      a: "A factor rate sets your total payback: $20,000 at 1.18 repays $23,600. Typical rates run 1.10 to 1.40. It isn't an interest rate, so always compare offers by total payback and payment size.",
    },
    {
      q: 'How do payments work?',
      a: 'A set amount, or a share of your sales, comes out daily or weekly until the total is paid.',
    },
    {
      q: 'Can I pay it off early?',
      a: "Sometimes. Some advances offer an early payoff discount, and many don't. Your offer will say.",
    },
    {
      q: 'I already have an advance. Can I get another?',
      a: "Maybe. We'll tell you honestly if a second one helps or just adds pressure.",
    },
  ],

  dispensaries: [
    { q: 'Do lenders work with dispensaries?', a: 'Some do, mostly private funds. We work with the ones that do.' },
    { q: 'What do I need to apply?', a: 'Your license, recent bank statements and a few basic details. Five minutes to start.' },
    {
      q: 'Can I fund holiday inventory?',
      a: "Yes. A line of credit lets you draw for the holiday buy and repay as it sells through. Short-term working capital works too if you'd rather have one lump sum.",
    },
    { q: 'Will it hurt my credit?', a: A.credit },
    {
      q: 'What about 280E?',
      a: "280E blocks most normal business deductions for plant-touching operators, which often leaves a big tax bill at a bad time. Financing doesn't change what you owe, but it can keep that bill from draining inventory or payroll. The rules may change, so check your current position with your CPA.",
    },
  ],

  cultivation: [
    { q: 'Do lenders fund grows?', a: 'Some do, mostly private and specialty lenders.' },
    {
      q: 'Can I finance lights and HVAC?',
      a: 'Yes. Lighting, HVAC, dehumidifiers and benching all fit equipment financing. Payments are typically fixed monthly over 24–60 months.',
    },
    {
      q: 'What if harvest is months out?',
      a: 'A line of credit can carry you between harvests. Draw what you need and pay it down after sales.',
    },
    { q: 'What do I need to apply?', a: 'Your license, recent bank statements and basic details. It takes about five minutes.' },
    { q: 'Will it hurt my credit?', a: A.credit },
  ],

  processing: [
    { q: 'Do lenders fund processors?', a: 'Some do, mostly private and specialty lenders.' },
    {
      q: 'Can I finance used extraction gear?',
      a: "Often, yes. Lenders weigh the age, condition and resale value of used gear, so well-known brands are usually easier to finance than older or custom builds. Send the vendor quote, with the serial number if you have it, and we'll tell you who'll take it.",
    },
    {
      q: 'Can I cover the wait for retailers to pay?',
      a: 'Yes. A line of credit or short-term capital can bridge the gap until retailers pay.',
    },
    { q: 'What do I need to apply?', a: A.docs },
    { q: 'Will it hurt my credit?', a: A.credit },
  ],

  howItWorks: [
    { q: 'How long does it take?', a: A.fast },
    { q: 'Will you pull my credit?', a: A.credit },
    {
      q: 'Do I have to take an offer?',
      a: "No. Applying doesn't commit you to anything. Look over every offer, ask questions, and walk away with no fee if none of them fit.",
    },
    { q: 'Who sees my info?', a: 'Only lenders you approve. We never sell your information.' },
    {
      q: 'What if nobody approves me?',
      a: "You get a written plan, not a form rejection. We'll tell you what held the deal back, what to fix and when it makes sense to try again. Sometimes it's as simple as a few more months of deposits.",
    },
  ],
};

// FAQ page, by category (order and names from the design).
export const faqPage: { category: string; id: string; items: Faq[] }[] = [
  { category: 'General', id: 'general', items: [{ q: 'Why should I trust a financing broker?', a: A.trust }] },
  {
    category: 'Products',
    id: 'products',
    items: [{ q: 'What if I already have an offer?', a: "Send it over. We'll tell you honestly if it's a good deal." }],
  },
  { category: 'Eligibility', id: 'eligibility', items: [{ q: 'Do I qualify?', a: A.qualify }] },
  { category: 'Costs and terms', id: 'costs', items: [{ q: 'What will it really cost?', a: A.cost }] },
  {
    category: 'Process',
    id: 'process',
    items: [
      { q: 'How fast is it?', a: A.fast },
      {
        q: 'How much work is it?',
        a: "The application takes about five minutes. Most deals then need recent bank statements and your license, which you upload once. We handle the back-and-forth with lenders, so you're not filling out the same forms five times.",
      },
    ],
  },
  {
    category: 'Privacy and consent',
    id: 'privacy',
    items: [
      { q: 'Will my info be sold?', a: A.sold },
      { q: 'Will applying hurt my credit?', a: A.credit },
    ],
  },
];
