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

let fonts: Promise<{ regular: Buffer; medium: Buffer; semibold: Buffer }> | undefined;

function loadFonts() {
  // Satori reads TTF/OTF/WOFF but not WOFF2, so the static @fontsource/geist files are used here.
  const file = (weight: number) =>
    readFile(require.resolve(`@fontsource/geist/files/geist-latin-${weight}-normal.woff`));
  fonts ??= Promise.all([file(400), file(500), file(600)]).then(([regular, medium, semibold]) => ({
    regular,
    medium,
    semibold,
  }));
  return fonts;
}

const markDataUri = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="86 86 340 340"><rect x="86" y="86" width="340" height="340" rx="74" fill="#f4f5f7"/><g fill="#16181c" stroke="#16181c" stroke-width="11" stroke-linejoin="round"><path d="M256 131 332 174 256 216 180 174Z"/><path fill="none" d="M256 241 332 285V336L256 380 180 336V285Z"/></g></svg>',
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
  const { regular, medium, semibold } = await loadFonts();

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
      el('div', { display: 'flex', alignItems: 'center', gap: 26 }, [
        el('img', { width: 74, height: 74 }, undefined, {
          src: markDataUri,
          width: 74,
          height: 74,
        }),
        el(
          'div',
          { fontSize: 26, fontWeight: 500, letterSpacing: '0.3em', color: '#f4f6f8' },
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
    ],
  });

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
