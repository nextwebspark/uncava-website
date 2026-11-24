import { describe, expect, it } from 'vitest';
import {
  baseline,
  candidates,
  overallScore,
  rankCandidates,
  rebalance,
  scenarios,
  summarise,
} from './ranking';

const byName = (name: string) => {
  const candidate = candidates.find((c) => c.name === name);
  if (!candidate) throw new Error(name);
  return candidate;
};

describe('overallScore', () => {
  it('blends the weighted technical and behavioural averages by the technical share', () => {
    // Sarah: technical 8.4, behavioural 8.33 (34/33/33) → 10 × (0.6 × 8.4 + 0.4 × 8.33)
    expect(overallScore(byName('Sarah Mitchell'), baseline)).toBeCloseTo(83.72, 2);
  });

  it('never exceeds 100 when every competency scores 10', () => {
    const perfect = {
      ...byName('Sarah Mitchell'),
      technical: [10, 10, 10, 10, 10],
      behavioural: [10, 10, 10],
    };
    for (const scenario of scenarios) {
      expect(overallScore(perfect, scenario)).toBeCloseTo(100, 6);
    }
  });
});

describe('rebalance', () => {
  it('keeps a group summing to 100 whatever weight is moved', () => {
    for (const value of [0, 5, 33, 50, 70, 100]) {
      const next = rebalance([20, 20, 20, 20, 20], 1, value);
      expect(next[1]).toBe(value);
      expect(next.reduce((a, b) => a + b, 0)).toBe(100);
    }
  });

  it('spreads the remainder in proportion to the other weights', () => {
    expect(rebalance([20, 60, 20], 0, 40)).toEqual([40, 45, 15]);
  });

  it('shares the remainder evenly when every other weight is zero', () => {
    expect(rebalance([100, 0, 0], 0, 40)).toEqual([40, 30, 30]);
  });
});

describe('rankCandidates and summarise', () => {
  it('has Sarah leading the agreed baseline', () => {
    const rows = rankCandidates(baseline);
    const leader = rows.find((row) => row.scenarioRank === 1);
    expect(leader?.candidate.first).toBe('Sarah');
    expect(summarise(rows).headline).toBe('Sarah leads under these priorities.');
  });

  it('reports who moves ahead when priorities change', () => {
    const behaviourLed = scenarios.find((s) => s.label.startsWith('Behaviour-led'));
    if (!behaviourLed) throw new Error('scenario');
    const rows = rankCandidates(behaviourLed);
    const leader = rows.find((row) => row.scenarioRank === 1);
    expect(leader?.candidate.first).toBe('Daniel');
    expect(summarise(rows).headline).toBe('Daniel moves ahead of Sarah.');
  });

  it('never changes a baseline score when the scenario changes', () => {
    const before = rankCandidates(baseline).map((row) => row.baselineScore);
    const after = rankCandidates(scenarios[1] ?? baseline).map((row) => row.baselineScore);
    expect(after).toEqual(before);
  });
});
