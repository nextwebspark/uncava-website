import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { blogTagLabel } from '~/lib/blog-tags';
import { selectPublished } from '~/lib/blog';
import { staticPages } from '~/lib/pages';
import { site } from '~/lib/site';

export const GET: APIRoute = async (context) => {
  const posts = selectPublished(await getCollection('blog'), false);

  return rss({
    title: `${site.name} blog`,
    description: staticPages.blog.description,
    site: context.site ?? site.url,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
      categories: post.data.tags.map(blogTagLabel),
    })),
    customData: `<language>en</language>`,
  });
};
