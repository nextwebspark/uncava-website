import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { selectPublished } from '~/lib/blog';
import { staticPages } from '~/lib/pages';
import { absoluteUrl } from '~/lib/seo/url';
import { blogListed, site } from '~/lib/site';

export const GET: APIRoute = async () => {
  const posts = blogListed ? selectPublished(await getCollection('blog'), false) : [];
  const docs = (await getCollection('docs')).toSorted((a, b) => a.id.localeCompare(b.id));
  const link = (title: string, path: string, description: string) =>
    `- [${title}](${absoluteUrl(path)}): ${description}`;

  const pages = [
    staticPages.forSearchFirms,
    staticPages.forInHouseTeams,
    staticPages.about,
    staticPages.pricing,
    staticPages.security,
    staticPages.contact,
    ...(blogListed ? [staticPages.blog] : []),
    staticPages.privacy,
    staticPages.terms,
    staticPages.subprocessors,
  ];

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `The application lives at ${site.appUrl}. This site is the public website${blogListed ? ', blog' : ''} and documentation.`,
    '',
    '## Pages',
    ...pages.map((page) => link(page.title, page.path, page.description)),
    '',
    '## Docs',
    ...docs.map((doc) => link(doc.data.title, `/${doc.id}`, doc.data.description ?? '')),
    '',
    ...(posts.length
      ? [
          '## Blog',
          ...posts.map((post) => link(post.data.title, `/blog/${post.id}`, post.data.description)),
          '',
        ]
      : []),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
