import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { authorSchema, blogSchema } from './content-schemas';

const blog = blogSchema({ image: () => z.string(), author: z.string() });
const author = authorSchema({ image: () => z.string() });

const validPost = {
  title: 'How to map an executive market before the kickoff call',
  description:
    'A practical method for turning a role title into a defensible universe of companies and people.',
  pubDate: '2026-09-14',
  author: 'author-name',
  tags: ['market-mapping'],
  cover: './cover.png',
  coverAlt: 'A globe with amber arcs linking cities.',
};

describe('blog frontmatter', () => {
  it('accepts a complete post and treats it as published unless marked draft', () => {
    const parsed = blog.parse(validPost);

    expect(parsed.draft).toBe(false);
    expect(parsed.pubDate).toBeInstanceOf(Date);
  });

  it('rejects a description that search results would truncate', () => {
    expect(blog.safeParse({ ...validPost, description: 'x'.repeat(161) }).success).toBe(false);
  });

  it('rejects a tag outside the taxonomy the tag pages are built from', () => {
    expect(blog.safeParse({ ...validPost, tags: ['growth-hacking'] }).success).toBe(false);
  });

  it('rejects a cover without alt text', () => {
    expect(blog.safeParse({ ...validPost, coverAlt: '  ' }).success).toBe(false);
  });

  it('keeps the in-product aside pointing inside the site', () => {
    const offsite = { text: 'Read more.', href: 'https://example.com', label: 'Read' };

    expect(blog.safeParse({ ...validPost, inUncava: offsite }).success).toBe(false);
  });
});

describe('author data', () => {
  it('needs only a name', () => {
    expect(author.parse({ name: '[Author name]' })).toEqual({ name: '[Author name]' });
  });

  it('rejects a profile URL that is not a URL', () => {
    expect(author.safeParse({ name: 'A', url: 'linkedin' }).success).toBe(false);
  });
});
