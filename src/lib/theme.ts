/**
 * The reading pages (blog, docs, legal) open dark, like the home page, and a reader can switch them
 * to light. The choice is kept in this localStorage key, shared by the site and the docs, and read
 * before first paint by public/theme-init.js, which repeats the key because it cannot import.
 */
export const THEME_STORAGE_KEY = 'uncava-theme';

export type ColourScheme = 'dark' | 'light';

export const DEFAULT_SCHEME: ColourScheme = 'dark';

/** Anything but an explicit "light" is the default, so a missing or corrupted value reads as dark. */
export function parseScheme(value: unknown): ColourScheme {
  return value === 'light' ? 'light' : DEFAULT_SCHEME;
}

export function oppositeScheme(scheme: ColourScheme): ColourScheme {
  return scheme === 'dark' ? 'light' : 'dark';
}
