/**
 * The enquiry form's fields, shared by the page that renders it and the function that receives it
 * (functions/src/enquiry imports this file), so both sides agree on names and allowed values.
 */

export const ENQUIRY_ENDPOINT = '/api/enquiry';

export const enquiryTopics = [
  { value: 'demo', label: 'Book a demo' },
  { value: 'enquiry', label: 'General enquiry' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'press', label: 'Press' },
] as const;

export const enquiryAudiences = [
  { value: 'search-firm', label: 'Search firm' },
  { value: 'in-house', label: 'In-house talent team' },
  { value: 'other', label: 'Other' },
] as const;

export const teamSizes = [
  'Just me',
  '2–5 people',
  '6–20 people',
  '21–50 people',
  'More than 50 people',
] as const;

export type EnquiryTopic = (typeof enquiryTopics)[number]['value'];
export type EnquiryAudience = (typeof enquiryAudiences)[number]['value'];

/**
 * The two rules a browser can check before posting, written once so the form's `pattern` attributes
 * and the function's validation cannot drift apart (a browser accepts "a@b" and "   ", the function
 * would not, and the visitor would lose what they typed on the error page).
 */
export const emailPattern = '[^\\s@]+@[^\\s@]+\\.[^\\s@]+';
export const notBlankPattern = '.*\\S.*';

/**
 * Field names as posted. `leave_blank` is the honeypot: people never see it, bots fill it in. It is
 * named for nothing an autofill or password manager recognises: a real visitor whose browser filled
 * it would have their enquiry silently dropped.
 */
export const enquiryFields = {
  topic: 'topic',
  firstName: 'first_name',
  lastName: 'last_name',
  email: 'email',
  company: 'company',
  audience: 'audience',
  teamSize: 'team_size',
  role: 'role',
  message: 'message',
  honeypot: 'leave_blank',
} as const;

export const enquiryLimits = {
  name: 80,
  email: 254,
  company: 120,
  role: 160,
  message: 3000,
  /** More links than this in the message reads as spam. */
  links: 3,
  /**
   * The largest request body accepted, in bytes. Form encoding turns each byte of a non-ASCII letter
   * into three characters, so a full 3,000-character message in Arabic or Chinese is 18–27 KB.
   */
  body: 40_000,
} as const;
