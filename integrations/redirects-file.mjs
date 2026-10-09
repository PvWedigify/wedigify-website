// Redirects van de oude WordPress-site als echte 301's.
// - vercel.json (projectroot): Vercel leest dit bestand vóór de build, dus het wordt bij elke
//   `npm run dev` en `npm run build` bijgewerkt en hoort in Git te staan.
// - dist/_redirects: hetzelfde in Netlify / Cloudflare Pages-formaat, voor andere hosts.
// Astro maakt daarnaast zelf meta-refresh-pagina's als laatste vangnet.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/** @param {Record<string, string>} redirects */
function vercelConfig(redirects) {
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    framework: 'astro',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    trailingSlash: true,
    redirects: Object.entries(redirects).map(([source, destination]) => ({ source, destination, permanent: true })),
    headers: [
      { source: '/_astro/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/images/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ],
  };
}

/** @param {Record<string, string>} redirects */
export default function redirectsFile(redirects) {
  return {
    name: 'wedigify-redirects-file',
    hooks: {
      /** @param {{ config: { root: URL }, logger: { info: (m: string) => void } }} opts */
      'astro:config:setup': async ({ config, logger }) => {
        const bestand = path.join(fileURLToPath(config.root), 'vercel.json');
        const nieuw = JSON.stringify(vercelConfig(redirects), null, 2) + '\n';
        const oud = await readFile(bestand, 'utf8').catch(() => '');
        if (oud !== nieuw) {
          await writeFile(bestand, nieuw, 'utf8');
          logger.info(`vercel.json bijgewerkt (${Object.keys(redirects).length} redirects), vergeet hem niet te committen`);
        }
      },
      /** @param {{ dir: URL, logger: { info: (m: string) => void } }} opts */
      'astro:build:done': async ({ dir, logger }) => {
        const lines = Object.entries(redirects).map(([from, to]) => `${from} ${to} 301`);
        const out = path.join(fileURLToPath(dir), '_redirects');
        await writeFile(out, lines.join('\n') + '\n', 'utf8');
        logger.info(`_redirects geschreven (${lines.length} regels)`);
      },
    },
  };
}
