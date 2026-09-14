import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { selectPublished } from './blog';
import { readingMinutes } from './reading-time';

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  return selectPublished(await getCollection('blog'), import.meta.env.DEV);
}

export async function getAuthor(
  post: CollectionEntry<'blog'>,
): Promise<CollectionEntry<'authors'>> {
  const author = await getEntry(post.data.author);
  if (!author) {
    throw new Error(
      `Post "${post.id}" names author "${post.data.author.id}", which does not exist.`,
    );
  }
  return author;
}

export function minutesToRead(post: CollectionEntry<'blog'>): number {
  return readingMinutes(post.body ?? '');
}
