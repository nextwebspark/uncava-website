import { emails as siteEmails } from '../../src/lib/site.ts';

/** Where enquiries go, and the address they come from (on the domain Resend has verified). */
export const emails = {
  support: siteEmails.support,
  website: 'website@uncava.com',
} as const;
