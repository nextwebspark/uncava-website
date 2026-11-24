/**
 * The Rank demo's arithmetic, as the app does it: each candidate's assessed competency scores (out
 * of 10) are weighted within their group, and the two groups are blended by the technical share.
 * Changing weights changes influence, never the assessed scores.
 */

export interface RankingCandidate {
  readonly key: string;
  readonly name: string;
  readonly first: string;
  readonly title: string;
  readonly technical: readonly number[];
  readonly behavioural: readonly number[];
}

export interface Weighting {
  /** Technical share of the overall score, 0–100. Behavioural is the rest. */
  readonly technicalShare: number;
  readonly technicalWeights: readonly number[];
  readonly behaviouralWeights: readonly number[];
}

export interface Scenario extends Weighting {
  readonly label: string;
}

export const technicalCompetencies = [
  'Capital Markets',
  'Financial Control',
  'Commercial Acumen',
  'M&A and Integration',
  'Treasury and Funding',
] as const;

export const behaviouralCompetencies = [
  'Stakeholder Influence',
  'Family Governance',
  'Change Management',
] as const;

export const scenarios: readonly Scenario[] = [
  {
    label: 'Agreed baseline 60:40',
    technicalShare: 60,
    technicalWeights: [20, 20, 20, 20, 20],
    behaviouralWeights: [34, 33, 33],
  },
  {
    label: 'Deal-ready 70:30',
    technicalShare: 70,
    technicalWeights: [25, 15, 15, 35, 10],
    behaviouralWeights: [34, 33, 33],
  },
  {
    label: 'Behaviour-led 40:60',
    technicalShare: 40,
    technicalWeights: [20, 20, 20, 20, 20],
    behaviouralWeights: [34, 33, 33],
  },
  {
    label: 'Governance first',
    technicalShare: 60,
    technicalWeights: [20, 20, 20, 20, 20],
    behaviouralWeights: [20, 60, 20],
  },
];

export const baseline: Scenario = scenarios[0] as Scenario;

export const candidates: readonly RankingCandidate[] = [
  {
    key: 'sarah',
    name: 'Sarah Mitchell',
    first: 'Sarah',
    title: 'CFO · Alderwick Dairy',
    technical: [10, 8, 8, 7, 9],
    behavioural: [8, 10, 7],
  },
  {
    key: 'daniel',
    name: 'Daniel Weber',
    first: 'Daniel',
    title: 'Finance Director · Atlas Central Foods',
    technical: [7, 8, 8, 7, 7],
    behavioural: [10, 9, 10],
  },
  {
    key: 'karim',
    name: 'Karim Aziz',
    first: 'Karim',
    title: 'CFO · Calder Brands',
    technical: [8, 10, 9, 10, 8],
    behavioural: [7, 6, 8],
  },
  {
    key: 'nadia',
    name: 'Nadia Haddad',
    first: 'Nadia',
    title: 'CFO · Jade Eastern Mills',
    technical: [8, 9, 8, 8, 8],
    behavioural: [8, 8, 8],
  },
  {
    key: 'priya',
    name: 'Priya Raman',
    first: 'Priya',
    title: 'Divisional CFO · Sahara Dairy Group',
    technical: [7, 8, 7, 6, 8],
    behavioural: [9, 9, 8],
  },
  {
    key: 'wei',
    name: 'Wei Chen',
    first: 'Wei',
    title: 'Group CFO · Ridge Gulf Agro',
    technical: [9, 7, 7, 8, 7],
    behavioural: [7, 7, 7],
  },
];

/** Overall score out of 100: 10 × (share × weighted technical + rest × weighted behavioural). */
export function overallScore(candidate: RankingCandidate, weighting: Weighting): number {
  const technical = candidate.technical.reduce(
    (sum, score, i) => sum + (score * (weighting.technicalWeights[i] ?? 0)) / 100,
    0,
  );
  const behavioural = candidate.behavioural.reduce(
    (sum, score, i) => sum + (score * (weighting.behaviouralWeights[i] ?? 0)) / 100,
    0,
  );
  const share = weighting.technicalShare / 100;
  return 10 * (share * technical + (1 - share) * behavioural);
}

/**
 * Sets one weight and spreads the remainder over the others in proportion to their current
 * values, so a group always sums to 100.
 */
export function rebalance(weights: readonly number[], index: number, value: number): number[] {
  const next = weights.slice();
  const target = Math.max(0, Math.min(100, Math.round(value)));
  const others = weights.map((weight, i) => (i === index ? 0 : weight));
  const othersTotal = others.reduce((sum, weight) => sum + weight, 0);
  const rest = 100 - target;
  next[index] = target;
  let assigned = 0;
  let last = -1;
  next.forEach((_, i) => {
    if (i === index) return;
    const share =
      othersTotal > 0
        ? Math.round((rest * (others[i] ?? 0)) / othersTotal)
        : Math.round(rest / (weights.length - 1));
    next[i] = share;
    assigned += share;
    last = i;
  });
  if (last >= 0) next[last] = (next[last] ?? 0) + rest - assigned;
  return next;
}

export interface RankedRow {
  readonly candidate: RankingCandidate;
  readonly baselineScore: number;
  readonly scenarioScore: number;
  readonly baselineRank: number;
  readonly scenarioRank: number;
}

/** Ranks every candidate under the baseline and under the given weighting, in input order. */
export function rankCandidates(
  weighting: Weighting,
  pool: readonly RankingCandidate[] = candidates,
): RankedRow[] {
  const rows = pool.map((candidate) => ({
    candidate,
    baselineScore: overallScore(candidate, baseline),
    scenarioScore: overallScore(candidate, weighting),
  }));
  const baselineOrder = rows.slice().sort((a, b) => b.baselineScore - a.baselineScore);
  const scenarioOrder = rows.slice().sort((a, b) => b.scenarioScore - a.scenarioScore);
  return rows.map((row) => ({
    ...row,
    baselineRank: baselineOrder.indexOf(row) + 1,
    scenarioRank: scenarioOrder.indexOf(row) + 1,
  }));
}

export interface RankingSummary {
  readonly headline: string;
  readonly detail: string;
  readonly leadChip: string;
}

/** The sentence the ranking view leads with: who leads, and whether that changed. */
export function summarise(rows: readonly RankedRow[]): RankingSummary {
  const byScenario = rows.slice().sort((a, b) => a.scenarioRank - b.scenarioRank);
  const leader = byScenario[0];
  const runnerUp = byScenario[1];
  const baselineLeader = rows.find((row) => row.baselineRank === 1);
  if (!leader || !runnerUp || !baselineLeader) throw new Error('Ranking needs two candidates.');
  const lead = `${(leader.scenarioScore - runnerUp.scenarioScore).toFixed(1)}-point lead over ${runnerUp.candidate.first}`;
  if (leader === baselineLeader) {
    return {
      headline: `${leader.candidate.first} leads under these priorities.`,
      detail: `${leader.candidate.first} scores ${leader.scenarioScore.toFixed(1)} against ${runnerUp.candidate.first}'s ${runnerUp.scenarioScore.toFixed(1)}.`,
      leadChip: lead,
    };
  }
  return {
    headline: `${leader.candidate.first} moves ahead of ${baselineLeader.candidate.first}.`,
    detail: `Under this scenario ${leader.candidate.first} scores ${leader.scenarioScore.toFixed(1)}; ${baselineLeader.candidate.first} drops to ${baselineLeader.scenarioScore.toFixed(1)} (rank ${baselineLeader.scenarioRank}).`,
    leadChip: lead,
  };
}
