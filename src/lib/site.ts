export const site = {
  name: 'Uncava',
  url: 'https://uncava.com',
  appUrl: 'https://beta.uncava.com',
  locale: 'en',
  ogLocale: 'en_GB',
  themeColor: '#08090b',
  tagline: 'The operating system for executive search',
  description:
    'Uncava is the operating system for executive search: map the market, find who is in role, assess on evidence and agree the shortlist, in one place.',
  legalName: 'Uncava',
  registeredAddress: '[Registered address]',
  linkedIn: 'https://www.linkedin.com/company/uncava/',
  sameAs: ['https://www.linkedin.com/company/uncava/'] as readonly string[],
  founder: {
    name: 'Hakan Alac',
    role: 'Founder',
    linkedIn: 'https://www.linkedin.com/in/hakanalac/',
  },
} as const;

/**
 * The blog is built and reachable by its URL, but nothing links to it while this is false: no nav or
 * footer link, no RSS discovery link, and it stays out of the sitemap and llms.txt. Owner's call
 * (2026-11): hidden until there is more to read.
 */
export const blogListed = false;

/** Every published mailbox, by the job it does. The enquiry form delivers to `support`. */
export const emails = {
  support: 'support@uncava.com',
  hello: 'hello@uncava.com',
  contact: 'contact@uncava.com',
  team: 'team@uncava.com',
  privacy: 'privacy@uncava.com',
  legal: 'legal@uncava.com',
  security: 'security@uncava.com',
} as const;

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const primaryNav: readonly NavLink[] = [
  { label: 'Product', href: '/#highlights' },
  { label: 'How it works', href: '/#workflow' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
];

export interface FooterColumn {
  readonly title: string;
  readonly links: readonly NavLink[];
}

/** Off-site and mailto links are written in full; everything else is a site path. */
export const footerColumns: readonly FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/#highlights' },
      { label: 'How it works', href: '/#workflow' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/security' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'For search firms', href: '/for-search-firms' },
      { label: 'For in-house teams', href: '/for-in-house-teams' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Book a demo', href: '/contact' },
      { label: 'Contact us', href: '/contact?topic=enquiry' },
    ],
  },
  {
    title: 'Resources',
    links: [
      ...(blogListed ? [{ label: 'Blog', href: '/blog' }] : []),
      { label: 'Docs', href: '/docs' },
      { label: 'Sign in', href: site.appUrl },
      { label: 'Legal', href: '/legal' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'LinkedIn', href: site.linkedIn },
      { label: 'Support', href: `mailto:${emails.support}` },
      { label: 'Email us', href: `mailto:${emails.contact}` },
    ],
  },
];

export const footerLegal: readonly NavLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'GDPR and other policies', href: '/legal' },
];
