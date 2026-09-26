---
name: astro-site
description: How the uncava.com Astro site is built — stack, directory layout, component and layout conventions, content collections, the zero-JS islands policy, images, Tailwind v4 tokens, the trailing-slash policy, Starlight under /docs, and how to add a page. Load before creating or changing any page, component, layout, content collection, image, or astro.config / Tailwind setup.
---

# Astro site

## Stack

Astro (static output, `strictest` TypeScript), Starlight mounted at `/docs`, Tailwind CSS v4 through
`@tailwindcss/vite`, self-hosted Geist / Geist Mono (`@fontsource-variable/*`), Vitest, ESLint flat
config, Prettier. Exact versions are pinned in `package.json`; Node comes from `.nvmrc`.

## Where things go

- `src/pages/` — routes only. A page file composes components and passes metadata; it holds no
  styling beyond layout utilities.
- `src/components/site/` — used on every page (header, footer, `BrandMark`, `BrandLockup`,
  `ButtonLink`, `Icon`). `home/`, `blog/`, `docs/` — used by one area. `seo/` — head output.
- `src/layouts/BaseLayout.astro` — every non-docs page. It owns `<html>`, fonts, favicons, `<Seo>`,
  header, `<main id="main">` and footer. Props: SEO props + `header` (`light` | `dark-overlay`) +
  `footer` (`full` | `compact`). Only the home page uses `dark-overlay` + `full`, per the artboards.
- `src/lib/` — pure, framework-free TypeScript with tests beside it. Anything testable goes here, not
  in a component.

## Components

- One component, one job, an explicit `interface Props`. Destructure with defaults.
- Pass `class` through `class:list` for placement; never let a caller restyle internals.
- Decorative product mock-ups (`home/*Card`, `illustrations/*`) are `aria-hidden="true"`. Their text
  still must pass contrast — Lighthouse checks it regardless.
- Data that a component loops over lives at the top of its frontmatter as a typed array.

## Islands policy: zero JS by default

Every page ships no JavaScript unless a feature is impossible without it. The mobile nav is a
`<details>` element, not a script. The only script today is `CopyLinkButton` (hidden until the
Clipboard API exists — progressive enhancement). Before adding one: can CSS, `<details>`, a link or a
form do it? If not, use a processed `<script>` (bundled to `/_astro/*.js`).

**Trap:** Astro inlines small processed scripts under Vite's `assetsInlineLimit`; an inline script
violates the CSP. `astro.config.mjs` sets `vite.build.assetsInlineLimit: 0` and
`build.inlineStylesheets: 'never'` for this reason. Never use `is:inline` except for JSON-LD.

## Content collections

Defined in `src/content.config.ts`; schemas live in `src/lib/content-schemas.ts` so they can be tested
without Astro's virtual modules (`image` and the author `reference` are injected).

- `blog` — `src/content/blog/<slug>.md`. The file name is the URL slug.
- `authors` — `src/content/authors/<id>.json`, referenced from a post's `author`.
- `docs` — Starlight's collection. Files live in `src/content/docs/docs/<group>/<page>.md` so they
  route under `/docs`. There is no base-path option; the extra `docs/` folder is the mechanism.

Posts are read through `src/lib/content.ts` (`getPublishedPosts`, `getAuthor`, `minutesToRead`), which
drops drafts in production builds. Never call `getCollection('blog')` directly in a page.

Changing a schema means changing `public/admin/config.yml` in the same commit — load `content-cms`.

## Images

- Content images go in `src/assets/` and render through `astro:assets` `<Image>` with explicit
  `widths` and `sizes`. `public/` is only for files that need a fixed URL (favicons, `og-image.png`).
- The LCP image (post cover, featured post) gets `loading="eager"` and `fetchpriority="high"`;
  everything else stays lazy.
- Every content image has meaningful alt text; purely decorative images get `alt=""`.

## Tailwind v4 tokens

Tokens live once in `src/styles/theme.css` inside `@theme` and are imported by both `global.css` (site)
and `docs.css` (Starlight). Use `bg-ink`, `text-text-2`, `text-accent-deep`, `tracking-display`,
`eyebrow`, `wordmark`, `container-page`. Tailwind scans the whole repo, so `design/` and `brand/` are
excluded with `@source not` — keep that when adding CSS entry points.

## Trailing-slash policy

`trailingSlash: 'never'` + `build.format: 'file'` (so `/security` builds `security.html`), matched by
`firebase.json` `cleanUrls: true` + `trailingSlash: false`. `tests/firebase-config.test.ts` asserts
both sides agree. Internal links are written without a trailing slash: `/blog`, not `/blog/`.

## Starlight

- Overrides in `src/components/docs/` (`DocsHead`, `DocsHeader`, `DocsSiteTitle`), registered in
  `astro.config.mjs`. Import Starlight parts from `@astrojs/starlight/components/*.astro`, not from
  `virtual:starlight/*` — the virtual modules don't typecheck in user code.
- Sidebar groups use `{ label, items: [{ autogenerate: { directory } }] }`; the old
  `{ label, autogenerate }` form was removed in Starlight 0.39.
- Starlight's own 404 is disabled; `src/pages/404.astro` serves every route.
- Ordered lists in docs render as numbered steps (`docs.css`); asides `:::note` and `:::caution` are
  the design's accent and signal callouts.

## Adding a page

1. Read its artboard in `design/`. No artboard → ask, or reuse the home page vocabulary and say so.
2. Add its metadata to `src/lib/pages.ts` (the OG image route picks it up automatically).
3. Create `src/pages/<name>.astro` with `BaseLayout`, spreading the metadata and passing `jsonLd`.
4. Add it to navigation in `src/lib/site.ts` if the design shows it there.
5. Run the `seo` checklist, then `npm run verify`.
