import { describe, expect, it } from 'vitest';
import { isPlaceholder } from './placeholder';

describe('isPlaceholder', () => {
  it('recognises a bracketed value the owner has not filled in yet', () => {
    expect(isPlaceholder('[hello@uncava.com]')).toBe(true);
  });

  it('treats a real value as real', () => {
    expect(isPlaceholder('hello@uncava.com')).toBe(false);
  });

  it('does not mistake a sentence that merely contains brackets for a placeholder', () => {
    expect(isPlaceholder('Write to [hello] or [sales]')).toBe(false);
  });
});
