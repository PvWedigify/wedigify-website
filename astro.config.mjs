// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import { redirects } from './src/data/redirects.mjs';
import redirectsFile from './integrations/redirects-file.mjs';

// Keystatic (CMS-admin op /keystatic) draait lokaal tijdens `npm run dev`.
// De productie-build blijft 100% statisch. Zie README voor Keystatic Cloud/GitHub-modus.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://wedigify.nl',
  // 'ignore' in dev: de Keystatic-API (/api/keystatic/...) gebruikt URL's zonder slash
  trailingSlash: isDev ? 'ignore' : 'always',
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  i18n: {
    // Engels later toevoegen: 'en' aan locales + pagina's onder src/pages/en/
    locales: ['nl'],
    defaultLocale: 'nl',
    routing: { prefixDefaultLocale: false },
  },
  redirects,
  integrations: [
    react(),
    markdoc(),
    sitemap({
      filter: (page) => !page.includes('/keystatic'),
      i18n: { defaultLocale: 'nl', locales: { nl: 'nl-NL' } },
    }),
    redirectsFile(redirects),
    ...(isDev ? [keystatic()] : []),
  ],
  image: {
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
