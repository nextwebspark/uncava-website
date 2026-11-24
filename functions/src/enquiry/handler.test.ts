import { describe, expect, it, vi } from 'vitest';
import type { OutgoingEmail } from './compose.ts';
import { handleEnquiry, type EnquiryDeps, type EnquiryRequest } from './handler.ts';
import { SubmissionLimiter } from './rate-limit.ts';
import { resendSender } from './resend.ts';

const validForm = {
  topic: 'demo',
  first_name: 'Layla',
  last_name: 'Haddad',
  email: 'layla@firm.example',
  company: 'Example Search Partners',
  audience: 'search-firm',
  team_size: '6–20 people',
  role: 'Group CFO, Riyadh',
  message: 'We have a CFO search starting next month.',
  website: '',
};

function request(
  fields: Record<string, string> = validForm,
  overrides: Partial<EnquiryRequest> = {},
): EnquiryRequest {
  return {
    method: 'POST',
    headers: { origin: 'https://uncava.com', 'sec-fetch-site': 'same-origin' },
    body: new URLSearchParams(fields).toString(),
    clientAddress: '203.0.113.7',
    ...overrides,
  };
}

function deps(overrides: Partial<EnquiryDeps> = {}) {
  const sent: OutgoingEmail[] = [];
  const all: EnquiryDeps = {
    send: async (email) => {
      sent.push(email);
    },
    limiter: new SubmissionLimiter(5, 600_000),
    mailboxes: { from: 'Uncava website <website@uncava.com>', to: 'support@uncava.com' },
    isAllowedOrigin: (origin) => origin === 'https://uncava.com',
    dryRun: false,
    now: () => new Date('2026-11-24T10:00:00Z'),
    ...overrides,
  };
  return { all, sent };
}

describe('handleEnquiry', () => {
  it('emails a valid enquiry to support with the sender as reply-to, then shows the thanks page', async () => {
    const { all, sent } = deps();
    const response = await handleEnquiry(request(), all);

    expect(response).toEqual({ status: 303, location: '/contact/thanks', outcome: 'sent' });
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      to: ['support@uncava.com'],
      replyTo: 'layla@firm.example',
      subject: '[Demo] Example Search Partners — Layla Haddad',
    });
    expect(sent[0]?.text).toContain('Group CFO, Riyadh');
  });

  it('escapes what people type before it reaches the HTML email', async () => {
    const { all, sent } = deps();
    await handleEnquiry(request({ ...validForm, message: '<script>alert(1)</script>' }), all);

    expect(sent[0]?.html).not.toContain('<script>');
    expect(sent[0]?.html).toContain('&lt;script&gt;');
  });

  it('pretends a filled honeypot succeeded and sends nothing', async () => {
    const { all, sent } = deps();
    const response = await handleEnquiry(
      request({ ...validForm, website: 'https://spam.example' }),
      all,
    );

    expect(response).toMatchObject({ status: 303, location: '/contact/thanks', outcome: 'spam' });
    expect(sent).toHaveLength(0);
  });

  it('treats a message full of links as spam', async () => {
    const { all, sent } = deps();
    const message = 'https://a.example https://b.example https://c.example https://d.example';
    const response = await handleEnquiry(request({ ...validForm, message }), all);

    expect(response.outcome).toBe('spam');
    expect(sent).toHaveLength(0);
  });

  it('sends a person back to the error page when a required field is missing', async () => {
    const { all, sent } = deps();
    const response = await handleEnquiry(request({ ...validForm, email: '' }), all);

    expect(response).toMatchObject({ status: 303, location: '/contact/error', outcome: 'invalid' });
    expect(sent).toHaveLength(0);
  });

  it('rejects a line break in a single-line field, which could forge an email header', async () => {
    const { all } = deps();
    const response = await handleEnquiry(
      request({ ...validForm, company: 'Acme\r\nBcc: x@y.example' }),
      all,
    );

    expect(response.outcome).toBe('invalid');
  });

  it('rejects an unknown topic or audience', async () => {
    const { all } = deps();
    expect((await handleEnquiry(request({ ...validForm, topic: 'free-money' }), all)).outcome).toBe(
      'invalid',
    );
    expect((await handleEnquiry(request({ ...validForm, audience: 'robot' }), all)).outcome).toBe(
      'invalid',
    );
  });

  it('refuses a post from another site', async () => {
    const { all, sent } = deps();
    const response = await handleEnquiry(
      request(validForm, {
        headers: { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' },
      }),
      all,
    );

    expect(response).toEqual({ status: 403, outcome: 'cross-site' });
    expect(sent).toHaveLength(0);
  });

  it('accepts a preview channel by its origin', async () => {
    const { all } = deps({ isAllowedOrigin: (origin) => origin.endsWith('.web.app') });
    const response = await handleEnquiry(
      request(validForm, { headers: { origin: 'https://uncava-website--pr-12-abc.web.app' } }),
      all,
    );

    expect(response.outcome).toBe('sent');
  });

  it('answers anything but POST with 405', async () => {
    const { all } = deps();
    expect(await handleEnquiry(request(validForm, { method: 'GET' }), all)).toEqual({
      status: 405,
      outcome: 'wrong-method',
    });
  });

  it('refuses an oversized body', async () => {
    const { all } = deps();
    const response = await handleEnquiry(
      request({ ...validForm, message: 'x'.repeat(11_000) }),
      all,
    );

    expect(response).toEqual({ status: 413, outcome: 'too-large' });
  });

  it('slows a burst from one address down after five submissions', async () => {
    const { all, sent } = deps();
    const outcomes = [];
    for (let i = 0; i < 6; i++) outcomes.push((await handleEnquiry(request(), all)).outcome);

    expect(outcomes.slice(0, 5)).toEqual(['sent', 'sent', 'sent', 'sent', 'sent']);
    expect(outcomes[5]).toBe('rate-limited');
    expect(sent).toHaveLength(5);
  });

  it('reports a failed send so the person can email instead', async () => {
    const { all } = deps({ send: () => Promise.reject(new Error('Resend answered 500')) });
    const response = await handleEnquiry(request(), all);

    expect(response).toMatchObject({
      status: 303,
      location: '/contact/error?reason=send',
      outcome: 'send-failed',
    });
  });

  it('sends nothing in a dry run', async () => {
    const { all, sent } = deps({ dryRun: true });
    const response = await handleEnquiry(request(), all);

    expect(response.outcome).toBe('dry-run');
    expect(sent).toHaveLength(0);
  });
});

describe('resendSender', () => {
  it('posts the email to Resend with the API key and reply-to', async () => {
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 200 }));
    const send = resendSender('re_test_key', fetchImpl as unknown as typeof fetch);

    await send({
      from: 'Uncava website <website@uncava.com>',
      to: ['support@uncava.com'],
      replyTo: 'layla@firm.example',
      subject: 'Hello',
      text: 'Hi',
      html: '<p>Hi</p>',
    });

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer re_test_key');
    expect(JSON.parse(String(init.body))).toMatchObject({
      reply_to: 'layla@firm.example',
      to: ['support@uncava.com'],
    });
  });

  it('throws when Resend refuses the email', async () => {
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 422 }));
    const send = resendSender('re_test_key', fetchImpl as unknown as typeof fetch);

    await expect(
      send({ from: 'a', to: ['b'], replyTo: 'c', subject: 'd', text: 'e', html: 'f' }),
    ).rejects.toThrow('422');
  });
});
