export const BLOG_TAGS = [
  { slug: 'market-mapping', label: 'Market mapping' },
  { slug: 'research-craft', label: 'Research craft' },
  { slug: 'client-delivery', label: 'Client delivery' },
  { slug: 'product', label: 'Product' },
] as const;

export type BlogTagSlug = (typeof BLOG_TAGS)[number]['slug'];

export const BLOG_TAG_SLUGS = BLOG_TAGS.map((tag) => tag.slug) as [BlogTagSlug, ...BlogTagSlug[]];

export function blogTagLabel(slug: BlogTagSlug): string {
  const tag = BLOG_TAGS.find((candidate) => candidate.slug === slug);
  if (!tag) throw new Error(`Unknown blog tag "${slug}".`);
  return tag.label;
}
