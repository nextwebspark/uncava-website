import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { BLOG_TAGS } from '~/lib/blog-tags';
import { selectPublished } from '~/lib/blog';
import { renderOgImage } from '~/lib/og/render';
import { staticPages } from '~/lib/pages';

export const getStaticPaths = (async () => {
  const pages = Object.values(staticPages)
    .filter((page) => page.path !== '/')
    .map((page) => ({
      params: { slug: page.path.slice(1) },
      props: { title: page.ogTitle, description: page.description, section: page.title },
    }));

  const posts = selectPublished(await getCollection('blog'), import.meta.env.DEV);
  const postCards = posts.map((post) => ({
    params: { slug: `blog/${post.id}` },
    props: { title: post.data.title, description: post.data.description, section: 'Blog' },
  }));

  const tagCards = BLOG_TAGS.filter((tag) =>
    posts.some((post) => post.data.tags.includes(tag.slug)),
  ).map((tag) => ({
    params: { slug: `blog/tag/${tag.slug}` },
    props: {
      title: tag.label,
      description: `Field notes on executive search, filed under ${tag.label.toLowerCase()}.`,
      section: 'Blog',
    },
  }));

  const docCards = (await getCollection('docs')).map((doc) => ({
    params: { slug: doc.id },
    props: { title: doc.data.title, description: doc.data.description ?? '', section: 'Docs' },
  }));

  return [...pages, ...postCards, ...tagCards, ...docCards];
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) => {
  const png = await renderOgImage(props);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
