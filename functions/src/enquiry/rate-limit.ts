import { createHash } from 'node:crypto';

/**
 * A per-instance limit on submissions from one address. Instances are few (maxInstances) and
 * short-lived, so this is a brake on a burst from one sender, not a global guarantee. Addresses
 * are kept only as a hash, and only for the window.
 */
export class SubmissionLimiter {
  private readonly hits = new Map<string, number[]>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /** Records an attempt and says whether it is within the limit. */
  allow(address: string, now: number): boolean {
    const key = createHash('sha256').update(address).digest('hex');
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) this.prune(now);
    return true;
  }

  private prune(now: number): void {
    for (const [key, times] of this.hits) {
      if (times.every((t) => now - t >= this.windowMs)) this.hits.delete(key);
    }
  }
}
