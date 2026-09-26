import { describe, expect, it } from 'vitest';
import { readingMinutes } from './reading-time';

describe('readingMinutes', () => {
  it('never reports less than a minute', () => {
    expect(readingMinutes('A short note.')).toBe(1);
  });

  it('rounds to the nearest minute at an unhurried reading pace', () => {
    expect(readingMinutes('word '.repeat(1150))).toBe(5);
  });

  it('does not count frontmatter or code blocks as prose', () => {
    const frontmatter = `---\ntitle: ${'x '.repeat(1000)}\n---\n`;
    const code = `\`\`\`\n${'const x = 1; '.repeat(1000)}\n\`\`\`\n`;

    expect(readingMinutes(`${frontmatter}${code}Just this sentence.`)).toBe(1);
  });
});
