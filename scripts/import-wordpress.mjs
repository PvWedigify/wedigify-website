#!/usr/bin/env node
/**
 * Eenmalige import van content uit de huidige WordPress-site (wedigify.nl) via de WP REST API.
 *
 *   npm run import:wp                                # alles
 *   npm run import:wp -- --dry                       # alleen tonen wat er zou gebeuren
 *   npm run import:wp -- --alleen=team,afbeeldingen  # alleen bepaalde stappen
 *
 * Stappen: kennis, juridisch, team, afbeeldingen, documenten, sfeer
 *
 * Bestaande artikelen, pagina's en teamfoto's worden NIET overschreven (die zijn inmiddels
 * bewerkt). Gebruik --forceer om ze toch opnieuw te importeren.
 *
 * Wat het doet:
 *  1. Blogartikelen (behalve de case studies) → src/content/kennis/<slug>.mdoc
 *     inclusief uitgelichte afbeelding en afbeeldingen in de tekst → public/images/kennis/<slug>/
 *  2. Privacyverklaring en algemene voorwaarden → src/content/paginas/*.mdoc
 *  3. Teamfoto's → public/images/team/<slug>.<ext> en zet `foto:` in src/content/team/<slug>.yaml
 *  4. Klantlogo's, partnerbadges en case-afbeeldingen → public/images/{klanten,partners,cases}/
 *     en zet `afbeelding:` in src/content/cases/<slug>.yaml
 *
 * Draai dit vóór de livegang, zolang de oude site nog online is. Controleer daarna de
 * artikelen in Keystatic (npm run dev → /keystatic).
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';

const BRON = process.env.WP_URL ?? 'https://wedigify.nl';
const DRY = process.argv.includes('--dry');
const FORCEER = process.argv.includes('--forceer');
const bestaatAl = async (p) => access(p).then(() => true, () => false);
const DOCUMENTEN = {
  '/wp-content/uploads/2026/06/Wedigify-B.V.-Algemene-Voorwaarden-NL-2026.pdf': 'documenten/wedigify-algemene-voorwaarden-2026.pdf',
};
/** Sfeerfoto's van /werken-bij/ voor over ons, werken bij en de homepage. */
const SFEER = {
  '/wp-content/uploads/2025/07/cubus_wedigify_banner.jpg': 'rotterdam-kubuswoningen.jpg',
  '/wp-content/uploads/2025/06/wedigify_uitje2.jpg': 'team-borrel.jpg',
  '/wp-content/uploads/2025/06/wedigify_skiuitjje.jpg': 'team-skireis.jpg',
  '/wp-content/uploads/2025/06/wedigify_wwvd-1.jpg': 'team-webwinkel-vakdagen.jpg',
  '/wp-content/uploads/2025/06/wedigify_teambuilding.jpg': 'team-teambuilding.jpg',
  '/wp-content/uploads/2025/06/amsterdam_wedigify.jpg': 'team-darts.jpg',
  '/wp-content/uploads/2025/06/wedigify_oranje.jpg': 'team-oranje.jpg',
  '/wp-content/uploads/2025/06/etentje_wedigify_2025-1.jpg': 'team-etentje.jpg',
  '/wp-content/uploads/2025/06/wedigify_uitje4.jpg': 'team-uitje.jpg',
  '/wp-content/uploads/2025/06/wedigify_frankborrel.jpg': 'team-rondvaart.jpg',
  '/wp-content/uploads/2023/03/wedigify_markthal-1.jpg': 'rotterdam-markthal.jpg',
};
const ALLEEN = (process.argv.find((a) => a.startsWith('--alleen='))?.split('=')[1] ?? '').split(',').filter(Boolean);
const doen = (stap) => ALLEEN.length === 0 || ALLEEN.includes(stap);
const ROOT = path.resolve(import.meta.dirname, '..');
const CASE_CATEGORIE = 3; // "Case studies" op wedigify.nl — die staan als eigen cases in src/content/cases

const TEAM_FOTOS = {
  anastasiia: '/wp-content/uploads/2025/07/anastasiia_wedigify-300x300.jpg',
  dmytro: '/wp-content/uploads/2025/06/dmytro_wedigify-300x300.png',
  giulia: '/wp-content/uploads/2025/06/giulia_wedigify-300x300.jpg',
  ievgenii: '/wp-content/uploads/2025/06/ievgenii_wedigify-300x300.jpg',
  iris: '/wp-content/uploads/2025/06/iris_wedigify-300x300.jpg',
  jay: '/wp-content/uploads/2025/07/jay_wedigify-1-300x300.png',
  marc: '/wp-content/uploads/2025/06/marc_wedigify-300x300.jpg',
  marina: '/wp-content/uploads/2025/06/marina_wedigify-300x300.jpg',
  mike: '/wp-content/uploads/2025/07/mike_wedigify-300x300.png',
  oleksandr: '/wp-content/uploads/2025/07/oleksandr_wedigify-300x300.png',
  patrick: '/wp-content/uploads/2025/06/patrick_wedigify-300x300.jpg',
  pavel: '/wp-content/uploads/2025/06/pavel_wedigify-300x300.jpg',
  wouter: '/wp-content/uploads/2025/07/wouter_wedigify-300x300.jpg',
  // loyd, michelle en oleksandr-2 hebben nog geen foto op de huidige site
};

const KLANTLOGOS = {
  'budgetplan.png': '/wp-content/uploads/2025/06/bp_logo-1.png',
  'krale.png': '/wp-content/uploads/2025/06/krale_logo.png',
  'zinzi.webp': '/wp-content/uploads/2025/06/zin_logo.webp',
  'shuz.webp': '/wp-content/uploads/2025/06/shuz_logo.webp',
  'bommel-wonen.png': '/wp-content/uploads/2023/03/bommelwonen.png',
  'greenfield.webp': '/wp-content/uploads/2025/06/greenfield_logo.webp',
  'dugros.webp': '/wp-content/uploads/2025/06/dug_logo.webp',
  'rikkoert.webp': '/wp-content/uploads/2025/06/rk_logo.webp',
  'livingfurn.webp': '/wp-content/uploads/2025/06/livingfurn_logo.webp',
};
const PARTNERS = {
  'hypernode.png': '/wp-content/uploads/2025/07/hypernode_partner_home.png',
  'hyva-bronze.png': '/wp-content/uploads/2025/06/hyva_bronze-partner-badge_dark.png',
  'google-partner.png': '/wp-content/uploads/2025/07/google_logo_home.png',
  'partnerbalk.png': '/wp-content/uploads/2026/04/partnerlogos_wedigify.png',
  'fonk150.jpg': '/wp-content/uploads/2025/06/fonq150_wedigify-e1750858368693.jpg',
};
const CASEBEELDEN = {
  budgetplan: '/wp-content/uploads/2026/03/bgp_keuken.png',
  'de-bommel': '/wp-content/uploads/2026/03/20230322_WoonmallAlexandrium-JoniIsraeli-483-ER5_9864-1536x960-1.jpg',
  tacstack: '/wp-content/uploads/2026/02/Jager-met-case.jpg',
  krale: '/wp-content/uploads/2025/06/Airsoft_shop_Krale.jpg',
  zinzi: '/wp-content/uploads/2025/11/Zinzi-251029-homepagina-cover-desktop2-min.jpg',
  'uv-fashions': '/wp-content/uploads/2025/11/juja.jpg',
  'greenfield-fashion': '/wp-content/uploads/2025/07/greenfield_fashion.webp',
  shuz: '/wp-content/uploads/2025/07/shuz-by-vollaerts.jpg',
};

const JURIDISCH = { 'privacy-policy': 'privacy', 'algemene-voorwaarden': 'algemene-voorwaarden' };

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
td.remove(['script', 'style', 'iframe', 'form', 'noscript']);
// Elementor-knoppen en lege wrappers weg
td.addRule('elementorKnop', {
  filter: (node) => node.nodeName === 'A' && /elementor-button/.test(node.getAttribute('class') ?? ''),
  replacement: () => '',
});

const log = (...a) => console.log(DRY ? '[dry]' : '', ...a);

async function json(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} bij ${url}`);
  return res.json();
}

async function alles(endpoint) {
  const items = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${BRON}/wp-json/wp/v2/${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    if (!res.ok) break;
    const batch = await res.json();
    items.push(...batch);
    if (page >= Number(res.headers.get('X-WP-TotalPages') ?? 1)) break;
  }
  return items;
}

/** Downloadt een bestand; geeft true terug als het gelukt is (nooit een crash). */
async function download(url, doel) {
  if (DRY) {
    log('  afbeelding', url, '→', path.relative(ROOT, doel));
    return true;
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) {
      console.warn('  ! kon niet downloaden:', url, res.status);
      return false;
    }
    await mkdir(path.dirname(doel), { recursive: true });
    await writeFile(doel, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch (e) {
    console.warn('  ! kon niet downloaden:', url, e.cause?.code ?? e.message);
    return false;
  }
}

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;|\[&hellip;\]/g, '…')
    .trim();

const yamlStr = (s) => JSON.stringify(s); // JSON-string is geldige YAML

function categorie(titel) {
  const t = titel.toLowerCase();
  if (/magento|hyv|migratie|composable|support|shopify/.test(t)) return 'magento';
  if (/seo|sea|conversie|cro|social|e-mail|facebook|analytics|search console|helpful/.test(t)) return 'groei';
  if (/businesscase|kpi|ai|strategie|personalisatie|processen/.test(t)) return 'strategie';
  return 'nieuws';
}

/** Zet WP-HTML om naar Markdown en haalt afbeeldingen lokaal binnen. */
async function naarMarkdown(html, slug, map) {
  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  let i = 0;
  for (const src of new Set(imgs)) {
    if (!src.includes('/wp-content/uploads/')) continue;
    // Afbeeldingen van een ander domein (bv. het oude theme-demo) via wedigify.nl ophalen
    const bron = new URL(new URL(src, BRON).pathname, BRON).toString();
    const ext = path.extname(new URL(bron).pathname) || '.jpg';
    const naam = `${String(++i).padStart(2, '0')}${ext}`;
    if (await download(bron, path.join(ROOT, 'public/images', map, slug, naam))) {
      html = html.split(src).join(`/images/${map}/${slug}/${naam}`);
    } else {
      html = html.replace(new RegExp(`<img[^>]+src="${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'g'), '');
    }
  }
  let md = td.turndown(html);
  md = md
    .replace(/\{%/g, '{\\%') // Markdoc-tags escapen
    .replace(new RegExp(`${BRON.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/blog/`, 'g'), '/kennis/')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return md;
}

async function importeerKennis() {
  const posts = await alles(`posts?categories_exclude=${CASE_CATEGORIE}&_embed=wp:featuredmedia`);
  log(`Kennis: ${posts.length} artikelen`);
  for (const p of posts) {
    const slug = p.slug;
    const titel = decode(p.title.rendered);
    const omschrijving = decode(p.excerpt.rendered).replace(/\s+/g, ' ').slice(0, 300);
    let afbeelding = '';
    const media = p._embedded?.['wp:featuredmedia']?.[0];
    if (media?.source_url) {
      const ext = path.extname(new URL(media.source_url).pathname) || '.jpg';
      const pad = `/images/kennis/${slug}/cover${ext}`;
      if (await download(media.source_url, path.join(ROOT, 'public', pad))) afbeelding = pad;
    }
    const body = await naarMarkdown(p.content.rendered, slug, 'kennis');
    const fm = [
      '---',
      `titel: ${yamlStr(titel)}`,
      `omschrijving: ${yamlStr(omschrijving || titel)}`,
      `datum: ${p.date.slice(0, 10)}`,
      `categorie: ${categorie(titel)}`,
      afbeelding && `afbeelding: ${afbeelding}`,
      '---',
    ]
      .filter(Boolean)
      .join('\n');
    const doel = path.join(ROOT, 'src/content/kennis', `${slug}.mdoc`);
    if (!FORCEER && (await bestaatAl(doel))) {
      log('  overgeslagen (bestaat al):', path.relative(ROOT, doel));
      continue;
    }
    if (DRY) log('  ', path.relative(ROOT, doel));
    else await writeFile(doel, `${fm}\n${body}\n`, 'utf8');
  }
}

async function importeerJuridisch() {
  for (const [wpSlug, slug] of Object.entries(JURIDISCH)) {
    const [p] = await json(`${BRON}/wp-json/wp/v2/pages?slug=${wpSlug}`);
    if (!p) {
      console.warn('  ! pagina niet gevonden:', wpSlug);
      continue;
    }
    const body = await naarMarkdown(p.content.rendered, slug, 'paginas');
    const fm = ['---', `titel: ${yamlStr(decode(p.title.rendered))}`, `omschrijving: ${yamlStr(`${decode(p.title.rendered)} van Wedigify.`)}`, `bijgewerkt: ${p.modified.slice(0, 10)}`, '---'].join('\n');
    const doel = path.join(ROOT, 'src/content/paginas', `${slug}.mdoc`);
    if (!FORCEER && (await bestaatAl(doel))) {
      log('Pagina overgeslagen (bestaat al):', path.relative(ROOT, doel));
      continue;
    }
    log('Pagina:', path.relative(ROOT, doel));
    if (!DRY) await writeFile(doel, `${fm}\n${body}\n`, 'utf8');
  }
}

async function importeerDocumenten() {
  for (const [bron, doel] of Object.entries(DOCUMENTEN)) {
    const pad = path.join(ROOT, 'public', doel);
    log('Document:', doel);
    if (!DRY) await download(`${BRON}${bron}`, pad);
  }
}

async function importeerSfeer() {
  for (const [bron, naam] of Object.entries(SFEER)) {
    const pad = path.join(ROOT, 'public', 'images', 'sfeer', naam);
    if (!FORCEER && (await bestaatAl(pad))) continue;
    log('Sfeerfoto:', naam);
    if (!DRY) await download(`${BRON}${bron}`, pad);
  }
}

async function importeerTeamfotos() {
  for (const [slug, pad] of Object.entries(TEAM_FOTOS)) {
    const yamlCheck = path.join(ROOT, 'src/content/team', `${slug}.yaml`);
    if (!FORCEER && (await bestaatAl(yamlCheck)) && /^foto:/m.test(await readFile(yamlCheck, 'utf8'))) {
      log('Team overgeslagen (heeft al een foto):', slug);
      continue;
    }
    const ext = path.extname(pad);
    const publiek = `/images/team/${slug}${ext}`;
    if (!(await download(`${BRON}${pad}`, path.join(ROOT, 'public', publiek)))) continue;
    const yamlPad = path.join(ROOT, 'src/content/team', `${slug}.yaml`);
    try {
      await access(yamlPad);
    } catch {
      continue;
    }
    let y = await readFile(yamlPad, 'utf8');
    y = /^foto:/m.test(y) ? y.replace(/^foto:.*$/m, `foto: ${publiek}`) : y.replace(/^(rol: .*)$/m, `$1\nfoto: ${publiek}`);
    log('Team:', slug, '→', publiek);
    if (!DRY) await writeFile(yamlPad, y, 'utf8');
  }
}

async function importeerAfbeeldingen() {
  for (const [naam, pad] of Object.entries(KLANTLOGOS)) {
    log('Klantlogo:', naam);
    await download(`${BRON}${pad}`, path.join(ROOT, 'public/images/klanten', naam));
  }
  for (const [naam, pad] of Object.entries(PARTNERS)) {
    log('Partner:', naam);
    await download(`${BRON}${pad}`, path.join(ROOT, 'public/images/partners', naam));
  }
  for (const [slug, pad] of Object.entries(CASEBEELDEN)) {
    const caseYaml = path.join(ROOT, 'src/content/cases', `${slug}.yaml`);
    if (!FORCEER && (await bestaatAl(caseYaml)) && /^afbeelding:/m.test(await readFile(caseYaml, 'utf8'))) {
      log('Case overgeslagen (heeft al een afbeelding):', slug);
      continue;
    }
    const publiek = `/images/cases/${slug}${path.extname(pad)}`;
    if (!(await download(`${BRON}${pad}`, path.join(ROOT, 'public', publiek)))) continue;
    const yamlPad = path.join(ROOT, 'src/content/cases', `${slug}.yaml`);
    let y;
    try {
      y = await readFile(yamlPad, 'utf8');
    } catch {
      continue;
    }
    y = /^afbeelding:/m.test(y) ? y.replace(/^afbeelding:.*$/m, `afbeelding: ${publiek}`) : y.replace(/^(datum: .*)$/m, `afbeelding: ${publiek}\n$1`);
    log('Case:', slug, '→', publiek);
    if (!DRY) await writeFile(yamlPad, y, 'utf8');
  }
}

console.log(`Import uit ${BRON}${DRY ? ' (dry run)' : ''}${ALLEEN.length ? ` — alleen: ${ALLEEN.join(', ')}` : ''}\n`);
const stappen = [
  ['kennis', importeerKennis],
  ['juridisch', importeerJuridisch],
  ['team', importeerTeamfotos],
  ['documenten', importeerDocumenten],
  ['sfeer', importeerSfeer],
  ['afbeeldingen', importeerAfbeeldingen],
];
let fouten = 0;
for (const [naam, stap] of stappen) {
  if (!doen(naam)) continue;
  try {
    await stap();
  } catch (e) {
    fouten++;
    console.error(`\n✗ Stap "${naam}" mislukt: ${e.message}\n  De andere stappen gaan gewoon door.`);
  }
}
console.log(fouten ? `\nKlaar met ${fouten} fout(en). Draai de mislukte stap opnieuw met --alleen=<stap>.` : '\nKlaar. Controleer de content met `npm run dev` en open /keystatic.');
