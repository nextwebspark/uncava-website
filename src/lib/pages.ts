import { site } from './site';

export interface StaticPageMeta {
  readonly path: string;
  readonly title: string;
  readonly ogTitle: string;
  readonly description: string;
  readonly noindex?: boolean;
}

/** Every hand-built page's search metadata in one place, so the OG image route can render them too. */
export const staticPages = {
  home: {
    path: '/',
    title: site.name,
    ogTitle: 'Build the strategy behind every C-suite search.',
    description: site.description,
  },
  blog: {
    path: '/blog',
    title: 'Blog',
    ogTitle: 'Field notes on executive search.',
    description:
      'Field notes on executive search: how research teams map markets, decide on companies and keep clients close to the search.',
  },
  contact: {
    path: '/contact',
    title: 'Book a demo',
    ogTitle: 'See Uncava on one of your own mandates.',
    description:
      'Book a 30-minute Uncava demo on one of your live searches: we build the brief, pull a first universe of companies and map it with you.',
  },
  security: {
    path: '/security',
    title: 'Security',
    ogTitle: 'Confidential by design.',
    description:
      'How Uncava keeps executive search confidential: isolated workspaces, invitation-only membership, read-only client seats, and names masked before AI.',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy policy',
    ogTitle: 'Privacy policy',
    description:
      'How Uncava collects, uses and protects personal data on uncava.com and in the Uncava executive search application.',
  },
  terms: {
    path: '/terms',
    title: 'Terms of service',
    ogTitle: 'Terms of service',
    description:
      'The terms that govern use of the uncava.com website and the Uncava executive search and talent mapping application.',
  },
  legal: {
    path: '/legal',
    title: 'Legal',
    ogTitle: 'Legal',
    description:
      'Every Uncava legal document in one place: privacy policy, terms of service, acceptable use, cookies, sub-processors and the data processing addendum.',
  },
  acceptableUse: {
    path: '/acceptable-use',
    title: 'Acceptable use policy',
    ogTitle: 'Acceptable use policy',
    description:
      'What Uncava may and may not be used for, including how executives are contacted through outreach and how do-not-contact requests are respected.',
  },
  cookies: {
    path: '/cookies',
    title: 'Cookie notice',
    ogTitle: 'Cookie notice',
    description:
      'The cookies and browser storage uncava.com and the Uncava application use. Strictly necessary only: no analytics, advertising or tracking cookies.',
  },
  subprocessors: {
    path: '/subprocessors',
    title: 'Sub-processors',
    ogTitle: 'Sub-processors',
    description:
      'The third parties that process personal data on behalf of Uncava, what each one does, and where the data is processed.',
  },
  dpa: {
    path: '/dpa',
    title: 'Data processing addendum',
    ogTitle: 'Data processing addendum',
    description:
      'How Uncava processes personal data on behalf of search firms and hiring teams: roles, instructions, security, sub-processors, transfers and deletion.',
  },
  notFound: {
    path: '/404',
    title: 'Page not found',
    ogTitle: 'Page not found',
    description:
      'The page you were looking for does not exist or has moved. Find your way back to the Uncava product, docs and blog.',
    noindex: true,
  },
} as const satisfies Record<string, StaticPageMeta>;

export type StaticPageKey = keyof typeof staticPages;
