/**
 * The Report demo: Sarah Mitchell's assessment against the CFO brief. Technical competencies carry
 * 60 points and behavioural 40; each criterion's weight within its group sets its share of those.
 */

export type CompetencyGroup = 'technical' | 'behavioural';

export interface Criterion {
  readonly name: string;
  readonly group: CompetencyGroup;
  /** Weight within its group, in percent. */
  readonly weight: number;
  /** The score the AI drafts from the evidence, out of 10. */
  readonly draftScore: number;
  readonly brief: string;
  readonly evidence: string;
}

export const criteria: readonly Criterion[] = [
  {
    name: 'Capital Markets',
    group: 'technical',
    weight: 20,
    draftScore: 10,
    brief: 'Has taken a business through a listing or a major capital raise.',
    evidence:
      'From her CV and the interview transcript: led the 2022 IPO workstream at Alderwick Dairy, from choosing the advisers to a Tadawul listing in under nine months.',
  },
  {
    name: 'Financial Control',
    group: 'technical',
    weight: 20,
    draftScore: 8,
    brief: 'Runs month-end close and controls across a multi-entity group.',
    evidence:
      'Not covered in depth in the interview. Her CV shows a group controller role across nine entities. Probe in the second interview.',
  },
  {
    name: 'Commercial Acumen',
    group: 'technical',
    weight: 20,
    draftScore: 8,
    brief: 'Links finance to pricing, margin and commercial decisions.',
    evidence: 'Rebuilt pricing on the dairy lines and says margins improved. No figures given yet.',
  },
  {
    name: 'M&A and Integration',
    group: 'technical',
    weight: 20,
    draftScore: 7,
    brief: 'Has led acquisitions and their integration.',
    evidence:
      'One bolt-on acquisition in 2021; integration was led by operations rather than finance.',
  },
  {
    name: 'Treasury and Funding',
    group: 'technical',
    weight: 20,
    draftScore: 9,
    brief: 'Manages banking relationships, treasury and funding.',
    evidence: 'Refinanced group debt in 2023 with three regional banks.',
  },
  {
    name: 'Stakeholder Influence',
    group: 'behavioural',
    weight: 34,
    draftScore: 8,
    brief: 'Influences boards and senior stakeholders.',
    evidence: 'Talked the board out of a dual listing on cost grounds.',
  },
  {
    name: 'Family Governance',
    group: 'behavioural',
    weight: 33,
    draftScore: 10,
    brief: 'Works effectively within family shareholder governance.',
    evidence:
      'Sends a monthly shareholder council pack; agreed one dividend policy that every family branch signed.',
  },
  {
    name: 'Change Management',
    group: 'behavioural',
    weight: 33,
    draftScore: 7,
    brief: 'Leads a finance function through change.',
    evidence:
      'Moved finance to a shared service centre; limited detail on how the team was brought along.',
  },
];

export const reportSections: readonly { readonly title: string; readonly text: string }[] = [
  {
    title: 'Career summary',
    text: "Sarah is a CFO with 18 years in GCC consumer businesses. She started in audit, joined Alderwick Dairy in 2014 and became CFO in 2019, leading the company's 2022 listing on Tadawul.",
  },
  {
    title: 'Core value to the client',
    text: "Strongest on the brief's heaviest requirements, capital markets and family governance. She has already done the listing Halden is planning.",
  },
  {
    title: 'Concerns / areas to probe',
    text: 'Multi-entity financial control was not covered in depth, and her M&A integration experience is limited to one bolt-on.',
  },
  {
    title: 'Personality & working style',
    text: 'Calm, direct and well prepared. Explains numbers simply to non-finance shareholders.',
  },
  {
    title: 'Motivation for the role',
    text: 'Wants a group CFO seat with a listing ahead. Open to Riyadh, to discuss with her family.',
  },
];

const GROUP_POINTS: Record<CompetencyGroup, number> = { technical: 60, behavioural: 40 };

/** The most points a criterion can contribute to the overall 100. */
export function maxPoints(criterion: Criterion): number {
  return (GROUP_POINTS[criterion.group] * criterion.weight) / 100;
}

export interface AssessmentTotals {
  readonly scored: number;
  readonly overall: number | null;
  readonly technicalPoints: number | null;
  readonly behaviouralPoints: number | null;
  readonly technicalAverage: number | null;
  readonly behaviouralAverage: number | null;
}

/** Totals for a set of scores (out of 10, or null while unscored), aligned with `criteria`. */
export function totals(scores: readonly (number | null)[]): AssessmentTotals {
  let technicalPoints = 0;
  let behaviouralPoints = 0;
  let technicalSum = 0;
  let behaviouralSum = 0;
  let technicalCount = 0;
  let behaviouralCount = 0;
  criteria.forEach((criterion, i) => {
    const score = scores[i];
    if (score == null) return;
    const points = (score / 10) * maxPoints(criterion);
    if (criterion.group === 'technical') {
      technicalPoints += points;
      technicalSum += score;
      technicalCount += 1;
    } else {
      behaviouralPoints += points;
      behaviouralSum += score;
      behaviouralCount += 1;
    }
  });
  const scored = technicalCount + behaviouralCount;
  return {
    scored,
    overall: scored ? technicalPoints + behaviouralPoints : null,
    technicalPoints: technicalCount ? technicalPoints : null,
    behaviouralPoints: behaviouralCount ? behaviouralPoints : null,
    technicalAverage: technicalCount ? technicalSum / technicalCount : null,
    behaviouralAverage: behaviouralCount ? behaviouralSum / behaviouralCount : null,
  };
}

/** Scores clamp to 1–10, as the app's stepper does. */
export function clampScore(score: number): number {
  return Math.max(1, Math.min(10, score));
}
