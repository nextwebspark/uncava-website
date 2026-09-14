import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { OG_HEIGHT, OG_WIDTH, renderOgImage, titleFontSize } from './render';

describe('renderOgImage', () => {
  it('renders a PNG at the 1200×630 size every platform expects', async () => {
    const png = await renderOgImage({
      title: 'Import a spreadsheet',
      description: 'Bring a CSV or Excel file of people and companies into a mandate.',
      section: 'Docs',
    });

    const { format, width, height } = await sharp(png).metadata();
    expect({ format, width, height }).toEqual({
      format: 'png',
      width: OG_WIDTH,
      height: OG_HEIGHT,
    });
  });
});

describe('titleFontSize', () => {
  it('steps the title down as it grows so long titles still fit', () => {
    const short = titleFontSize('Security');
    const medium = titleFontSize('See Uncava on one of your own mandates today');
    const long = titleFontSize(
      'How to map an executive market before the kickoff call, step by step',
    );

    expect(short).toBeGreaterThan(medium);
    expect(medium).toBeGreaterThan(long);
  });
});
