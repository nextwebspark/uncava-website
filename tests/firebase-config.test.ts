import { describe, expect, it } from 'vitest';
import astroConfig from '../astro.config.mjs';
import {
  effectiveHeaders,
  globToRegExp,
  loadHostingConfig,
  parseCsp,
} from '../scripts/lib/firebase-headers';

const hosting = loadHostingConfig();
const headersFor = (path: string) => effectiveHeaders(hosting.headers, path);
const cspFor = (path: string) => parseCsp(headersFor(path).get('content-security-policy'));

describe('firebase.json header globs', () => {
  it('match the way Firebase roots and expands them', () => {
    expect(globToRegExp('**').test('/')).toBe(true);
    expect(globToRegExp('/admin{,/**}').test('/admin')).toBe(true);
    expect(globToRegExp('/admin{,/**}').test('/admin/config.yml')).toBe(true);
    expect(globToRegExp('/admin{,/**}').test('/administrator')).toBe(false);
    expect(globToRegExp('/_astro/**').test('/blog')).toBe(false);
  });
});

describe('hosting config', () => {
  it('serves the Astro build with the same trailing-slash policy Astro builds with', () => {
    expect(hosting.public).toBe('dist');
    expect(hosting.cleanUrls).toBe(true);
    expect(hosting.trailingSlash).toBe(false);
    expect(astroConfig.trailingSlash).toBe('never');
    expect(astroConfig.build?.format).toBe('file');
  });

  it.each(['/', '/blog/some-post', '/docs/getting-started/introduction', '/admin'])(
    'sends the baseline security headers on %s',
    (path) => {
      const headers = headersFor(path);

      expect(headers.get('strict-transport-security')).toBe(
        'max-age=63072000; includeSubDomains; preload',
      );
      expect(headers.get('x-content-type-options')).toBe('nosniff');
      expect(headers.get('x-frame-options')).toBe('DENY');
      expect(headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
      expect(headers.get('permissions-policy')).toContain('camera=()');
      expect(cspFor(path).get('frame-ancestors')).toEqual(["'none'"]);
    },
  );

  it('keeps marketing pages on a self-only policy with no inline code', () => {
    const csp = cspFor('/contact');

    expect(csp.get('script-src')).toEqual(["'self'"]);
    expect(csp.get('style-src')).toEqual(["'self'"]);
    expect(headersFor('/contact').get('cross-origin-opener-policy')).toBe('same-origin');
  });

  it('loosens the docs only as far as Starlight and Pagefind need', () => {
    const scriptSrc = cspFor('/docs/companies/import-a-spreadsheet').get('script-src') ?? [];

    expect(scriptSrc).toContain("'wasm-unsafe-eval'");
    expect(scriptSrc.some((source) => source.startsWith('https:'))).toBe(false);
  });

  it('allows the CMS its CDN and GitHub only under /admin, which is never indexed', () => {
    expect(cspFor('/admin').get('script-src')).toContain('https://unpkg.com');
    expect(cspFor('/admin').get('connect-src')).toContain('https://api.github.com');
    expect(headersFor('/admin').get('x-robots-tag')).toBe('noindex, nofollow');
    expect(headersFor('/admin').get('cross-origin-opener-policy')).toBe('same-origin-allow-popups');

    expect(cspFor('/blog').get('script-src')).not.toContain('https://unpkg.com');
    expect(headersFor('/blog').get('x-robots-tag')).toBeUndefined();
  });

  it('caches hashed assets forever and HTML not at all', () => {
    expect(headersFor('/_astro/index.Bx1.css').get('cache-control')).toBe(
      'public, max-age=31536000, immutable',
    );
    expect(headersFor('/security').get('cache-control')).toBe('public, max-age=0, must-revalidate');
  });
});
