# uncava.com

The public website, blog and documentation for **Uncava** — executive search and talent mapping.
The application lives at [app.uncava.com](https://app.uncava.com) in a separate repository.

Proprietary. © Uncava. All rights reserved.

## Stack

- [Astro](https://astro.build) — static output, TypeScript `strictest`
- [Starlight](https://starlight.astro.build) — documentation under `/docs`, with Pagefind search
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`; tokens in `src/styles/theme.css`
- Geist and Geist Mono, self-hosted via Fontsource
- Build-time Open Graph images with Satori + Sharp
- [Sveltia CMS](https://sveltiacms.app) at `/admin` for non-technical editors
- Firebase Hosting; GitHub Actions for CI, deploys and preview channels
- Vitest, ESLint, Prettier, `astro check`, Lighthouse CI

Design source of truth: `design/*.dc.html`. Brand assets: `brand/`.

## Local development

Requires Node 24 (see `.nvmrc`) and npm 11.

```bash
nvm use
npm ci
npm run dev        # http://localhost:4321
```

| Command                           | What it does                                     |
| --------------------------------- | ------------------------------------------------ |
| `npm run dev`                     | Dev server with hot reload (drafts visible)      |
| `npm run build`                   | Static build into `dist/`                        |
| `npm run preview`                 | Serve `dist/` locally                            |
| `npm run check`                   | `astro check` and `tsc`                          |
| `npm run lint` / `npm run format` | ESLint / Prettier (write)                        |
| `npm test`                        | Vitest                                           |
| `npm run check:csp`               | Audit `dist/` against the CSP in `firebase.json` |
| `npm run verify`                  | Everything CI runs except Lighthouse             |
| `npm run lhci`                    | Lighthouse CI against `dist/` (needs Chrome)     |

Optional build-time environment variables (copy into `.env`, never commit it):

| Variable                          | Effect                                                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_DEMO_FORM_ENDPOINT`       | The `/contact` form posts here. Unset: the form shows the contact email instead of a submit button. Add the endpoint's origin to `form-action` in `firebase.json`. |
| `PUBLIC_NEWSLETTER_FORM_ENDPOINT` | The blog's newsletter form posts here. Unset: a placeholder is shown. Same `form-action` rule.                                                                     |

## Editing content

Editors don't need a local setup.

1. Open **https://uncava.com/admin** and sign in with GitHub. Your GitHub account needs write access to
   `nextwebspark/uncava-website`.
2. Choose **Blog posts**, **Authors**, or a **Docs** section. Create or edit an entry.
3. **Save** opens a pull request (editorial workflow). A preview link is posted on it.
4. When it's reviewed, set it to **Ready** and **Publish**. The merge deploys the site.

Rules for images, alt text and fields are shown in the editor as hints. Developers: the CMS config and
the content schemas must change together — see `.claude/skills/content-cms/SKILL.md`.

### OAuth for Sveltia CMS

GitHub sign-in in the CMS needs a small OAuth relay, the
[Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) on Cloudflare Workers:

1. Deploy the worker (its README has a one-click deploy, or `wrangler deploy`).
2. Create a GitHub OAuth App: homepage `https://uncava.com`, authorization callback
   `https://<worker-host>/callback`.
3. Set worker variables `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (encrypted), and
   `ALLOWED_DOMAINS=uncava.com`.
4. Replace `https://[SVELTIA_AUTH_WORKER_HOST]` in `public/admin/config.yml` (`backend.base_url`) with
   the worker URL.

## Deploying

Merging to `main` runs `.github/workflows/deploy.yml`: `npm run verify`, then `firebase deploy --only
hosting`. Same-repository pull requests get a 7-day preview channel from `preview.yml`. Both skip with a
notice until configured.

### One-time Google Cloud setup

1. Create (or choose) a Firebase project and enable Hosting. Replace `[FIREBASE_PROJECT_ID]` in
   `.firebaserc`.
2. Create a service account for deploys with `roles/firebasehosting.admin`.
3. Create a Workload Identity Pool and an OIDC provider for `https://token.actions.githubusercontent.com`
   with attribute condition `assertion.repository == 'nextwebspark/uncava-website'`.
4. Allow the provider's principal set to impersonate the service account
   (`roles/iam.workloadIdentityUser`).
5. In GitHub → Settings → Secrets and variables → Actions → **Variables**, set
   `GCP_WORKLOAD_IDENTITY_PROVIDER` (full resource name), `GCP_SERVICE_ACCOUNT` (email) and
   `FIREBASE_PROJECT_ID`. No secrets are needed.

### Domains and DNS (Cloudflare)

1. In the Firebase console → Hosting → **Add custom domain**, add `uncava.com`, then `www.uncava.com`
   set to redirect to `uncava.com`.
2. In Cloudflare DNS, create exactly the records Firebase shows (TXT for verification, then A/AAAA).
3. Set every one of them to **DNS only (proxy off, grey cloud)**. Firebase issues the TLS certificate
   and serves the security headers; Cloudflare's proxy would block certificate issuance and override
   caching.
4. Wait for Firebase to report the certificate as active before relying on HSTS preload.

## Branch protection

`main` is expected to require: a pull request, one approval from a code owner (`.github/CODEOWNERS`),
the `CI` status check passing, branches up to date before merge, and no force pushes or deletions.
Content edits from the CMS follow the same rules.

## Repository layout

See `CLAUDE.md` for the layout table, invariants and conventions, and `.claude/skills/` for the detail
behind each area.

## Security

See [SECURITY.md](SECURITY.md).
