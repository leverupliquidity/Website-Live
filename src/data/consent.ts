// ─────────────────────────────────────────────────────────────
// Consent and disclaimer wording, shared by every form.
// Replaces the design's "Counsel-approved text only." placeholders.
// Built from Ryan's SMS Terms. DRAFT: Ryan must approve before launch.
// Rules: SMS boxes are never pre-checked and never required.
// ─────────────────────────────────────────────────────────────

export const consent = {
  smsTransactional: {
    label: 'Text me about my inquiry and application.',
    detail:
      'By checking this box, I agree to receive recurring automated text messages from Leverup Liquidity at the number I provided, including status updates, document requests and offers. Consent is not a condition of any purchase or of obtaining financing. Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for help.',
  },
  smsMarketing: {
    label: 'Also send me promotional texts about business financing.',
    detail:
      'Optional. Same terms as above. Consent is not a condition of any purchase or of obtaining financing, and you can reply STOP at any time.',
  },
  // Line printed under the SMS boxes (links are added by the component).
  smsFooter: 'See our SMS Terms and Privacy Policy. We never sell or share your mobile number for marketing.',

  emailSignup: {
    label: 'Email me new guides.',
    detail: 'About one email a month. Unsubscribe anytime. We never sell your information.',
  },

  contactSubmit: 'We reply within one business day. We never sell your information.',

  articleDisclaimer:
    "This guide is general information, not financial, legal or tax advice. Figures are examples only. Your offer will show your actual costs and terms, and you should check your situation with your CPA or attorney.",
} as const;
