---
name: seo
description: The non-negotiable SEO checklist for uncava.com — title and description budgets, canonical, OG image, JSON-LD type per page kind, heading order, alt text, internal linking, sitemap/robots/llms.txt/RSS, drafts, redirects when a slug changes, Core Web Vitals budgets, Search Console — and how to verify with Lighthouse CI and the Rich Results Test. Load before adding or changing any page, slug, metadata, structured data or crawl file.
---

# SEO

## Per-page checklist

Every indexable page, no exceptions:

- [ ] **Title** — the rendered `<title>` is ≤ 60 characters. `composeTitle()` appends ` — Uncava`
      and drops it rather than exceed 60. Unique across the site.
- [ ] **Description** — 50–160 characters, unique, written for a person choosing a search result.
      Hand-built pages keep theirs in `src/lib/pages.ts` (`pages.test.ts` enforces the budget);
      posts and docs enforce it in their schemas and CMS fields.
- [ ] **Canonical** — emitted by `<Seo>` from `absoluteUrl()`: no trailing slash, no query, no hash.
      Only a post republished from elsewhere overrides it (`canonical` frontmatter).
- [ ] **OG image** — 1200×630, generated at build by `src/pages/og/[...slug].png.ts` for every page,
      post, tag and docs page. The home page uses `public/og-image.png` (the brand lockup).
- [ ] **Structured data** — the JSON-LD for the page kind (table below), built only through
      `src/lib/seo/jsonld.ts`, never hand-written JSON.
- [ ] **Headings** — exactly one `h1`; levels never skip (`h1` → `h2` → `h3`). Card titles in a
      grid are `h3` under a section `h2`, or `h2` when the page has no section heading.
- [ ] **Images** — meaningful alt text; decorative SVG is `aria-hidden`.
- [ ] **Internal links** — reachable from navigation, the footer, or a related page; links use the
      canonical form (`/blog`, never `/blog/` or `/blog.html`).
- [ ] **robots** — `index,follow` unless the page is a 404, a draft or `/admin`.

## Structured data by page kind

| Page kind            | JSON-LD                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| Home                 | `Organization`, `WebSite`, `SoftwareApplication`                           |
| Blog index, tag page | `BreadcrumbList`                                                           |
| Blog post            | `BlogPosting` + `BreadcrumbList`                                           |
| Docs page            | `BreadcrumbList` (from `DocsHead`)                                         |
| Security             | `BreadcrumbList` + `FAQPage` (only because the page shows those questions) |
| Contact, legal       | `BreadcrumbList`                                                           |

Never add `offers`, `aggregateRating` or `review` without real data behind them.

## Crawl files

- `sitemap-index.xml` — `@astrojs/sitemap`. Its filter in `astro.config.mjs` excludes `/admin`, `/404`
  and the `/docs` redirect. Drafts are never built, so they never appear.
- `robots.txt` — `public/robots.txt`; disallows `/admin` and points at the sitemap. `/admin` also sends
  `X-Robots-Tag: noindex, nofollow` and a `noindex` meta, because a disallow alone doesn't deindex.
- `llms.txt` — generated from the collections by `src/pages/llms.txt.ts`; new pages worth an
  assistant's attention get a line there.
- `blog/rss.xml` — `@astrojs/rss`, published posts only.

## Drafts

`draft: true` means: not built in production, not in the sitemap, RSS, llms.txt, tag pages or OG
images. `getPublishedPosts()` is the only gate — never read the blog collection around it.

## When a URL changes

A slug is a promise. Renaming a post file, a docs file or a page:

1. Add a 301 to `firebase.json` `redirects` from the old path to the new one.
2. Update every internal link (`grep -r "/old-path" src`).
3. Leave the redirect in place permanently.

## Performance budgets

Lighthouse CI (`lighthouserc.json`) fails the build below: performance 0.95, accessibility 0.95,
best practices 0.95, SEO 1.0 — mobile emulation, median of three runs. Core Web Vitals targets:
LCP < 2.5 s, CLS < 0.1, INP < 200 ms.

What keeps them green: no client JS, fonts self-hosted with the Latin Geist file preloaded, the LCP
image eager + `fetchpriority="high"`, explicit image dimensions, **no entrance animation that starts
at `opacity: 0` on above-the-fold content** (it delays LCP and blanks crawler screenshots).

## Verifying

- `npm run build` then inspect `dist/sitemap-0.xml`, `dist/blog/rss.xml`, `dist/llms.txt`, and a page's
  `<head>` (`grep -o '<meta[^>]*og:[^>]*>' dist/blog/<slug>.html`).
- `npm run lhci` locally (Chrome required) or read the CI artifact `lighthouse-reports`.
- After deploy: Google Rich Results Test on the home page, a post and `/security`; the Schema.org
  validator for everything else; LinkedIn Post Inspector for OG cards.
- Search Console: property `uncava.com` (domain, DNS-verified); submit `sitemap-index.xml`; watch
  Pages → "Not indexed" after any URL change.
