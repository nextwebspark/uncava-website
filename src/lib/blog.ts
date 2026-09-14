export interface DatedEntry {
  readonly id: string;
  readonly data: {
    readonly pubDate: Date;
    readonly draft: boolean;
    readonly tags: readonly string[];
  };
}

export function selectPublished<T extends DatedEntry>(
  entries: readonly T[],
  includeDrafts: boolean,
): T[] {
  return entries
    .filter((entry) => includeDrafts || !entry.data.draft)
    .toSorted((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Posts sharing the most tags come first; ties go to the more recent post. */
export function relatedPosts<T extends DatedEntry>(
  current: T,
  candidates: readonly T[],
  limit = 3,
): T[] {
  const shared = (entry: T) =>
    entry.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
  return candidates
    .filter((entry) => entry.id !== current.id)
    .toSorted(
      (a, b) => shared(b) - shared(a) || b.data.pubDate.getTime() - a.data.pubDate.getTime(),
    )
    .slice(0, limit);
}
