import {
  enquiryAudiences,
  enquiryFields as f,
  enquiryLimits,
  enquiryTopics,
  emailPattern,
  teamSizes,
  type EnquiryAudience,
  type EnquiryTopic,
} from '../../../src/lib/enquiry.ts';

export interface Enquiry {
  readonly topic: EnquiryTopic;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly company: string;
  readonly audience: EnquiryAudience;
  readonly teamSize: string;
  readonly role: string;
  readonly message: string;
}

export type ValidationResult =
  | { readonly kind: 'valid'; readonly enquiry: Enquiry }
  | { readonly kind: 'spam' }
  | { readonly kind: 'invalid'; readonly fields: readonly string[] };

/* Deliberately simple: one @, a dot in the domain, no spaces. The reply proves the rest. */
const EMAIL = new RegExp(`^${emailPattern}$`);
const LINK = /https?:\/\/|www\./gi;
/* Control characters other than tab and newline never belong in a form field. */
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const LINE_BREAK = /[\r\n]/;

function text(form: URLSearchParams, name: string): string {
  return (form.get(name) ?? '').trim();
}

/** Checks a submitted form. A filled honeypot is reported as spam, never as an error. */
export function validateEnquiry(form: URLSearchParams): ValidationResult {
  if (text(form, f.honeypot) !== '') return { kind: 'spam' };

  const bad: string[] = [];
  const singleLine = (name: string, max: number, required: boolean): string => {
    const value = text(form, name);
    if (
      (required && value === '') ||
      value.length > max ||
      CONTROL.test(value) ||
      LINE_BREAK.test(value)
    ) {
      bad.push(name);
    }
    return value;
  };

  const topic = text(form, f.topic);
  if (!enquiryTopics.some((t) => t.value === topic)) bad.push(f.topic);
  const audience = text(form, f.audience);
  if (!enquiryAudiences.some((a) => a.value === audience)) bad.push(f.audience);
  const teamSize = text(form, f.teamSize);
  if (teamSize !== '' && !teamSizes.some((size) => size === teamSize)) bad.push(f.teamSize);

  const firstName = singleLine(f.firstName, enquiryLimits.name, true);
  const lastName = singleLine(f.lastName, enquiryLimits.name, true);
  const email = singleLine(f.email, enquiryLimits.email, true);
  if (email !== '' && !EMAIL.test(email)) bad.push(f.email);
  const company = singleLine(f.company, enquiryLimits.company, true);
  const role = singleLine(f.role, enquiryLimits.role, false);

  const message = text(form, f.message).replace(/\r\n/g, '\n');
  if (message.length > enquiryLimits.message || CONTROL.test(message)) bad.push(f.message);

  const links = `${message} ${role}`.match(LINK)?.length ?? 0;
  // Not silent spam: someone pasting a few profile links is a person, and must be told it failed.
  if (links > enquiryLimits.links) bad.push(f.message);

  if (bad.length > 0) return { kind: 'invalid', fields: [...new Set(bad)] };
  return {
    kind: 'valid',
    enquiry: {
      topic: topic as EnquiryTopic,
      firstName,
      lastName,
      email,
      company,
      audience: audience as EnquiryAudience,
      teamSize,
      role,
      message,
    },
  };
}
