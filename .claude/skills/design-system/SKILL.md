---
name: design-system
description: Visual rules for uncava.com — design/*.dc.html artboards are the source of truth, the Tailwind @theme tokens, brand mark and wordmark usage, typography scale, responsive rules, motion, accessible contrast, and "don't build ahead of the design". Load before any visual change, new section or component, token change, brand mark use, animation, or colour/contrast decision.
---

# Design system

## Source of truth

`design/*.dc.html` artboards define every screen: `Main` (home, 1440), `HomeMobile` (home, 390),
`Blog`, `BlogPost`, `Docs`, `Contact`. Read the artboard before building or changing a page, and lift
its values rather than eyeballing. When the artboard and this skill disagree, the artboard wins —
then update this skill.

Artboards have a desktop and (for home) a mobile frame. Between them, interpolate: stack columns,
hide what the mobile frame hides, keep what it keeps. **Don't build ahead of the design**: no new
section, page or variant without an artboard or an explicit request. `/security`, `/privacy`,
`/terms` and `/404` have no artboard and reuse the home/blog vocabulary.

## Tokens (`src/styles/theme.css`)

| Role            | Token                                            | Value                                          |
| --------------- | ------------------------------------------------ | ---------------------------------------------- |
| Dark grounds    | `ink`, `ink-2`, `ink-3`, `ink-line`              | `#0c0d0e` `#16171a` `#1d1f23` `#2a2a2e`        |
| Light grounds   | `paper`, `panel`, `panel-2`, `line`, `line-soft` | `#f8f9fb` `#fff` `#f3f4f6` `#e2e4e9` `#edeef2` |
| Text on light   | `text`, `text-2`, `text-3`, `prose`              | `#111113` `#475569` `#64748b` `#2b3441`        |
| Text on dark    | `d-text`, `d-text-2`, `d-text-3`                 | `#f8fafc` `#cbd5e1` `#94a3b8`                  |
| Accent          | `amber`, `amber-deep`, `amber-dim`, `on-amber`   | `#e2b65c` `#8a6424` 14% amber `#1a1712`        |
| Links / success | `sky`, `green`, `green-text`                     | `#2563eb` `#059669` `#047857`                  |

Never hard-code a hex in a component when a token exists; add a token instead.

## Brand

- The mark is `BrandMark.astro`: rhombus over hexagon on a rounded tile. `tone="dark"` (tile
  `#16181c`, glyph `#f4f5f7`) on light grounds, `tone="light"` inverted on dark grounds, `tone="glyph"`
  untiled in `currentColor` for watermarks. Never redraw, recolour, stretch or add effects.
- The wordmark is **uppercase, weight 500, letter-spacing 0.3em** (`wordmark` utility), set beside
  the mark by `BrandLockup`. Never title-case, never bold.
- The product is "Uncava" in running text; "UNCAVA" only as the wordmark.

## Typography

Geist for everything, Geist Mono for eyebrows, meta lines, table headers and numbers-as-labels.
Headings weight 600 with negative tracking.

| Use                       | Desktop                               | Mobile  |
| ------------------------- | ------------------------------------- | ------- |
| Hero `h1`                 | 76/1.0, `tracking-display` (−0.045em) | 44/1.02 |
| Page `h1` (blog, contact) | 60–64                                 | 40      |
| Section `h2`              | 52/1.04, `tracking-heading` (−0.04em) | 30–34   |
| Card `h3`                 | 20–22/1.25, −0.02em                   | 18–19   |
| Body                      | 18/1.6 intro, 14.5–15/1.6 cards       | 15–17   |
| Eyebrow                   | mono 12, 500, +0.08em, uppercase      | 11–12   |

## Components and patterns

- **Primary CTA "Book a demo" is always amber** (`ButtonLink` default) — dark nav, light nav, closing
  CTA, blog aside. Secondary is an outline. The docs header button is "Sign in".
- Cards: `panel` with a `line` border, 16–18px radius; dark feature cards use `ink`.
- Stage badges: Shortlisted = `amber-dim` + `amber-deep`; In universe = `panel-2` + `text-2`.
- Touch targets ≥ 44px on mobile (nav items, chips, stage tabs, footer links). Tab rows scroll
  horizontally instead of clipping.
- A wide table lives inside its own `overflow-x-auto` container; the page itself never scrolls
  sideways (check at 360px).

## Motion

- No entrance animations on above-the-fold content, and never start content at `opacity: 0`.
- Hover transitions only (colour, border, a 2% image scale), all disabled under
  `prefers-reduced-motion` (global rule in `global.css` plus `motion-reduce:` where needed).

## Contrast

WCAG AA is the floor: 4.5:1 for text under 24px (18.66px bold), 3:1 above. Known pairs:
`text-3` on `paper` 4.52 (the minimum — never put `text-3` on `panel-2`, it is 4.32; use `text-2`),
`amber-deep` on `paper` 5.07, `green-text` on `panel-2` 4.98, `d-text-3` on `ink` 7.6.
Small labels inside product mock-ups follow the same rules; `aria-hidden` does not exempt them from
Lighthouse. Check a new pair before using it.
