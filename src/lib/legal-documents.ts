import { staticPages, type StaticPageMeta } from './pages';

export interface LegalDocument {
  /** The file name in src/content/legal/. */
  readonly id: string;
  readonly meta: StaticPageMeta;
}

/** In the order /legal lists them and every legal page links between them. */
export const legalDocuments: readonly LegalDocument[] = [
  { id: 'privacy', meta: staticPages.privacy },
  { id: 'executive-privacy', meta: staticPages.executivePrivacy },
  { id: 'terms', meta: staticPages.terms },
  { id: 'acceptable-use', meta: staticPages.acceptableUse },
  { id: 'cookies', meta: staticPages.cookies },
  { id: 'subprocessors', meta: staticPages.subprocessors },
  { id: 'dpa', meta: staticPages.dpa },
];
