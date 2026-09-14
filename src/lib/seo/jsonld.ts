import { site } from '../site';
import { absoluteUrl } from './url';

export type JsonLdNode = { readonly '@type': string } & Readonly<Record<string, unknown>>;

export interface JsonLdGraph {
  readonly '@context': 'https://schema.org';
  readonly '@graph': readonly JsonLdNode[];
}

const ORGANIZATION_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organization(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: site.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/apple-touch-icon.png'),
    ...(site.sameAs.length > 0 ? { sameAs: [...site.sameAs] } : {}),
  };
}

export function webSite(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: absoluteUrl('/'),
    inLanguage: site.locale,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function softwareApplication(input: { description: string }): JsonLdNode {
  return {
    '@type': 'SoftwareApplication',
    name: site.name,
    url: site.appUrl,
    description: input.description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Executive search and talent mapping',
    operatingSystem: 'Web',
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export interface BlogPostingInput {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly imagePath: string;
  readonly publishedAt: Date;
  readonly updatedAt?: Date | undefined;
  readonly authorName: string;
  readonly authorUrl?: string | undefined;
  readonly tags: readonly string[];
}

export function blogPosting(input: BlogPostingInput): JsonLdNode {
  const url = absoluteUrl(input.path);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(input.imagePath),
    datePublished: input.publishedAt.toISOString(),
    dateModified: (input.updatedAt ?? input.publishedAt).toISOString(),
    inLanguage: site.locale,
    keywords: input.tags.join(', '),
    author: {
      '@type': 'Person',
      name: input.authorName,
      ...(input.authorUrl ? { url: input.authorUrl } : {}),
    },
    publisher: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export interface BreadcrumbTrailItem {
  readonly name: string;
  readonly path: string;
}

export function breadcrumbList(trail: readonly BreadcrumbTrailItem[]): JsonLdNode {
  if (trail.length === 0) {
    throw new Error('A breadcrumb trail needs at least one item.');
  }
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface FrequentlyAskedQuestion {
  readonly question: string;
  readonly answer: string;
}

export function faqPage(questions: readonly FrequentlyAskedQuestion[]): JsonLdNode {
  if (questions.length === 0) {
    throw new Error('An FAQPage needs at least one question.');
  }
  return {
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function graph(nodes: readonly JsonLdNode[]): JsonLdGraph {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Escapes `<` so a string inside the data can never close the surrounding `<script>` element. */
export function serializeJsonLd(value: JsonLdGraph): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
