import { readFileSync } from 'node:fs';
import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { BLOG_TAG_SLUGS } from '../src/lib/blog-tags';
import { authorSchema, blogSchema } from '../src/lib/content-schemas';

interface CmsField {
  name: string;
  widget: string;
  required?: boolean;
  options?: { value: string }[];
  fields?: CmsField[];
}

interface CmsCollection {
  name: string;
  folder: string;
  extension: string;
  fields: CmsField[];
}

const cms = parse(readFileSync('public/admin/config.yml', 'utf8'), { merge: true }) as {
  backend: { name: string; repo: string; branch: string };
  publish_mode: string;
  collections: CmsCollection[];
};

const collection = (name: string) => {
  const found = cms.collections.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`No CMS collection named ${name}`);
  return found;
};

const stub = () => z.string();
const blog = blogSchema({ image: stub, author: z.string() });
const authors = authorSchema({ image: stub });

function optionalInSchema(schema: z.ZodObject, key: string): boolean {
  return schema.shape[key]?.safeParse(undefined).success ?? false;
}

function expectLockstep(schema: z.ZodObject, fields: CmsField[], bodyField: boolean) {
  const cmsNames = fields.map((field) => field.name).filter((name) => name !== 'body');

  expect(cmsNames.toSorted()).toEqual(Object.keys(schema.shape).toSorted());
  expect(fields.some((field) => field.name === 'body')).toBe(bodyField);
  for (const field of fields.filter((candidate) => candidate.name !== 'body')) {
    expect({ field: field.name, optional: field.required === false }).toEqual({
      field: field.name,
      optional: optionalInSchema(schema, field.name),
    });
  }
}

describe('Sveltia CMS config', () => {
  it('commits to this repository through the editorial workflow', () => {
    expect(cms.backend).toMatchObject({
      name: 'github',
      repo: 'nextwebspark/uncava-website',
      branch: 'main',
    });
    expect(cms.publish_mode).toBe('editorial_workflow');
  });

  it('edits exactly the blog fields the schema defines, with the same required fields', () => {
    const posts = collection('blog');

    expect(posts.folder).toBe('src/content/blog');
    expectLockstep(blog, posts.fields, true);
  });

  it('offers exactly the blog topics the tag pages are built from', () => {
    const tags = collection('blog').fields.find((field) => field.name === 'tags');

    expect(tags?.options?.map((option) => option.value)).toEqual(BLOG_TAG_SLUGS);
  });

  it('edits exactly the author fields the schema defines', () => {
    const people = collection('authors');

    expect(people.extension).toBe('json');
    expectLockstep(authors, people.fields, false);
  });

  it('covers every docs sidebar group with a CMS collection', () => {
    const docsFolders = cms.collections
      .filter((candidate) => candidate.name.startsWith('docs-'))
      .map((candidate) => candidate.folder.replace('src/content/docs/', ''));

    const sidebarDirectories =
      readFileSync('astro.config.mjs', 'utf8').match(/directory: '([^']+)'/g) ?? [];
    expect(docsFolders.toSorted()).toEqual(
      sidebarDirectories.map((match) => match.replace(/directory: '|'/g, '')).toSorted(),
    );
  });
});
