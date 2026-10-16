---
name: security-hosting
description: Security and hosting for uncava.com — Firebase Hosting config, security headers and the Content-Security-Policy (and why /docs and /admin differ), header rule ordering, the post-build CSP audit, no secrets in the repo, Workload Identity Federation deploys and previews, pinned actions and dependency hygiene, CODEOWNERS and branch protection, DNS on Cloudflare with the proxy off. Load before touching firebase.json, .github/, deploy configuration, DNS, dependencies, or anything that adds a script, style, form target or third-party origin.
---

# Security and hosting

## Firebase Hosting (`firebase.json`)

- `public: dist`, `cleanUrls: true`, `trailingSlash: false` — must match Astro's `trailingSlash:
'never'` + `build.format: 'file'` (asserted by `tests/firebase-config.test.ts`).
- `redirects` is where every retired URL gets its 301. Redirects run before static files.
- `site: uncava-website` pins the Hosting site (the project hosts other things); `.firebaserc` names
  `hak-talent-mapping`, and CI still passes `--project` explicitly.

## Header rules: order is the mechanism

Every matching `headers` rule is applied in file order and a later rule replaces an earlier value for
the same header (superstatic calls `setHeader` per match; Hosting mirrors it). So:

1. `**` — the full baseline: CSP, HSTS, nosniff, `X-Frame-Options: DENY`, Referrer-Policy,
   Permissions-Policy, COOP, CORP, `Cache-Control: max-age=0, must-revalidate` (HTML).
2. Asset rules — `/_astro/**` immutable for a year (hashed names), `/og/**` a day, `/pagefind/**` an hour.
3. `/docs/**` — replaces the CSP only.
4. `/admin{,/**}` — replaces CSP, COOP, adds `X-Robots-Tag`, `no-store`. **Keep it last.**

`scripts/lib/firebase-headers.ts` implements this resolution; the tests use it to assert the effective
headers of real paths. Moving a rule above `**` silently loses it — the tests catch that.

## The CSP, and why three

- **Site:** `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `img-src 'self' data:`,
  `form-action 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`. Possible
  because marketing pages ship no inline script or style: `inlineStylesheets: 'never'`,
  `assetsInlineLimit: 0`, no `style=` attributes, JSON-LD only as `application/ld+json`.
- **Docs:** Starlight emits five static inline scripts (theme, sidebar state, search shortcut) —
  allowed by their `sha256` hashes — uses `style="--sl-…"` attributes (`style-src 'unsafe-inline'`),
  and Pagefind search runs WebAssembly (`'wasm-unsafe-eval'`).
- **Admin:** Sveltia CMS loads from unpkg (pinned + SRI), talks to `api.github.com`, previews blobs,
  needs `'unsafe-inline'` styles, and opens the OAuth popup — so COOP is `same-origin-allow-popups`
  there only. Nothing Sveltia needs is allowed anywhere else.

**`npm run check:csp` after every build** parses each page in `dist`, resolves the CSP firebase.json
will serve it with, and fails on an unhashed inline script, a cross-origin script, a style the policy
blocks, or a form posting to an origin missing from `form-action`. When a Starlight upgrade changes an
inline script it prints the new hash — review what changed, then replace the old hash.

Adding a third-party origin (analytics, a form provider, embeds) is a security decision: add it to
the narrowest rule, explain it in the PR. Setting `PUBLIC_DEMO_FORM_ENDPOINT` requires adding that
origin to `form-action` for `**` — the audit fails until you do.

## Secrets

None in the repository, ever: no service account keys, tokens, `.env` files (ignored). Deploys use
**Workload Identity Federation**: GitHub's OIDC token is exchanged for a short-lived credential for
the deploy service account.

Repository (or `production` environment) variables — not secrets, they are identifiers:
`GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`, `FIREBASE_PROJECT_ID`, and optionally
`PUBLIC_DEMO_FORM_ENDPOINT`, `PUBLIC_NEWSLETTER_FORM_ENDPOINT`. Workflows skip with a notice when the
first three are unset.

GCP lives in `scripts/gcp-bootstrap.sh` (idempotent, re-runnable): project `hak-talent-mapping`, Hosting
site from `hosting.site` in `firebase.json`, the shared `github-pool` with this repo's own provider
`uncava-website-provider` (condition `assertion.repository == 'nextwebspark/uncava-website'`), and the
`uncava-website-deployer` account with `roles/firebasehosting.admin` +
`roles/serviceusage.serviceUsageConsumer` only. Change roles there, never in the console.

## Workflows

- `ci.yml` (PRs + main): `npm ci`, lint, format, check, test, build, CSP audit, Lighthouse CI.
- Merging to `main` deploys nothing. `release.yml` (manual, `bump: patch|minor|major`): requires the CI
  check green on `main`, computes the next `vX.Y.Z` from the latest tag, pushes the tag, publishes a
  GitHub Release, then calls `deploy.yml` with the tag. Its `tag` job is the only one with
  `contents: write` and the only checkout that keeps credentials (it pushes the tag).
- `deploy.yml` (`workflow_call` from Release, or `workflow_dispatch` to redeploy / roll back a tag):
  accepts only `vX.Y.Z`, checks out the tag, `npm run verify`, writes `dist/version.json`, WIF auth,
  `firebase-tools deploy --only hosting --message <tag>`, smoke test (version, `h1`, CSP, HSTS,
  `/admin` noindex). Runs in the `production` environment.
- `preview.yml` (same-repo PRs only — forks never get OIDC): build, preview channel `pr-<n>` for 7 days,
  sticky comment with the URL.
- Every third-party action is pinned to a full commit SHA with its version in a comment; Dependabot
  updates both. `firebase-tools` is pinned in the `npx` call — bump it deliberately.
- `permissions:` default to `contents: read`; jobs add only `id-token: write` / `pull-requests: write`.
- `actions/checkout` uses `persist-credentials: false`.

## Dependencies

- Exact versions in `package.json`; `npm ci` in CI. Dependabot groups weekly updates (astro, styling,
  tooling, everything else, actions).
- Before merging an update: CI green, and for Astro/Starlight a look at the CSP audit output and the
  docs pages.
- `npm audit`: current advisories are in dev-only `@lhci/cli` transitive dependencies and in `satori`'s
  `fflate` (build-time only, never shipped). Reassess on each update.

## Ownership and branch protection

`CODEOWNERS` routes everything to `@nextwebspark`, and names the sensitive paths explicitly
(`.github/`, `firebase.json`, `astro.config.*`, layouts, components, `public/admin/`). Expected
protection on `main`: pull request required, one code-owner approval, required status check
`CI / Lint, check, test, build, Lighthouse`, branches up to date, no force pushes, no deletions,
signed commits recommended. CMS editors merge through the same rules.

## DNS (Cloudflare, proxy off)

Firebase Hosting provisions and renews the TLS certificate itself and must see requests directly:

- Add `uncava.com` and `www.uncava.com` as custom domains in the Firebase console; add the records it
  gives (A/AAAA or TXT + A) in Cloudflare with **Proxy status: DNS only** (grey cloud).
- Make `www` redirect to the apex in the Firebase console.
- A proxied (orange) record breaks certificate issuance and doubles caching with conflicting headers.
- HSTS includes `preload`: submit to hstspreload.org only once every subdomain serves HTTPS.
