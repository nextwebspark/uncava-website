export const site = {
  name: 'Uncava',
  url: 'https://uncava.com',
  appUrl: 'https://app.uncava.com',
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

export const footerNav: readonly NavLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'GDPR', href: '/legal' },
];

export const footerResources: readonly NavLink[] = [
  { label: 'For search firms', href: '/for-search-firms' },
  { label: 'For in-house teams', href: '/for-in-house-teams' },
  { label: 'Blog', href: '/blog' },
  { label: 'Docs', href: '/docs' },
  { label: 'Security', href: '/security' },
  { label: 'Contact', href: '/contact' },
];
