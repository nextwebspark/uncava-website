import { enquiryLimits } from '../../../src/lib/enquiry.ts';
import { composeEnquiryEmail, type Mailboxes, type OutgoingEmail } from './compose.ts';
import type { SubmissionLimiter } from './rate-limit.ts';
import { validateEnquiry } from './validate.ts';

/** The parts of an HTTP request the handler reads, so it can be tested without a server. */
export interface EnquiryRequest {
  readonly method: string;
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly body: Buffer | string;
  readonly clientAddress: string;
}

export interface EnquiryResponse {
  readonly status: number;
  readonly location?: string;
  /** What happened, for the log line. Never personal data. */
  readonly outcome:
    | 'sent'
    | 'dry-run'
    | 'spam'
    | 'invalid'
    | 'rate-limited'
    | 'send-failed'
    | 'cross-site'
    | 'too-large'
    | 'wrong-method';
}

export interface EnquiryDeps {
  readonly send: (email: OutgoingEmail) => Promise<void>;
  readonly limiter: SubmissionLimiter;
  readonly mailboxes: Mailboxes;
  /** Origins a browser may post the form from (the site and its preview channels). */
  readonly isAllowedOrigin: (origin: string) => boolean;
  readonly dryRun: boolean;
  readonly now: () => Date;
}

export const THANKS_PATH = '/contact/thanks';
export const ERROR_PATH = '/contact/error';

const redirect = (location: string, outcome: EnquiryResponse['outcome']): EnquiryResponse => ({
  status: 303,
  location,
  outcome,
});

/**
 * Receives the enquiry form and emails it to the support inbox. Every outcome a person can cause
 * ends in a redirect to a page that explains it, so the form works without JavaScript.
 */
export async function handleEnquiry(
  request: EnquiryRequest,
  deps: EnquiryDeps,
): Promise<EnquiryResponse> {
  if (request.method !== 'POST') return { status: 405, outcome: 'wrong-method' };

  // The form posts from our own pages only. Browsers send these headers on every form POST.
  const site = request.headers['sec-fetch-site'];
  const origin = request.headers['origin'];
  const sameSite = site === 'same-origin' || (origin !== undefined && deps.isAllowedOrigin(origin));
  if (!sameSite) return { status: 403, outcome: 'cross-site' };

  const size =
    typeof request.body === 'string' ? Buffer.byteLength(request.body) : request.body.length;
  if (size > enquiryLimits.body) return { status: 413, outcome: 'too-large' };

  if (!deps.limiter.allow(request.clientAddress, deps.now().getTime())) {
    return redirect(`${ERROR_PATH}?reason=busy`, 'rate-limited');
  }

  const form = new URLSearchParams(request.body.toString());
  const result = validateEnquiry(form);
  // A bot that fills the trap is told it succeeded, so it learns nothing.
  if (result.kind === 'spam') return redirect(THANKS_PATH, 'spam');
  if (result.kind === 'invalid') return redirect(ERROR_PATH, 'invalid');

  const email = composeEnquiryEmail(result.enquiry, deps.mailboxes, deps.now());
  if (deps.dryRun) return redirect(THANKS_PATH, 'dry-run');
  try {
    await deps.send(email);
  } catch {
    return redirect(`${ERROR_PATH}?reason=send`, 'send-failed');
  }
  return redirect(THANKS_PATH, 'sent');
}
