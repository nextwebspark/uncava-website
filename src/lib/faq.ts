export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

/**
 * "Questions buyers ask", from the home artboard. `dataSources` and `ats` wait on a real answer, so no
 * page lists them yet: add them back to the lists once the brackets are filled.
 */
export const buyerQuestions = {
  aiDecides: {
    question: 'Does the AI make hiring decisions?',
    answer:
      'No. AI reads and drafts: briefs, company suggestions, call notes, first-draft scores and a suggested ranking. Your team approves every change, and the weighting maths behind the ranking is plain arithmetic you control.',
  },
  hiringManagers: {
    question: 'What can hiring managers see?',
    answer:
      'Only what you share: report chapters by link. Notes, assessments and the ranking stay with your team.',
  },
  dataSources: {
    question: 'Where does the company and people data come from?',
    answer: "[Confirm: your team's research, imports and any connected data providers.]",
  },
  clientsSeeWork: {
    question: 'We’re a search firm. Can our clients see the work?',
    answer:
      'Yes, when you choose to share it. Market maps, progress and assessment reports go to clients by link, and your notes stay inside the firm.',
  },
  inHouseWithFirms: {
    question: 'We’re an in-house team. Can we still use search firms?',
    answer:
      'Yes. Run some searches yourselves and brief firms on others. Uncava gives you the market evidence to brief and manage a firm well too.',
  },
  ats: {
    question: 'Does it replace our ATS?',
    answer:
      '[Confirm positioning: alongside or instead of your ATS, and which integrations exist.]',
  },
  security: {
    question: 'Is our data kept separate and secure?',
    answer:
      'Each workspace is walled off from every other, with two-factor sign-in and an audit log. Contact details and pay are never sent to the AI.',
  },
} as const satisfies Record<string, FaqEntry>;

export const homeFaq: readonly FaqEntry[] = [
  buyerQuestions.aiDecides,
  buyerQuestions.hiringManagers,
  buyerQuestions.clientsSeeWork,
  buyerQuestions.inHouseWithFirms,
  buyerQuestions.security,
];
