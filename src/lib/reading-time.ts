const WORDS_PER_MINUTE = 230;

export function readingMinutes(markdown: string): number {
  const prose = markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`[\]()-]/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
