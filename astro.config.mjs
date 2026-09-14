// @ts-check
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://uncava.com',
  output: 'static',
  // One trailing-slash policy, mirrored by firebase.json (`cleanUrls: true`, `trailingSlash: false`).
  // `format: 'file'` writes /security as security.html so Firebase serves it without a redirect.
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Inlined <style> would need 'unsafe-inline' in the CSP; every stylesheet stays a hashed file.
    inlineStylesheets: 'never',
  },
  redirects: {
    '/docs': '/docs/getting-started/introduction',
  },
  devToolbar: { enabled: false },
  integrations: [
    starlight({
      title: 'Uncava Docs',
      description: 'How to run executive search mandates in Uncava.',
      favicon: '/favicon.svg',
      disable404Route: true,
      credits: false,
      titleDelimiter: '—',
      customCss: ['./src/styles/docs.css'],
      head: [{ tag: 'meta', attrs: { name: 'theme-color', content: '#ffffff' } }],
      components: {
        Head: './src/components/docs/DocsHead.astro',
        Header: './src/components/docs/DocsHeader.astro',
        SiteTitle: './src/components/docs/DocsSiteTitle.astro',
      },
      sidebar: [
        {
          label: 'Getting started',
          items: [{ autogenerate: { directory: 'docs/getting-started' } }],
        },
        {
          label: 'Companies & executives',
          items: [{ autogenerate: { directory: 'docs/companies' } }],
        },
        { label: 'Capture extension', items: [{ autogenerate: { directory: 'docs/capture' } }] },
      ],
    }),
    sitemap({
      filter: (page) =>
        !/\/(admin|404)(\/|$)/.test(new URL(page).pathname) && !page.endsWith('/docs'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Astro inlines small scripts under this limit; an inline script would need a CSP hash.
    build: { assetsInlineLimit: 0 },
  },
});
