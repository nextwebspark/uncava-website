import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { authorSchema, blogSchema, legalSchema } from './lib/content-schemas';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: ({ image }) => blogSchema({ image, author: reference('authors') }),
});

const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.json' }),
  schema: ({ image }) => authorSchema({ image }),
});

const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '*.md' }),
  schema: legalSchema(),
});

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

export const collections = { blog, authors, legal, docs };
