export const site = {
  name: 'Uncava',
  url: 'https://uncava.com',
  appUrl: 'https://app.uncava.com',
  locale: 'en',
  ogLocale: 'en_GB',
  themeColor: '#08090b',
  tagline: 'Executive search & talent mapping',
  description:
    'Uncava is the workspace where search consultants draft the brief, map every company and executive that matters, and bring the client into a shortlist.',
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
      { label: 'Strategy', href: '/#workflow' },
      { label: 'Companies', href: '/#companies' },
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
    ],
  },
];

export const compactFooterNav: readonly NavLink[] = [
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Security', href: '/security' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];
