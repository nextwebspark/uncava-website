# Uncava website

The public site for **Uncava** — executive search and talent mapping — at `https://uncava.com`: marketing
pages, the blog, and the docs. The product itself is a separate codebase at `https://app.uncava.com`;
nothing here talks to it except links. Static Astro build, served by Firebase Hosting, edited by
non-technical people through Sveltia CMS at `/admin`.

## Commands

```bash
npm run dev          # local dev server (http://localhost:4321)
npm run build        # static build into dist/
npm run preview      # serve dist/ locally
npm run verify       # everything CI runs except Lighthouse: lint, format, check, test, build, CSP audit
npm run check        # astro check + tsc
npm test             # vitest
npm run check:csp    # post-build: every page in dist runs under the CSP firebase.json serves it with
npm run lhci         # Lighthouse CI against dist (needs Chrome)
```

## Layout

| Path                                       | What                                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `design/*.dc.html`                         | **Source of truth for all UI.** Read the artboard before building or changing a page.             |
| `brand/`                                   | Mark, favicon, OG image, extension icons. Copied into `public/`, never edited in place.           |
| `src/pages/`                               | Routes. Marketing pages, `blog/`, `og/[...slug].png.ts`, `llms.txt.ts`, `blog/rss.xml.ts`.        |
| `src/components/{site,home,blog,docs,seo}` | Small typed Astro components, grouped by where they are used.                                     |
| `src/layouts/`                             | `BaseLayout` (every non-docs page) and `LegalLayout`.                                             |
| `src/content/`                             | `blog/*.md`, `authors/*.json`, `docs/docs/**/*.md` (Starlight, served under `/docs`).             |
| `src/lib/`                                 | Pure TypeScript: site constants, page metadata, content schemas, SEO builders, OG renderer.       |
| `src/styles/`                              | `theme.css` (tokens, shared), `global.css` (site), `docs.css` (Starlight).                        |
| `public/admin/`                            | Sveltia CMS: `index.html` + `config.yml`.                                                         |
| `scripts/`                                 | Build-time tooling (`check-csp.ts`), `gcp-bootstrap.sh` (the GCP deploy identity, re-runnable).   |
| `tests/`                                   | Config tests: `firebase.json` headers, CMS ↔ schema lockstep. Unit tests sit beside their module. |

## Invariants

- **Zero client JavaScript by default.** A `<script>` needs a reason a reviewer would accept; never inline.
- **One trailing-slash policy:** Astro `trailingSlash: 'never'` + `build.format: 'file'`, Firebase
  `cleanUrls: true` + `trailingSlash: false`. Every absolute URL goes through `absoluteUrl()`.
- **Every page has one `h1`, a unique title and a 50–160 character description, a canonical, and an OG
  image.** `src/lib/pages.ts` holds hand-built pages' metadata; `pages.test.ts` enforces the budgets.
- **The CMS config and the zod schemas change together.** `tests/cms-config.test.ts` fails otherwise.
- **The CSP is self-only.** Only `/docs/**` (Starlight hashes, Pagefind wasm) and `/admin/**` (Sveltia)
  are loosened, and only in `firebase.json`, in rules ordered after `**`.
- **No invented facts.** Product claims come from what the app does; unknowns are visible bracketed
  placeholders like `[hello@uncava.com]`. Never write legal text, prices, metrics or testimonials.
- **Don't build ahead of the design.** No page, section or component without an artboard or a request.
- **No secrets in the repo.** Deploys authenticate with Workload Identity Federation.
- **Merging to `main` deploys nothing.** Production changes only through the Release workflow, which
  tags `vX.Y.Z` and deploys that tag; Deploy on an older tag is the rollback.

## Conventions

- Names carry intent; a type or component name must read standalone.
- Comments are the exception — only where the _why_ is invisible (a trap, a security boundary, a
  non-obvious ordering). No narrative comments, no restating the code.
- Small typed components with an explicit `Props` interface. No `any`; `strictest` TypeScript.
- Tailwind utilities from the `@theme` tokens; arbitrary values only for one-off design measurements.
- Tests describe behaviour, not implementation.

## Load the matching skill before touching its area

| Skill              | Load before                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `astro-site`       | any page, component, layout, content collection, image, or Astro/Tailwind config work     |
| `design-system`    | any visual change, new section, token, brand mark use, motion or contrast question        |
| `seo`              | adding or changing a page, a slug, metadata, structured data, sitemap/robots/llms.txt/RSS |
| `content-cms`      | `public/admin/`, content schemas, a new content field or collection, editor workflow      |
| `security-hosting` | `firebase.json`, CSP/headers, workflows, deploys, DNS, dependencies, CODEOWNERS           |
| `verify`           | before calling any change done                                                            |
