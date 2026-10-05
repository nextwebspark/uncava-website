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
section, page or variant without an artboard or an explicit request. `/security`, `/legal` and the
legal documents (`LegalLayout`) and `/404` have no artboard and reuse the home/blog vocabulary.

## Tokens (`src/styles/theme.css`)

The palette is **UNCAVA**, the app's own (`claude-design/uncava-tokens.css` and
`apps/web/src/styles/tokens.css` in the app repo). A palette change starts there and is copied here,
into `theme.css` and every artboard's `:root` at once.

| Role            | Token                                                | Value                                             |
| --------------- | ---------------------------------------------------- | ------------------------------------------------- |
| Dark grounds    | `ink`, `ink-2`, `ink-3`, `ink-line`                  | `#08090b` `#0e1013` `#15181d` 7% white            |
| Light grounds   | `paper`, `panel`, `panel-2`, `line`, `line-soft`     | `#f7f8fa` `#fff` `#eceff3` 9% / 6% `#030712`      |
| Text on light   | `text`, `text-2`, `text-3`, `prose`                  | `#0b0d12` `#4c5462` `#687080` `#2b3441`           |
| Text on dark    | `d-text`, `d-text-2`, `d-text-3`                     | `#f4f6f8` `#a6adbb` `#7c8493`                     |
| Accent on light | `accent`, `accent-hover`, `accent-deep`, `on-accent` | `#4a56d6` `#3a46c4` `#4a56d6` `#fff`              |
| Accent tints    | `accent-dim`, `accent-tint`, `accent-ink`            | 9% accent, `#e4e8f6`, `#2e3878`                   |
| Accent on dark  | `d-accent`, `d-accent-dim`                           | `#6e79f2`, 14% of it                              |
| Warning         | `signal`, `signal-dim`, `signal-ink`                 | `#a8602f`, 10% of it, `#7a4119`                   |
| Success / error | `green`, `green-text`, `red`                         | `#0f9d6b` `#0a7550` `#d93a45`                     |
| AI output       | `inferred`, `inferred-text`, `inferred-dim`          | `#8244d6` `#7438c4`, 10% of `inferred`            |
| AI on dark      | `d-inferred`, `d-inferred-dim`                       | `#b07cf5`, 12% of it                              |
| Report ramp     | `seq-1` … `seq-5`                                    | `#e4e8f6` `#b9c0ee` `#8189f7` `#4a56d6` `#2e3878` |

`accent` is the one fill that takes white text (CTA buttons, the last docs step). Text, icons, dots
and strokes on a dark ground use `d-accent`; `accent` there is only a fill. Links are `accent` too:
the app folded its old sky blue into the accent, and so does this site. `text-3` and `green-text` are
darkened from the app's values to clear AA on `paper` and `panel-2`.

The artboards keep `--link` / `--link-dim` for the old sky roles; they hold accent values.

Purple means AI, exactly as in the app: `inferred` marks AI output (a suggested company, a field read
from a document, an assessment) and is never used for anything else. Small purple text on light
grounds is `inferred-text`; on dark grounds `d-inferred`. The `seq-*` ramp is the app's report
heatmap scale; figures on `seq-1`–`seq-3` are `text`, on `seq-4`/`seq-5` white.

Never hard-code a hex in a component when a token exists; add a token instead.

## Brand

- The mark is the app's: an isometric cube with a filled top face, drawn bare (no tile) in
  `currentColor` by `BrandMark.astro` (`size` is the height; width is 72/104 of it; the stroke
  thickens below 28px like the app's bold icons). `OpeningMark.astro` is the same drawing with
  the lid animated, for the home footer only. Source: `brand/mark.svg`, from the app's
  `apps/web/public/brand/uncava-app-icon-*.svg`. Never redraw, recolour, stretch or add effects.
- The wordmark is **Montserrat 200, uppercase, letter-spacing 0.38em** with a −0.38em right margin
  (`wordmark` utility), set beside the mark by `BrandLockup`. Montserrat is self-hosted at weight
  200 only and used for nothing else. Never title-case, never bold.
- Favicons, the touch icon and `icon-*.png` come from the app unchanged; `favicon.svg` (ink) and
  `favicon-dark.svg` (light, `media="(prefers-color-scheme: dark)"`) avoid an inline `<style>`,
  which the CSP would block. `tests/brand-assets.test.ts` keeps `public/` copies identical.
- The product is "Uncava" in running text; "UNCAVA" only as the wordmark.

## Sample data

Uncava's market is the Gulf, above all the UAE and Saudi Arabia. Every mock-up uses one fictional
Gulf energy set, the same on the site and in the artboards: Sarab Energy (Abu Dhabi), Najd
Utilities (Riyadh), Khaleej Grid Co. (Dammam), Rimal Power (Dubai), Hijaz Power Holding (Jeddah),
Midar Water & Power (Sharjah); the client is Al Naseem Group; the mandate is Group CFO – Energy.
Never use a real company or person, and never a data vendor's name.

## Typography

Geist for everything except the wordmark (Montserrat 200), Geist Mono for eyebrows, meta lines,
table headers and numbers-as-labels.
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

- **Primary CTA "Book a demo" is always the solid accent** (`ButtonLink` default) — dark nav, light nav, closing
  CTA, blog aside. Secondary is an outline. The docs header button is "Sign in".
- Cards: `panel` with a `line` border, 16–18px radius; dark feature cards use `ink`.
- Stage badges: Shortlisted = `accent-dim` + `accent-deep`; In universe = `panel-2` + `text-2`.
- Touch targets ≥ 44px on mobile (nav items, chips, stage tabs, footer links). Tab rows scroll
  horizontally instead of clipping.
- A wide table lives inside its own `overflow-x-auto` container; the page itself never scrolls
  sideways (check at 360px).

## Home footer

Dark (`ink`), per the artboard: the link columns, then a brand row — `OpeningMark` at 220px beside
the wordmark as an outline (`color: transparent; -webkit-text-stroke` in `d-text-3`, Montserrat 200,
`.38em`, `clamp(96px, 11.5vw, 166px)`; 50px on mobile, stacked under a 120px mark) — then the legal
line with Privacy and Terms. Only the home page uses the full footer; the compact one stays light.

## Motion

- No entrance animations on above-the-fold content, and never start content at `opacity: 0`.
- Hover transitions only (colour, border, a 2% image scale), all disabled under
  `prefers-reduced-motion` (global rule in `global.css` plus `motion-reduce:` where needed).
- The one exception is the home footer's mark (`OpeningMark.astro`): its lid starts on the rim
  and lifts over the last 170px of the page scroll, once the closed box is on screen, a CSS
  scroll-driven animation (`animation-timeline: scroll()`, no JS). Browsers without it, and reduced motion, show the open
  mark; the end state is the mark unchanged. No other scroll-driven motion without an artboard.

## Contrast

WCAG AA is the floor: 4.5:1 for text under 24px (18.66px bold), 3:1 above. Known pairs:
`text-3` on `paper` 4.69 (never put `text-3` on `panel-2`, it is 4.32; use `text-2`), `accent` on
`paper` 5.50 and on `panel-2` 5.07, white on `accent` 5.84, `d-accent` on `ink` 5.39 and on `ink-3`
4.81, `green-text` on `panel-2` 4.96 and on 10% `green` 5.10, `signal-ink` on `signal-dim` 7.1,
`d-text-3` on `ink-3` 4.73, `inferred-text` on `panel-2` 5.86 and on `inferred-dim` 5.87,
`d-inferred` on `ink` 6.69 and on `d-inferred-dim` 5.50, `text` on `seq-3` 6.34. Never set
`inferred` itself as small text on `panel-2` tints, nor on `ink` (3.55).
Never set `accent` as text on a dark ground (3.41); use `d-accent`.
Small labels inside product mock-ups follow the same rules; `aria-hidden` does not exempt them from
Lighthouse. Check a new pair before using it.
