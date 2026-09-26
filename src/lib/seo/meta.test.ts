import { describe, expect, it } from 'vitest';
import { auditMeta, composeTitle, robotsFor } from './meta';
import { absoluteUrl, ogImagePathFor } from './url';

describe('composeTitle', () => {
  it('gives the home page the brand and tagline', () => {
    expect(composeTitle(undefined)).toBe('Uncava — Executive search & talent mapping');
  });

  it('suffixes every other page with the brand', () => {
    expect(composeTitle('Blog')).toBe('Blog — Uncava');
  });

  it('drops the brand rather than push a long title past sixty characters', () => {
    const title = 'How to map an executive market before the kickoff call';

    expect(composeTitle(title)).toBe(title);
  });
});

describe('robotsFor', () => {
  it('indexes a normal page', () => {
    expect(robotsFor({})).toBe('index,follow');
  });

  it('keeps a noindex page out of the index but lets crawlers follow its links', () => {
    expect(robotsFor({ noindex: true })).toBe('noindex,follow');
  });

  it('shuts a draft out completely', () => {
    expect(robotsFor({ draft: true, noindex: false })).toBe('noindex,nofollow');
  });
});

describe('auditMeta', () => {
  it('accepts a title and description within budget', () => {
    expect(
      auditMeta({
        title: 'Contact',
        description: 'Book a demo of Uncava on one of your own live executive search mandates.',
      }),
    ).toEqual([]);
  });

  it('flags a description that search results would truncate', () => {
    const problems = auditMeta({ title: 'Contact', description: 'x'.repeat(161) });

    expect(problems.map((problem) => problem.field)).toEqual(['description']);
  });

  it('flags a title that is too long even without the brand', () => {
    const problems = auditMeta({ title: 'x'.repeat(61), description: 'y'.repeat(80) });

    expect(problems.map((problem) => problem.field)).toEqual(['title']);
  });
});

describe('absoluteUrl', () => {
  it('strips a trailing slash, query and fragment so a page has exactly one address', () => {
    expect(absoluteUrl('/blog/?utm_source=x#top')).toBe('https://uncava.com/blog');
  });

  it('keeps the root as the bare origin', () => {
    expect(absoluteUrl('/')).toBe('https://uncava.com/');
  });

  it('maps a built .html file path to its clean URL', () => {
    expect(absoluteUrl('/security.html')).toBe('https://uncava.com/security');
    expect(absoluteUrl('/index.html')).toBe('https://uncava.com/');
  });
});

describe('ogImagePathFor', () => {
  it('names the home page image index', () => {
    expect(ogImagePathFor('/')).toBe('/og/index.png');
  });

  it('mirrors the page path', () => {
    expect(ogImagePathFor('/blog/some-post/')).toBe('/og/blog/some-post.png');
  });
});
