import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export async function getSite() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('src/content/settings/site.yaml ontbreekt');
  return entry.data;
}

export async function getHome() {
  const entry = await getEntry('settings', 'home');
  if (!entry) throw new Error('src/content/settings/home.yaml ontbreekt');
  return entry.data;
}

export type Dienst = CollectionEntry<'diensten'>;
export type Case = CollectionEntry<'cases'>;
export type Teamlid = CollectionEntry<'team'>;

/** Diensten per pijler. Subpagina's (met `ouder`) alleen als `alles` true is. */
export async function getDiensten(pijler?: 'magento' | 'groei', alles = false) {
  const all = await getCollection('diensten', (d) => (pijler ? d.data.pijler === pijler : true) && (alles || !d.data.ouder));
  return all.sort((a, b) => a.data.volgorde - b.data.volgorde);
}

export async function getCases() {
  const all = await getCollection('cases');
  return all.sort((a, b) => a.data.volgorde - b.data.volgorde);
}

export async function getTeam() {
  const all = await getCollection('team');
  return all.sort((a, b) => a.data.volgorde - b.data.volgorde);
}

export const dienstUrl = (d: Dienst) => `/${d.data.pijler}/${d.id}/`;
export const caseUrl = (c: Case) => `/cases/${c.id}/`;

export const pijlerLabel = { magento: 'Magento', groei: 'Groei' } as const;

export const afdelingLabel = {
  directie: 'Directie',
  strategie: 'Strategie',
  development: 'Development',
  marketing: 'Marketing',
  support: 'Support',
} as const;

export function initialen(naam: string) {
  return naam
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export const datumNL = (d: Date) =>
  d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

/** Hoofdnavigatie — één plek om te beheren */
export const hoofdmenu = [
  { label: 'Magento', href: '/magento/' },
  { label: 'Groei', href: '/groei/' },
  { label: 'Aanpak', href: '/aanpak/' },
  { label: 'Cases', href: '/cases/' },
  { label: 'Over ons', href: '/over-ons/' },
  { label: 'Kennis', href: '/kennis/' },
];

/** Bestaat een bestand in /public? (build-time check, zodat ontbrekende afbeeldingen netjes terugvallen) */
/** srcset met een 800px variant (bestand-800.ext) als die bestaat. */
export function srcset(pad?: string | null) {
  if (!pad) return undefined;
  const klein = pad.replace(/\.(\w+)$/, '-800.$1');
  return existsSync(join(process.cwd(), 'public', klein)) ? `${klein} 800w, ${pad} 1600w` : undefined;
}

export function bestaat(pad?: string | null): pad is string {
  return !!pad && existsSync(join(process.cwd(), 'public', pad));
}

/** Geschatte leestijd in minuten (220 woorden per minuut) op basis van de ruwe Markdoc tekst. */
export const leestijd = (tekst = '') => {
  const woorden = tekst.replace(/\{%[^%]*%\}/g, ' ').replace(/[#*>|`\[\]()_-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(woorden / 220));
};

export const kennisCategorie = { magento: 'Magento', groei: 'Groei', strategie: 'Strategie', nieuws: 'Nieuws' } as const;
