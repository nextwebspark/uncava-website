import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { selectPublished } from '~/lib/blog';
import { staticPages } from '~/lib/pages';
import { absoluteUrl } from '~/lib/seo/url';
import { site } from '~/lib/site';

export const GET: APIRoute = async () => {
  const posts = selectPublished(await getCollection('blog'), false);
  const docs = (await getCollection('docs')).toSorted((a, b) => a.id.localeCompare(b.id));
  const link = (title: string, path: string, description: string) =>
    `- [${title}](${absoluteUrl(path)}): ${description}`;

  const pages = [staticPages.security, staticPages.contact, staticPages.blog];

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `The application lives at ${site.appUrl}. This site is the public website, blog and documentation.`,
    '',
    '## Pages',
    ...pages.map((page) => link(page.title, page.path, page.description)),
    '',
    '## Docs',
    ...docs.map((doc) => link(doc.data.title, `/${doc.id}`, doc.data.description ?? '')),
    '',
    '## Blog',
    ...posts.map((post) => link(post.data.title, `/blog/${post.id}`, post.data.description)),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
