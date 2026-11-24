/** "Your whole search, running in one place": the six stages of a retained search. */

export interface StageDot {
  readonly x: number;
  readonly y: number;
}

export interface SearchStage {
  readonly name: string;
  readonly volume: string;
  readonly weeks: string;
  /** A hiring-manager checkpoint: the stage ends with a live report link. */
  readonly checkpoint: boolean;
  readonly isBrief: boolean;
  readonly dots: readonly StageDot[];
  readonly whatHappens: string;
  readonly inUncava: string;
  readonly aiHelpsWith: string;
  readonly teamDecides: string;
  readonly hiringManagerSees: string;
}

/** Dots laid out on a grid inside the plate, as percentages of its face. */
export function gridDots(
  cols: number,
  rows: number,
  count: number,
  lo: number,
  hi: number,
): StageDot[] {
  const out: StageDot[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (out.length >= count) break;
      out.push({
        x: cols === 1 ? 50 : lo + (c * (hi - lo)) / (cols - 1),
        y: rows === 1 ? 50 : lo + (r * (hi - lo)) / (rows - 1),
      });
    }
  }
  return out;
}

export const stages: readonly SearchStage[] = [
  {
    name: 'Brief',
    volume: '1 brief',
    weeks: 'Weeks 0–1',
    checkpoint: true,
    isBrief: true,
    dots: [],
    whatHappens:
      'Agree the role, scope, competencies and their weights, pay range, target companies and off-limits with the hiring manager.',
    inUncava:
      'Drop in the job description. The brief fills itself, every field linked to the line it came from.',
    aiHelpsWith: 'Drafts the brief and the assessment criteria from the JD.',
    teamDecides: 'Set the competencies and weights, then get sign-off.',
    hiringManagerSees: 'The signed-off brief and success profile.',
  },
  {
    name: 'Market map',
    volume: '~100 executives',
    weeks: 'Weeks 1–3',
    checkpoint: true,
    isBrief: false,
    dots: gridDots(10, 10, 100, 14, 86),
    whatHappens: 'Map every relevant company and the executives inside them.',
    inUncava: 'Live-count filters, the universe table and a sector × seniority heatmap.',
    aiHelpsWith: 'Suggests and tiers target companies, with its reasons.',
    teamDecides: 'Tick what goes into the universe.',
    hiringManagerSees:
      'The shape of the market: where talent sits and which pockets are still empty.',
  },
  {
    name: 'Engage',
    volume: '~35 engaged',
    weeks: 'Weeks 2–5',
    checkpoint: false,
    isBrief: false,
    dots: gridDots(6, 6, 35, 18, 82),
    whatHappens: 'Approach the strongest people in the market and track every reply.',
    inUncava: 'Sequences sent from your own inbox, one conversation per person, booking links.',
    aiHelpsWith: 'Drafts personalised messages for you to review.',
    teamDecides: 'Approve, send and run the conversation.',
    hiringManagerSees: 'Mapping progress and momentum, updated live.',
  },
  {
    name: 'Assess',
    volume: '~12 interviewed',
    weeks: 'Weeks 4–7',
    checkpoint: false,
    isBrief: false,
    dots: [
      { x: 22, y: 24 },
      { x: 45, y: 18 },
      { x: 70, y: 26 },
      { x: 84, y: 44 },
      { x: 30, y: 44 },
      { x: 55, y: 40 },
      { x: 18, y: 64 },
      { x: 42, y: 62 },
      { x: 66, y: 58 },
      { x: 80, y: 76 },
      { x: 34, y: 82 },
      { x: 58, y: 80 },
    ],
    whatHappens: 'Interview against the brief and score every competency.',
    inUncava:
      'Questions per competency, the interview notetaker, changes from the call, scoring with evidence.',
    aiHelpsWith:
      'Transcribes, proposes record updates with quotes, drafts scores. Career-only evidence is marked Inferred.',
    teamDecides: 'Review and submit every score.',
    hiringManagerSees: 'Remuneration: where your band sits against disclosed pay.',
  },
  {
    name: 'Shortlist',
    volume: '3–5 presented',
    weeks: 'Weeks 7–8',
    checkpoint: true,
    isBrief: false,
    dots: [
      { x: 24, y: 26 },
      { x: 76, y: 28 },
      { x: 28, y: 76 },
      { x: 74, y: 74 },
    ],
    whatHappens: 'Present a shortlist you can defend, and the trade-offs behind it.',
    inUncava: 'Transparent ranking, what-if weightings and side-by-side comparison.',
    aiHelpsWith:
      'Can suggest a draft ranking from all the evidence. The weighting maths is plain arithmetic your team controls.',
    teamDecides: 'Choose who to present, and why.',
    hiringManagerSees: 'The shortlist, with the evidence behind each name.',
  },
  {
    name: 'Hire',
    volume: '1 hire',
    weeks: 'Weeks 8–12',
    checkpoint: true,
    isBrief: false,
    dots: [{ x: 50, y: 50 }],
    whatHappens: 'Make the offer, negotiate and close.',
    inUncava: 'Pay intelligence against your band. The full record stays in your talent memory.',
    aiHelpsWith: 'Not used for the decision.',
    teamDecides: 'Make the offer.',
    hiringManagerSees: 'The final report. The mapped market is kept for the next search.',
  },
];

export interface StageDetailRow {
  readonly label: string;
  readonly value: string;
  readonly tone: 'muted' | 'product' | 'ai' | 'team' | 'client';
}

export function stageDetail(stage: SearchStage): StageDetailRow[] {
  return [
    { label: 'What happens', value: stage.whatHappens, tone: 'muted' },
    { label: 'In Uncava', value: stage.inUncava, tone: 'product' },
    { label: 'AI helps with', value: stage.aiHelpsWith, tone: 'ai' },
    { label: 'Your team decides', value: stage.teamDecides, tone: 'team' },
    { label: 'Hiring manager sees', value: stage.hiringManagerSees, tone: 'client' },
  ];
}
