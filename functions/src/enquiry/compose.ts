import { enquiryAudiences, enquiryTopics } from '../../../src/lib/enquiry.ts';
import type { Enquiry } from './validate.ts';

export interface OutgoingEmail {
  readonly from: string;
  readonly to: readonly string[];
  readonly replyTo: string;
  readonly subject: string;
  readonly text: string;
  readonly html: string;
}

export interface Mailboxes {
  readonly from: string;
  readonly to: string;
}

const TOPIC_TAG: Record<Enquiry['topic'], string> = {
  demo: 'Demo',
  enquiry: 'Enquiry',
  partnership: 'Partnership',
  press: 'Press',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** The email the support inbox receives. Replying goes straight to the person who wrote in. */
export function composeEnquiryEmail(
  enquiry: Enquiry,
  mailboxes: Mailboxes,
  receivedAt: Date,
): OutgoingEmail {
  const name = `${enquiry.firstName} ${enquiry.lastName}`;
  const topic = enquiryTopics.find((t) => t.value === enquiry.topic)?.label ?? enquiry.topic;
  const audience =
    enquiryAudiences.find((a) => a.value === enquiry.audience)?.label ?? enquiry.audience;
  const rows: [string, string][] = [
    ['Topic', topic],
    ['Name', name],
    ['Work email', enquiry.email],
    ['Company', enquiry.company],
    ['They are', audience],
    ['Team size', enquiry.teamSize || '—'],
    ['Role they are hiring for', enquiry.role || '—'],
    ['Received', receivedAt.toISOString()],
  ];
  const message = enquiry.message || '(no message)';

  const text = [
    `New ${topic.toLowerCase()} from uncava.com`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    message,
    '',
    `Reply to this email to answer ${enquiry.firstName} directly.`,
  ].join('\n');

  const html = [
    `<p>New ${escapeHtml(topic.toLowerCase())} from uncava.com</p>`,
    '<table cellpadding="4" cellspacing="0">',
    ...rows.map(
      ([label, value]) =>
        `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`,
    ),
    '</table>',
    '<p><strong>Message</strong></p>',
    `<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    `<p>Reply to this email to answer ${escapeHtml(enquiry.firstName)} directly.</p>`,
  ].join('\n');

  return {
    from: mailboxes.from,
    to: [mailboxes.to],
    replyTo: enquiry.email,
    subject: `[${TOPIC_TAG[enquiry.topic]}] ${enquiry.company} — ${name}`,
    text,
    html,
  };
}
