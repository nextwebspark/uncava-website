import { z } from 'astro/zod';
import { BLOG_TAG_SLUGS } from './blog-tags';
import { DESCRIPTION_MAX, DESCRIPTION_MIN } from './seo/meta';

/**
 * The frontmatter contracts for the blog and authors collections. `image` and the author reference
 * are injected so these schemas can be exercised in Vitest without Astro's virtual modules, and so
 * public/admin/config.yml can be tested against the same field list.
 */
export function blogSchema<TImage extends z.ZodType, TAuthor extends z.ZodType>(deps: {
  image: () => TImage;
  author: TAuthor;
}) {
  return z.object({
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(DESCRIPTION_MIN).max(DESCRIPTION_MAX),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: deps.author,
    tags: z.array(z.enum(BLOG_TAG_SLUGS)).min(1),
    cover: deps.image(),
    coverAlt: z.string().trim().min(1).max(200),
    draft: z.boolean().default(false),
    canonical: z.url().optional(),
    inUncava: z
      .object({
        text: z.string().trim().min(1).max(240),
        href: z.string().startsWith('/'),
        label: z.string().trim().min(1).max(40),
      })
      .optional(),
  });
}

export function authorSchema<TImage extends z.ZodType>(deps: { image: () => TImage }) {
  return z.object({
    name: z.string().trim().min(1),
    role: z.string().trim().optional(),
    bio: z.string().trim().max(280).optional(),
    avatar: deps.image().optional(),
    url: z.url().optional(),
  });
}
