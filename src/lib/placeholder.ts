/** Owner-supplied values not yet filled in are written as `[Like this]`; never link or mail to one. */
export function isPlaceholder(value: string): boolean {
  return /^\[[^\]]+\]$/.test(value.trim());
}
