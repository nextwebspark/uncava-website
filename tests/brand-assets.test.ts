import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const servedCopies = [
  'favicon.svg',
  'favicon-dark.svg',
  'favicon.ico',
  'apple-touch-icon.png',
  'og-image.png',
];

describe('brand assets', () => {
  it.each(servedCopies)('serves %s exactly as brand/ holds it', (file) => {
    const source = readFileSync(new URL(`../brand/${file}`, import.meta.url));
    const served = readFileSync(new URL(`../public/${file}`, import.meta.url));
    expect(served.equals(source)).toBe(true);
  });

  it('keeps the favicons free of inline styles, which the site CSP would block', () => {
    for (const file of ['favicon.svg', 'favicon-dark.svg']) {
      const svg = readFileSync(new URL(`../brand/${file}`, import.meta.url), 'utf8');
      expect(svg).not.toMatch(/<style|style=/);
    }
  });
});
