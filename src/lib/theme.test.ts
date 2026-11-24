import { describe, expect, it } from 'vitest';
import { oppositeScheme, parseScheme } from './theme';

describe('parseScheme', () => {
  it('opens dark unless the reader chose light', () => {
    expect(parseScheme(null)).toBe('dark');
    expect(parseScheme('')).toBe('dark');
    expect(parseScheme('auto')).toBe('dark');
    expect(parseScheme('dark')).toBe('dark');
    expect(parseScheme('light')).toBe('light');
  });
});

describe('oppositeScheme', () => {
  it('flips between the two schemes', () => {
    expect(oppositeScheme('dark')).toBe('light');
    expect(oppositeScheme('light')).toBe('dark');
  });
});
