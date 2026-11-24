import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { emails } from './mailboxes.ts';
import { handleEnquiry } from './enquiry/handler.ts';
import { SubmissionLimiter } from './enquiry/rate-limit.ts';
import { resendSender } from './enquiry/resend.ts';

/*
 * The website's only server code. Firebase Hosting rewrites POST /api/enquiry here (firebase.json),
 * so the form posts to its own origin and the CSP's form-action stays 'self'. Nothing is stored:
 * the enquiry becomes one email to support@uncava.com and is gone.
 */

const resendApiKey = defineSecret('RESEND_API_KEY');

const limiter = new SubmissionLimiter(5, 10 * 60 * 1000);

const SITE_ORIGINS = new Set(['https://uncava.com', 'https://www.uncava.com']);
/* Preview channels (preview.yml) live on the Hosting site's own domain. */
const PREVIEW_ORIGIN = /^https:\/\/uncava-website(--[a-z0-9-]+)?\.web\.app$/;
const EMULATOR_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

export const enquiry = onRequest(
  {
    region: 'us-central1',
    maxInstances: 3,
    concurrency: 20,
    memory: '256MiB',
    timeoutSeconds: 15,
    secrets: [resendApiKey],
    // Its own identity (scripts/gcp-bootstrap.sh), able to read the Resend key and nothing else.
    serviceAccount: 'uncava-website-enquiry@',
    invoker: 'public',
  },
  async (req, res) => {
    const dryRun = process.env['ENQUIRY_DRY_RUN'] === 'true';
    const emulated = process.env['FUNCTIONS_EMULATOR'] === 'true';
    const forwarded = req.get('x-forwarded-for')?.split(',')[0]?.trim();
    const result = await handleEnquiry(
      {
        method: req.method,
        headers: {
          origin: req.get('origin'),
          'sec-fetch-site': req.get('sec-fetch-site'),
        },
        body: req.rawBody ?? '',
        clientAddress: forwarded || req.ip || 'unknown',
      },
      {
        send: resendSender(resendApiKey.value()),
        limiter,
        mailboxes: { from: `Uncava website <${emails.website}>`, to: emails.support },
        isAllowedOrigin: (origin) =>
          SITE_ORIGINS.has(origin) ||
          PREVIEW_ORIGIN.test(origin) ||
          (emulated && EMULATOR_ORIGIN.test(origin)),
        dryRun,
        now: () => new Date(),
      },
    );
    // Outcome only: a log line never carries what the person typed (Cloud Logging outlives it).
    logger.info('enquiry', { outcome: result.outcome });
    res.set('Cache-Control', 'no-store');
    if (result.location) {
      res.redirect(result.status, result.location);
      return;
    }
    res.status(result.status).send();
  },
);
