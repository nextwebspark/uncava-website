import { describe, expect, it } from 'vitest';
import {
  blogPosting,
  breadcrumbList,
  faqPage,
  graph,
  organization,
  serializeJsonLd,
  softwareApplication,
  webSite,
} from './jsonld';

describe('organization and website', () => {
  it('link the website to its publisher by @id so the graph is one entity, not two', () => {
    const org = organization();
    const website = webSite();

    expect(website['publisher']).toEqual({ '@id': org['@id'] });
    expect(org['url']).toBe('https://uncava.com/');
  });

  it('omit sameAs while the organisation has no public profiles', () => {
    expect(organization()).not.toHaveProperty('sameAs');
  });
});

describe('softwareApplication', () => {
  it('describes the web app at app.uncava.com without inventing a price', () => {
    const app = softwareApplication({ description: 'Executive search workspace.' });

    expect(app['url']).toBe('https://app.uncava.com');
    expect(app['operatingSystem']).toBe('Web');
    expect(app).not.toHaveProperty('offers');
    expect(app).not.toHaveProperty('aggregateRating');
  });
});

describe('blogPosting', () => {
  const base = {
    title: 'How to map an executive market',
    description: 'A method.',
    path: '/blog/how-to-map/',
    imagePath: '/og/blog/how-to-map.png',
    publishedAt: new Date('2026-09-01T00:00:00Z'),
    authorName: 'Author',
    tags: ['Market mapping', 'Research craft'],
  };

  it('falls back to the publish date when a post was never updated', () => {
    const post = blogPosting(base);

    expect(post['dateModified']).toBe('2026-09-01T00:00:00.000Z');
  });

  it('reports the update date when one is given', () => {
    const post = blogPosting({ ...base, updatedAt: new Date('2026-09-10T00:00:00Z') });

    expect(post['dateModified']).toBe('2026-09-10T00:00:00.000Z');
  });

  it('resolves every URL absolutely and without a trailing slash', () => {
    const post = blogPosting(base);

    expect(post['url']).toBe('https://uncava.com/blog/how-to-map');
    expect(post['image']).toBe('https://uncava.com/og/blog/how-to-map.png');
  });
});

describe('breadcrumbList', () => {
  it('numbers positions from one in trail order', () => {
    const crumbs = breadcrumbList([
      { name: 'Blog', path: '/blog' },
      { name: 'Post', path: '/blog/post' },
    ]);

    expect(crumbs['itemListElement']).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://uncava.com/blog' },
      { '@type': 'ListItem', position: 2, name: 'Post', item: 'https://uncava.com/blog/post' },
    ]);
  });

  it('refuses an empty trail', () => {
    expect(() => breadcrumbList([])).toThrow();
  });
});

describe('faqPage', () => {
  it('wraps each answer as an accepted Answer', () => {
    const faq = faqPage([{ question: 'Is AI shown names?', answer: 'No.' }]);

    expect(faq['mainEntity']).toEqual([
      {
        '@type': 'Question',
        name: 'Is AI shown names?',
        acceptedAnswer: { '@type': 'Answer', text: 'No.' },
      },
    ]);
  });

  it('refuses an empty question list', () => {
    expect(() => faqPage([])).toThrow();
  });
});

describe('serializeJsonLd', () => {
  it('cannot be broken out of by a closing script tag inside the data', () => {
    const json = serializeJsonLd(
      graph([{ '@type': 'Thing', name: '</script><script>alert(1)</script>' }]),
    );

    expect(json).not.toContain('</script>');
    expect(JSON.parse(json)['@graph'][0].name).toBe('</script><script>alert(1)</script>');
  });
});
