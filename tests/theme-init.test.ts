import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '../src/lib/theme';

const source = readFileSync(new URL('../public/theme-init.js', import.meta.url), 'utf8');

function schemeAfterInit(stored: string | null | Error): string | undefined {
  const dataset: Record<string, string> = {};
  const localStorage = {
    getItem(key: string): string | null {
      if (stored instanceof Error) throw stored;
      return key === THEME_STORAGE_KEY ? stored : null;
    },
  };
  runInNewContext(source, { window: { localStorage }, document: { documentElement: { dataset } } });
  return dataset['theme'];
}

describe('public/theme-init.js', () => {
  it('opens dark by default', () => {
    expect(schemeAfterInit(null)).toBe('dark');
  });

  it('applies a stored light choice from the shared key', () => {
    expect(schemeAfterInit('light')).toBe('light');
  });

  it('stays dark when storage is blocked', () => {
    expect(schemeAfterInit(new Error('SecurityError'))).toBe('dark');
  });
});
