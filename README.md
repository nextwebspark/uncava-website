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

Merging to `main` deploys nothing — CI proves the site is releasable and stops there. Production changes
only through a release. Same-repository pull requests still get a 7-day preview channel from
`preview.yml`.

### Cutting a release

GitHub → Actions → **Release** → Run workflow, choosing `patch`, `minor` or `major`.

1. It refuses unless CI is green on the tip of `main` (`force` overrides).
2. It takes the latest `vX.Y.Z` tag, bumps the chosen part (the first release is `v0.1.0`), pushes the
   tag and publishes a GitHub Release whose notes are the merged pull requests since the last one.
3. It calls **Deploy** with that tag: `npm run verify` on the tag, `firebase deploy --only hosting` with
   the version as the release message, then a smoke test against the live site.

The tag is the version; `package.json` is not bumped. What is live is always one request away:
`https://uncava.com/version.json` → `{"version","commit","deployedAt"}`.

### Redeploying or rolling back

GitHub → Actions → **Deploy** → Run workflow with an existing tag, e.g. `v0.3.0`. It rebuilds that tag
and ships it; no new version is cut. For an instant rollback without a rebuild, use Firebase console →
Hosting → release history → **Rollback**, then redeploy the tag so `version.json` agrees.

### One-time Google Cloud setup

The site lives in the `hak-talent-mapping-fe0e5` Firebase project as its own Hosting site (`hosting.site` in
`firebase.json`), deployed by a keyless Workload Identity Federation identity. All of it is created by
one idempotent, re-runnable script:

```bash
gcloud auth login
./scripts/gcp-bootstrap.sh   # GCP_PROJECT / GITHUB_REPO override the defaults
```

It enables the APIs, adds Firebase to the project, creates the Hosting site, the
`uncava-website-deployer` service account (`roles/firebasehosting.admin` and
`roles/serviceusage.serviceUsageConsumer` only) and a WIF provider pinned to this repository, then
prints the `gh variable set` commands for `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`,
`FIREBASE_PROJECT_ID` and, once the domain is connected, `PUBLIC_BASE_URL`. No secrets are needed.
Until those variables are set, Deploy and Preview skip with a notice.

By hand, once: the `production` environment (required reviewer, deployments from `main` only) and a tag
ruleset on `v*` blocking update and deletion.

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
