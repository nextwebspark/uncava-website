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

/** Field names as posted. `website` is the honeypot: people never see it, bots fill it in. */
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
  honeypot: 'website',
} as const;

export const enquiryLimits = {
  name: 80,
  email: 254,
  company: 120,
  role: 160,
  message: 3000,
  /** More links than this in the message reads as spam. */
  links: 3,
  /** The largest request body accepted, in bytes. */
  body: 10_000,
} as const;
