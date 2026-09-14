# Security policy

This repository is the public website for Uncava (`uncava.com`): marketing pages, blog and docs. The
Uncava application at `app.uncava.com` is a separate codebase.

## Reporting a vulnerability

Please report security issues privately to **[security contact email]**, or through GitHub's
**Report a vulnerability** button on this repository's Security tab. Do not open a public issue.

Include what you found, where (URL or file), how to reproduce it, and the impact you expect. We will
acknowledge your report within **[acknowledgement time]** and keep you updated until it is resolved.

## Scope

In scope: `uncava.com`, `www.uncava.com`, `/admin` on those hosts, this repository's workflows and
configuration.

Out of scope for this repository: `app.uncava.com` (report to the same address; it will be routed),
third-party services (GitHub, Firebase, Cloudflare, Sveltia CMS) except where our configuration of
them is at fault, and findings that need a compromised device or browser.

## How the site is protected

- Static build with no server code; no client JavaScript on marketing pages.
- A strict Content-Security-Policy on every route, loosened only for `/docs` and `/admin`, audited
  against the built output on every CI run.
- HSTS with preload, `frame-ancestors 'none'`, `nosniff`, a restrictive Permissions-Policy.
- No credentials in the repository: deploys use Workload Identity Federation; CMS editors sign in with
  their own GitHub accounts and publish through reviewed pull requests.
- Third-party GitHub Actions are pinned to commit SHAs; dependencies are pinned and updated weekly.
