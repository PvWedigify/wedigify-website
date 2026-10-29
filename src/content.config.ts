import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content model. Elk schema hier heeft een spiegel in keystatic.config.ts (het CMS).
 * Pas je een veld aan? Doe het dan op beide plekken.
 */

const kv = z.object({ label: z.string(), waarde: z.coerce.string() });
const titelTekst = z.object({ titel: z.string(), tekst: z.string() });

const settings = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/settings' }),
  schema: z.object({
    // site.yaml
    telefoon: z.string().nullish(),
    telefoonLink: z.string().nullish(),
    email: z.string().nullish(),
    straat: z.string().nullish(),
    postcode: z.string().nullish(),
    plaats: z.string().nullish(),
    kvk: z.string().nullish(),
    linkedin: z.string().nullish(),
    instagram: z.string().nullish(),
    partners: z.array(z.object({ naam: z.string(), label: z.string(), logo: z.string().nullish() })).default([]),
    partnerBalk: z.string().nullish(),
    klanten: z.array(z.object({ naam: z.string(), logo: z.string().nullish() })).default([]),
    contactpersoon: reference('team').nullish(),
    reviews: z.array(z.object({ tekst: z.string(), naam: z.string(), bedrijf: z.string(), case: z.string().nullish(), diensten: z.array(z.string()).default([]) })).default([]),
    // home.yaml
    heroEyebrow: z.string().nullish(),
    heroTitel: z.string().nullish(),
    heroAccent: z.string().nullish(),
    heroIntro: z.string().nullish(),
    manifest: z.array(titelTekst).default([]),
    magentoTitel: z.string().nullish(),
    magentoAccent: z.string().nullish(),
    magentoIntro: z.string().nullish(),
    aanpakTitel: z.string().nullish(),
    aanpakIntro: z.string().nullish(),
    teamTitel: z.string().nullish(),
    teamIntro: z.string().nullish(),
    ctaTitel: z.string().nullish(),
    ctaAccent: z.string().nullish(),
    uitgelichteCases: z.array(reference('cases')).default([]),
    heroCases: z.array(reference('cases')).default([]),
  }),
});

const diensten = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/diensten' }),
  schema: z.object({
    titel: z.string(),
    pijler: z.enum(['magento', 'groei']),
    volgorde: z.number().default(99),
    ouder: z.string().nullish(),
    opHome: z.boolean().default(false),
    kort: z.string(),
    eyebrow: z.string().nullish(),
    heroTitel: z.string(),
    heroAccent: z.string().nullish(),
    intro: z.string(),
    feiten: z.array(kv).default([]),
    voorWie: z.array(titelTekst).default([]),
    wat: z.array(z.string()).default([]),
    stappen: z.array(z.object({ label: z.string(), titel: z.string(), tekst: z.string() })).default([]),
    case: reference('cases').nullish(),
    specialist: reference('team').nullish(),
    teamleden: z.array(reference('team')).default([]),
    heroPunten: z.array(z.string()).default([]),
    visual: z.string().nullish(),
    visualBadge: z.object({ titel: z.string(), tekst: z.string().nullish(), icoon: z.string().nullish() }).nullish(),
    watIs: z.object({ titel: z.string(), tekst: z.string(), punten: z.array(z.string()).default([]), visual: z.string().nullish() }).nullish(),
    voordelen: z.array(z.object({ icoon: z.string(), titel: z.string(), tekst: z.string() })).default([]),
    waarom: z.object({ titel: z.string(), tekst: z.string() }).nullish(),
    onderdelenTitel: z.string().nullish(),
    onderdelenNoot: z.string().nullish(),
    werkTitel: z.string().nullish(),
    werk: z.array(z.object({ afbeelding: z.string().nullish(), titel: z.string().nullish(), type: z.string().nullish() })).default([]),
    onderdelen: z.array(z.object({ icoon: z.string(), label: z.string() })).default([]),
    wanneer: z.array(z.string()).default([]),
    waaromWedigify: z.array(z.object({ icoon: z.string(), titel: z.string(), tekst: z.string() })).default([]),
    resultaten: z.array(z.object({ icoon: z.string(), richting: z.enum(['op', 'neer']).default('op'), titel: z.string(), tekst: z.string() })).default([]),
    uitleg: z.array(titelTekst).default([]),
    faq: z.array(z.object({ vraag: z.string(), antwoord: z.string() })).default([]),
    artikelen: z.array(reference('kennis')).default([]),
    ctaTitel: z.string().nullish(),
    ctaLabel: z.string().nullish(),
    ctaIntro: z.string().nullish(),
    seoTitel: z.string().nullish(),
    seoOmschrijving: z.string().nullish(),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/cases' }),
  schema: z.object({
    klant: z.string(),
    titel: z.string(),
    titelAccent: z.string().nullish(),
    branche: z.string(),
    plaats: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    diensten: z.array(reference('diensten')).default([]),
    hoofdcijfer: z.coerce.string(),
    hoofdcijferLabel: z.string(),
    kort: z.string(),
    resultaten: z.array(kv).default([]),
    uitdaging: z.string(),
    aanpak: z.string(),
    aanpakPunten: z.array(z.string()).default([]),
    resultaat: z.string(),
    functiesTitel: z.string().nullish(),
    functies: z.array(z.object({ icoon: z.string(), titel: z.string(), tekst: z.string() })).default([]),
    beelden: z.array(z.object({ afbeelding: z.string(), apparaat: z.enum(['desktop', 'mobiel']).default('desktop'), onderschrift: z.string().nullish() })).default([]),
    quoteTekst: z.string().nullish(),
    quoteNaam: z.string().nullish(),
    quoteFunctie: z.string().nullish(),
    team: z.array(reference('team')).default([]),
    stack: z.array(z.string()).default([]),
    afbeelding: z.string().nullish(),
    datum: z.coerce.date(),
    volgorde: z.number().default(99),
    seoOmschrijving: z.string().nullish(),
    seoTitel: z.string().nullish(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/team' }),
  schema: z.object({
    naam: z.string(),
    rol: z.string(),
    afdeling: z.enum(['directie', 'strategie', 'development', 'marketing', 'support']),
    foto: z.string().nullish(),
    bio: z.string().nullish(),
    email: z.string().nullish(),
    linkedin: z.string().nullish(),
    volgorde: z.number().default(99),
  }),
});

const branches = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/branches' }),
  schema: z.object({
    naam: z.string(),
    kort: z.string(),
    icoon: z.string().default('winkel'),
    heroTitel: z.string(),
    heroAccent: z.string().nullish(),
    intro: z.string(),
    heroPunten: z.array(z.string()).default([]),
    uitdagingenIntro: z.string().nullish(),
    uitdagingen: z.array(z.object({ icoon: z.string(), titel: z.string(), tekst: z.string() })).default([]),
    oplossingen: z.array(z.object({ icoon: z.string(), titel: z.string(), tekst: z.string() })).default([]),
    cases: z.array(reference('cases')).default([]),
    diensten: z.array(reference('diensten')).default([]),
    reviewBedrijven: z.array(z.string()).default([]),
    artikelen: z.array(reference('kennis')).default([]),
    faq: z.array(z.object({ vraag: z.string(), antwoord: z.string() })).default([]),
    ctaTitel: z.string().nullish(),
    volgorde: z.number().default(99),
    seoTitel: z.string().nullish(),
    seoOmschrijving: z.string().nullish(),
  }),
});

const kennis = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/kennis' }),
  schema: z.object({
    titel: z.string(),
    omschrijving: z.string(),
    datum: z.coerce.date(),
    bijgewerkt: z.coerce.date().nullish(),
    auteur: reference('team').nullish(),
    categorie: z.enum(['magento', 'groei', 'strategie', 'nieuws']).default('nieuws'),
    seoTitel: z.string().nullish(),
    afbeelding: z.string().nullish(),
  }),
});

const vacatures = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/vacatures' }),
  schema: z.object({
    titel: z.string(),
    uren: z.string(),
    locatie: z.string().default('Rotterdam'),
    intro: z.string(),
    actief: z.boolean().default(true),
    geplaatst: z.coerce.date().nullish(),
  }),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/paginas' }),
  schema: z.object({
    titel: z.string(),
    omschrijving: z.string(),
    bijgewerkt: z.coerce.date().nullish(),
  }),
});

export const collections = { settings, diensten, cases, team, kennis, vacatures, paginas, branches };
