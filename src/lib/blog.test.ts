import { describe, expect, it } from 'vitest';
import { relatedPosts, selectPublished } from './blog';

const post = (id: string, pubDate: string, tags: string[], draft = false) => ({
  id,
  data: { pubDate: new Date(pubDate), draft, tags },
});

describe('selectPublished', () => {
  const posts = [
    post('old', '2026-01-01', ['product']),
    post('draft', '2026-09-01', ['product'], true),
    post('new', '2026-06-01', ['product']),
  ];

  it('leaves drafts out of a production build, newest first', () => {
    expect(selectPublished(posts, false).map((entry) => entry.id)).toEqual(['new', 'old']);
  });

  it('shows drafts when asked, so authors can preview them locally', () => {
    expect(selectPublished(posts, true).map((entry) => entry.id)).toEqual(['draft', 'new', 'old']);
  });
});

describe('relatedPosts', () => {
  const current = post('current', '2026-09-01', ['market-mapping', 'research-craft']);
  const candidates = [
    current,
    post('one-shared-recent', '2026-08-01', ['market-mapping']),
    post('two-shared', '2026-02-01', ['market-mapping', 'research-craft']),
    post('none-shared', '2026-08-30', ['product']),
    post('one-shared-older', '2026-03-01', ['research-craft']),
  ];

  it('ranks by shared tags, then recency, and never suggests the post being read', () => {
    expect(relatedPosts(current, candidates).map((entry) => entry.id)).toEqual([
      'two-shared',
      'one-shared-recent',
      'one-shared-older',
    ]);
  });
});
