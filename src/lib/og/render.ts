import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCard {
  readonly title: string;
  readonly description: string;
  readonly section: string;
}

const require = createRequire(import.meta.url);

let fonts:
  Promise<{ regular: Buffer; medium: Buffer; semibold: Buffer; wordmark: Buffer }> | undefined;

function loadFonts() {
  // Satori reads TTF/OTF/WOFF but not WOFF2, so the static @fontsource files are used here.
  const file = (path: string) => readFile(require.resolve(`@fontsource/${path}`));
  fonts ??= Promise.all([
    file('geist/files/geist-latin-400-normal.woff'),
    file('geist/files/geist-latin-500-normal.woff'),
    file('geist/files/geist-latin-600-normal.woff'),
    file('montserrat/files/montserrat-latin-200-normal.woff'),
  ]).then(([regular, medium, semibold, wordmark]) => ({ regular, medium, semibold, wordmark }));
  return fonts;
}

const markDataUri = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-36 -51 72 104" fill="none" stroke="#f4f6f8"><path d="M-32 10 L 0 -8 L 32 10 L 0 28 Z M-32 10 V 32 L 0 50 L 32 32 V 10 M0 28 V 50" stroke-width="3.4" stroke-linejoin="round"/><path d="M0 -48 L 32 -30 L 0 -12 L -32 -30 Z" fill="#f4f6f8" stroke="none"/></svg>',
).toString('base64')}`;

export function titleFontSize(title: string): number {
  if (title.length > 64) return 54;
  if (title.length > 40) return 64;
  return 76;
}

type Node = { type: string; props: Record<string, unknown> };

const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  extra: Record<string, unknown> = {},
): Node => ({
  type,
  props: { style, children, ...extra },
});

/** Renders a page's share card in the look of brand/og-image.png. */
export async function renderOgImage(card: OgCard): Promise<Buffer> {
  const { regular, medium, semibold, wordmark } = await loadFonts();

  const tree = el(
    'div',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '80px 84px 76px',
      backgroundColor: '#08090b',
      backgroundImage:
        'radial-gradient(circle at 100% 0%, rgba(110,121,242,0.16), rgba(8,9,11,0) 55%)',
      fontFamily: 'Geist',
      color: '#f4f6f8',
    },
    [
      el('div', { display: 'flex', alignItems: 'center', gap: 24 }, [
        el('img', { width: 52, height: 75 }, undefined, {
          src: markDataUri,
          width: 52,
          height: 75,
        }),
        el(
          'div',
          {
            fontFamily: 'Montserrat',
            fontSize: 30,
            fontWeight: 200,
            letterSpacing: '0.38em',
            color: '#f4f6f8',
          },
          'UNCAVA',
        ),
      ]),
      el('div', { display: 'flex', flexDirection: 'column', gap: 24 }, [
        el(
          'div',
          {
            fontSize: titleFontSize(card.title),
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            maxWidth: 1000,
          },
          card.title,
        ),
        el(
          'div',
          { fontSize: 27, fontWeight: 400, lineHeight: 1.45, color: '#a6adbb', maxWidth: 960 },
          card.description,
        ),
      ]),
      el('div', { display: 'flex', alignItems: 'center', gap: 22 }, [
        el(
          'div',
          { fontSize: 19, fontWeight: 500, letterSpacing: '0.16em', color: '#6e79f2' },
          `UNCAVA.COM · ${card.section.toUpperCase()}`,
        ),
        el('div', { flexGrow: 1, height: 1, backgroundColor: '#2b2b2d' }),
      ]),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [
      { name: 'Geist', data: regular, weight: 400, style: 'normal' },
      { name: 'Geist', data: medium, weight: 500, style: 'normal' },
      { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
      { name: 'Montserrat', data: wordmark, weight: 200, style: 'normal' },
    ],
  });

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
