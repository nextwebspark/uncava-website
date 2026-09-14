---
name: verify
description: How to verify a change to uncava.com end to end before calling it done — npm run verify, previewing the built site, checking responsive layout and horizontal overflow, Lighthouse CI, and inspecting sitemap, RSS, llms.txt, OG images and headers in dist. Load before declaring any change complete or opening a pull request.
---

# Verify

## 1. The gate: `npm run verify`

Runs, in order, exactly what CI runs except Lighthouse:

```bash
npm run lint          # ESLint (astro + typescript-eslint strict)
npm run format:check  # Prettier; fix with npm run format
npm run check         # astro check + tsc --noEmit
npm test              # Vitest: lib units, firebase.json headers, CMS lockstep
npm run build         # astro build → dist/
npm run check:csp     # every page runs under the CSP firebase.json serves it with
```

Nothing is done until this passes. Don't disable a rule or delete an assertion to get there.

## 2. Look at it

```bash
npm run build && npm run preview   # http://localhost:4321 — stop it when finished
```

`npm run dev` is fine while building, but check the built output before finishing: the dev server
serves drafts and doesn't run the CSP.

For every page you touched, compare against its `design/*.dc.html` artboard at **1440px** and **390px**,
and check **360px** for horizontal overflow. A quick overflow probe in the browser console:

```js
[...document.querySelectorAll('body *')].filter(
  (el) => el.getBoundingClientRect().right > innerWidth + 1,
);
```

Also check: the mobile menu opens and every link works; keyboard tab order reaches the skip link
first; `prefers-reduced-motion` (DevTools → Rendering) leaves nothing half-animated.

## 3. Lighthouse

```bash
npm run build && npm run lhci
```

Needs a local Chrome. Budgets (fail below): performance 0.95, accessibility 0.95, best practices 0.95,
SEO 1.0. Reports land in `.lighthouseci/`; CI uploads them as the `lighthouse-reports` artifact. Add a
new important page to `lighthouserc.json` `collect.url` (as its `.html` path).

## 4. Inspect the output

```bash
cat dist/sitemap-0.xml            # every public page, no /admin, /404 or trailing slashes
head -c 1500 dist/blog/rss.xml    # published posts only
cat dist/llms.txt
ls dist/og dist/og/blog           # one PNG per page/post/docs page
grep -o '<link rel="canonical"[^>]*>' dist/<page>.html
grep -o '<script type="application/ld+json">[^<]*' dist/<page>.html
```

Open an OG image (`dist/og/...png`) and read it: title not clipped, description not overflowing.

Headers can't be seen in `astro preview`. For them, trust `tests/firebase-config.test.ts`, and after a
preview-channel deploy run `curl -sI https://<channel-url>/docs/getting-started/introduction`.

## 5. Content changes

- Schema or CMS change → `npm test` (lockstep) and open `/admin` against a preview channel.
- New post → it appears on `/blog`, its tag page, RSS, sitemap and llms.txt; a `draft: true` post
  appears in none of them after `npm run build`.

## 6. Before the PR

Fill in `.github/pull_request_template.md` honestly, with desktop and mobile screenshots for UI work.
