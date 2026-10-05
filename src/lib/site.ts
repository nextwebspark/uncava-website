export const site = {
  name: 'Uncava',
  url: 'https://uncava.com',
  appUrl: 'https://app.uncava.com',
  locale: 'en',
  ogLocale: 'en_GB',
  themeColor: '#08090b',
  tagline: 'C-suite executive search & strategy',
  description:
    'Uncava is the C-suite executive search workspace: build the search strategy, map every company and executive with AI research, and bring the client a shortlist.',
  contactEmail: '[hello@uncava.com]',
  legalName: '[Company legal name]',
  registeredAddress: '[Registered address]',
  sameAs: [] as readonly string[],
} as const;

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const primaryNav: readonly NavLink[] = [
  { label: 'Product', href: '/#workflow' },
  { label: 'Security', href: '/security' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav: readonly {
  readonly heading: string;
  readonly links: readonly NavLink[];
}[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Search strategy', href: '/#strategy' },
      { label: 'AI research', href: '/#ai' },
      { label: 'Companies', href: '/#companies' },
      { label: 'Reports', href: '/#reports' },
      { label: 'Talent map', href: '/#features' },
      { label: 'Capture extension', href: '/docs/capture/install-the-extension' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Security', href: '/security' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Legal', href: '/legal' },
    ],
  },
];

export const compactFooterNav: readonly NavLink[] = [
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Security', href: '/security' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Legal', href: '/legal' },
];
