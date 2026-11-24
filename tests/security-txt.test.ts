import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const securityTxt = readFileSync('public/.well-known/security.txt', 'utf8');
const field = (name: string) =>
  securityTxt
    .split('\n')
    .find((line) => line.startsWith(`${name}:`))
    ?.slice(name.length + 1)
    .trim();

describe('security.txt (RFC 9116)', () => {
  it('names the security mailbox', () => {
    expect(field('Contact')).toBe('mailto:security@uncava.com');
  });

  it('has not expired, and expires within a year as the RFC asks (renew it before it lapses)', () => {
    const expires = new Date(field('Expires') ?? '');
    const now = Date.now();

    expect(expires.getTime()).toBeGreaterThan(now);
    expect(expires.getTime() - now).toBeLessThanOrEqual(366 * 24 * 60 * 60 * 1000);
  });

  it('points at its own canonical URL', () => {
    expect(field('Canonical')).toBe('https://uncava.com/.well-known/security.txt');
  });
});
