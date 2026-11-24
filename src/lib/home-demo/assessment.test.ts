import { describe, expect, it } from 'vitest';
import { clampScore, criteria, maxPoints, totals } from './assessment';

describe('assessment totals', () => {
  it('splits 100 points 60:40 between technical and behavioural criteria', () => {
    const all = criteria.reduce((sum, criterion) => sum + maxPoints(criterion), 0);
    expect(all).toBeCloseTo(100, 6);
  });

  it('shows nothing until a criterion is scored', () => {
    const empty = totals(criteria.map(() => null));
    expect(empty).toMatchObject({ scored: 0, overall: null, technicalAverage: null });
  });

  it('adds the AI draft up to the overall score the demo shows', () => {
    const draft = totals(criteria.map((criterion) => criterion.draftScore));
    expect(draft.scored).toBe(8);
    expect(draft.technicalPoints).toBeCloseTo(50.4, 6);
    expect(draft.behaviouralPoints).toBeCloseTo(33.32, 6);
    expect(draft.overall).toBeCloseTo(83.72, 6);
  });

  it('keeps a hand-edited score inside 1–10', () => {
    expect(clampScore(11)).toBe(10);
    expect(clampScore(0)).toBe(1);
  });
});
