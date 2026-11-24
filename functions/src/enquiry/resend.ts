import type { OutgoingEmail } from './compose.ts';

const RESEND_API = 'https://api.resend.com/emails';
/* A hung mail API must not hold the visitor's request until the function times out. */
const TIMEOUT_MS = 5000;

/** Sends through Resend's HTTP API. Throws on any non-2xx answer so the caller can report it. */
export function resendSender(apiKey: string, fetchImpl: typeof fetch = fetch) {
  return async (email: OutgoingEmail): Promise<void> => {
    const response = await fetchImpl(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: email.from,
        to: email.to,
        reply_to: email.replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Resend answered ${response.status}`);
  };
}
