---
name: content-cms
description: Sveltia CMS at /admin for uncava.com — how its config.yml mirrors the zod content schemas (and the test that enforces it), the editorial workflow, media rules, how a non-technical editor publishes, how to add a content field end to end, and how to upgrade the pinned CMS script. Load before touching public/admin/, src/lib/content-schemas.ts, src/content.config.ts, or adding a content field or collection.
---

# Content and the CMS

## The shape

- Editors use **Sveltia CMS** at `https://uncava.com/admin`. It is a static page
  (`public/admin/index.html`) that loads a pinned Sveltia build and reads `public/admin/config.yml`.
- The CMS writes to GitHub (`nextwebspark/uncava-website`, branch `main`) as the signed-in editor.
  GitHub OAuth is completed by a **Sveltia CMS Authenticator** Cloudflare Worker whose URL is
  `backend.base_url` (placeholder until deployed; see README).
- `publish_mode: editorial_workflow`: saving creates a branch and pull request; **Publish** merges it.
  Merging to `main` deploys. CI and CODEOWNERS apply to editor PRs exactly as to code PRs.

## Schema and CMS config move in lockstep

The zod schemas in `src/lib/content-schemas.ts` are the contract. `public/admin/config.yml` is the
editing surface for the same contract. `tests/cms-config.test.ts` fails when:

- a schema key has no CMS field, or a CMS field has no schema key;
- a field is optional in one and required in the other;
- the blog tag options differ from `BLOG_TAGS` in `src/lib/blog-tags.ts`;
- a docs sidebar group in `astro.config.mjs` has no CMS collection.

Budgets are duplicated deliberately so editors see them before CI does: the CMS `pattern` on
`description` (50–160) mirrors the schema's `DESCRIPTION_MIN`/`DESCRIPTION_MAX`.

## Adding a field end to end

1. Add it to the schema in `src/lib/content-schemas.ts` (`.optional()` unless every existing entry
   will have it).
2. Add the CMS field in `config.yml` with the same `name`, a plain-language `label` and `hint`, and
   `required: false` if optional.
3. Render it where it belongs; run `npm run check` (the entry type updates after `astro sync`).
4. Add it to existing content files if required.
5. `npm test` — the lockstep test must pass.

A new blog **tag**: add it to `BLOG_TAGS` and to the `tags` options. A tag page appears only once a
published post uses it.

A new **docs group**: add the sidebar group in `astro.config.mjs`, create
`src/content/docs/docs/<group>/`, and add a `docs-<group>` collection (reusing `*docs_fields`).

## Media rules

- Blog covers upload to `src/assets/blog/`; author photos to `src/assets/authors/`. They go through
  `astro:assets`, so Astro resizes and converts them — editors upload one good original.
- Collection-level `media_folder`/`public_folder` are relative (`../../assets/blog`) so the path written
  into frontmatter resolves from the post file, which is what Astro's `image()` requires. An absolute
  `/src/...` value would build-fail.
- Cover: JPG, PNG or WebP, ≥ 1600×900, < 500 KB, subject centred (it is cropped to several ratios).
- Every image needs alt text (`coverAlt` is required). Describe what is shown, not "image of".
- Never upload photos of real candidates or client staff.

## How an editor publishes (for the README / onboarding)

1. Go to `uncava.com/admin`, **Sign in with GitHub** (needs write access to the repository).
2. **Blog posts → New**. Fill every field; **Save** creates a draft in review.
3. Share the preview link from the pull request (a Firebase preview channel is posted there).
4. When ready, set the status to **Ready** and **Publish**. The site redeploys in a few minutes.

## Traps

- **Draft entries in the editorial workflow live on branches and may be incomplete.** A preview build
  of a half-written post fails schema validation. That is correct behaviour; the editor fills the
  required fields.
- `draft: true` in frontmatter is separate from the CMS workflow status: a merged post with
  `draft: true` is still hidden from the production build.
- The `author` relation stores the author file's slug; renaming an author file breaks every post
  that references it.
- The Sveltia script is pinned by version **and** Subresource Integrity hash, so Dependabot will not
  bump it. To upgrade: pick the version, then
  `curl -sL https://unpkg.com/@sveltia/cms@<v>/dist/sveltia-cms.js | openssl dgst -sha384 -binary | base64`,
  update `src` and `integrity` together, and test sign-in on a preview channel. If Sveltia adds new
  origins, update the `/admin{,/**}` CSP in `firebase.json` (load `security-hosting`).
