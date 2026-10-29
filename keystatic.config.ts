import { config, collection, singleton, fields } from '@keystatic/core';
import { iconen } from './src/lib/iconen';

/**
 * Keystatic CMS — open http://localhost:4321/keystatic tijdens `npm run dev`.
 * Opslag staat op 'local' (bestanden in deze repo). Voor online beheer door het team:
 * zet storage op { kind: 'github', repo: 'wedigify/wedigify-website' } (zie README).
 *
 * Velden spiegelen src/content.config.ts.
 */

const titelTekst = fields.object({
  titel: fields.text({ label: 'Titel' }),
  tekst: fields.text({ label: 'Tekst', multiline: true }),
});
const kv = fields.object({
  label: fields.text({ label: 'Label' }),
  waarde: fields.text({ label: 'Waarde' }),
});

const visualOpties = ['dashboard', 'heatmap', 'code', 'lighthouse', 'migratie', 'checklist', 'schild', 'koppeling', 'zoek', 'ads', 'mail', 'content', 'ai'].map((v) => ({ label: v, value: v }));
const icoonOpties = Object.keys(iconen).map((v) => ({ label: v, value: v }));
const icoonTitelTekst = fields.object({
  icoon: fields.select({ label: 'Icoon', options: icoonOpties, defaultValue: 'vink' }),
  titel: fields.text({ label: 'Titel' }),
  tekst: fields.text({ label: 'Tekst', multiline: true }),
});

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Wedigify' },
    navigation: {
      Pagina: ['home', 'site'],
      Content: ['diensten', 'cases', 'kennis'],
      Organisatie: ['team', 'vacatures', 'paginas'],
    },
  },
  singletons: {
    site: singleton({
      label: 'Bedrijfsgegevens',
      path: 'src/content/settings/site',
      format: { data: 'yaml' },
      schema: {
        telefoon: fields.text({ label: 'Telefoon (weergave)' }),
        telefoonLink: fields.text({ label: 'Telefoon (link, bv. +31103220704)' }),
        email: fields.text({ label: 'E-mail' }),
        straat: fields.text({ label: 'Straat + nummer' }),
        postcode: fields.text({ label: 'Postcode' }),
        plaats: fields.text({ label: 'Plaats' }),
        kvk: fields.text({ label: 'KvK-nummer' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        instagram: fields.url({ label: 'Instagram' }),
        contactpersoon: fields.relationship({ label: 'Contactpersoon in CTA', collection: 'team' }),
        partners: fields.array(
          fields.object({
            naam: fields.text({ label: 'Naam' }),
            label: fields.text({ label: 'Status' }),
            logo: fields.image({ label: 'Badge/logo', directory: 'public/images/partners', publicPath: '/images/partners/' }),
          }),
          { label: 'Partners & erkenning', itemLabel: (p) => p.fields.naam.value },
        ),
        partnerBalk: fields.image({
          label: 'Partnerbalk (logo’s in kleur, wordt op een witte kaart getoond)',
          directory: 'public/images/partners',
          publicPath: '/images/partners/',
        }),
        klanten: fields.array(
          fields.object({
            naam: fields.text({ label: 'Klant' }),
            logo: fields.image({ label: 'Logo', directory: 'public/images/klanten', publicPath: '/images/klanten/' }),
          }),
          { label: 'Klanten (logobalk)', itemLabel: (p) => p.fields.naam.value },
        ),
        reviews: fields.array(
          fields.object({
            tekst: fields.text({ label: 'Quote (letterlijk zoals de klant hem gaf)', multiline: true }),
            naam: fields.text({ label: 'Naam' }),
            bedrijf: fields.text({ label: 'Bedrijf' }),
            case: fields.text({ label: 'Slug van de bijbehorende case (optioneel)' }),
            diensten: fields.array(fields.text({ label: 'Dienst slug' }), { label: 'Tonen op deze dienstpagina’s', itemLabel: (p) => p.value }),
          }),
          { label: 'Klantreviews', itemLabel: (p) => `${p.fields.naam.value}, ${p.fields.bedrijf.value}` },
        ),
      },
    }),
    home: singleton({
      label: 'Homepage',
      path: 'src/content/settings/home',
      format: { data: 'yaml' },
      schema: {
        heroEyebrow: fields.text({ label: 'Hero — label boven de kop' }),
        heroTitel: fields.text({ label: 'Hero — kop (navy deel)' }),
        heroAccent: fields.text({ label: 'Hero — kop (paars deel)' }),
        heroIntro: fields.text({ label: 'Hero — intro', multiline: true }),
        manifest: fields.array(titelTekst, { label: 'Manifest (Rotterdamse mentaliteit)', itemLabel: (p) => p.fields.titel.value }),
        magentoTitel: fields.text({ label: 'Magento-sectie — kop' }),
        magentoAccent: fields.text({ label: 'Magento-sectie — paars woord' }),
        magentoIntro: fields.text({ label: 'Magento-sectie — intro', multiline: true }),
        aanpakTitel: fields.text({ label: 'Aanpak-sectie — kop' }),
        aanpakIntro: fields.text({ label: 'Aanpak-sectie — intro', multiline: true }),
        teamTitel: fields.text({ label: 'Team-sectie — kop' }),
        teamIntro: fields.text({ label: 'Team-sectie — intro', multiline: true }),
        ctaTitel: fields.text({ label: 'Slot-CTA — kop' }),
        ctaAccent: fields.text({ label: 'Slot-CTA — paars deel' }),
        uitgelichteCases: fields.array(fields.relationship({ label: 'Case', collection: 'cases' }), {
          label: 'Uitgelichte cases (eerste = groot)',
          itemLabel: (p) => p.value ?? '',
        }),
        heroCases: fields.array(fields.relationship({ label: 'Case', collection: 'cases' }), {
          label: 'Resultaatkaarten in de hero (max. 3)',
          itemLabel: (p) => p.value ?? '',
          validation: { length: { max: 3 } },
        }),
      },
    }),
  },
  collections: {
    diensten: collection({
      label: 'Diensten',
      slugField: 'titel',
      path: 'src/content/diensten/*',
      format: { data: 'yaml' },
      columns: ['titel', 'pijler'],
      schema: {
        titel: fields.slug({ name: { label: 'Titel' } }),
        pijler: fields.select({
          label: 'Pijler',
          options: [
            { label: 'Magento', value: 'magento' },
            { label: 'Groei', value: 'groei' },
          ],
          defaultValue: 'magento',
        }),
        volgorde: fields.integer({ label: 'Volgorde', defaultValue: 99 }),
        ouder: fields.text({ label: 'Subpagina van (slug van de hoofddienst, bv. integraties). Leeg = hoofddienst' }),
        opHome: fields.checkbox({ label: 'Tonen op homepage' }),
        kort: fields.text({ label: 'Korte omschrijving (kaarten/lijsten)' }),
        eyebrow: fields.text({ label: 'Label boven de kop' }),
        heroTitel: fields.text({ label: 'Kop (navy deel)' }),
        heroAccent: fields.text({ label: 'Kop (paars deel)' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        feiten: fields.array(kv, { label: 'Kerngegevens', itemLabel: (p) => p.fields.label.value }),
        voorWie: fields.array(titelTekst, { label: 'Herken je dit?', itemLabel: (p) => p.fields.titel.value }),
        wat: fields.array(fields.text({ label: 'Onderdeel' }), { label: 'Wat je krijgt', itemLabel: (p) => p.value }),
        stappen: fields.array(
          fields.object({
            label: fields.text({ label: 'Label (bv. Week 1)' }),
            titel: fields.text({ label: 'Titel' }),
            tekst: fields.text({ label: 'Tekst', multiline: true }),
          }),
          { label: 'Werkwijze', itemLabel: (p) => p.fields.titel.value },
        ),
        case: fields.relationship({ label: 'Uitgelichte case', collection: 'cases' }),
        specialist: fields.relationship({ label: 'Specialist (hoofdcontact, hero en vragen)', collection: 'team' }),
        teamleden: fields.array(fields.relationship({ label: 'Teamlid', collection: 'team' }), { label: 'Werkt samen met (extra teamleden in hero en samenwerking)', itemLabel: (p) => p.value ?? '' }),
        heroPunten: fields.array(fields.text({ label: 'Punt' }), { label: 'Hero: vinkjes onder de knop', itemLabel: (p) => p.value }),
        visual: fields.select({ label: 'Hero: illustratie', options: visualOpties, defaultValue: 'dashboard' }),
        visualBadge: fields.object(
          { titel: fields.text({ label: 'Titel' }), tekst: fields.text({ label: 'Tekst' }), icoon: fields.select({ label: 'Icoon', options: icoonOpties, defaultValue: 'grafiek' }) },
          { label: 'Hero: zwevende badge' },
        ),
        watIs: fields.object(
          {
            titel: fields.text({ label: 'Titel (bv. Wat is CRO?)' }),
            tekst: fields.text({ label: 'Tekst', multiline: true }),
            punten: fields.array(fields.text({ label: 'Punt' }), { label: 'Vinkjes', itemLabel: (p) => p.value }),
            visual: fields.select({ label: 'Illustratie', options: visualOpties, defaultValue: 'heatmap' }),
          },
          { label: 'Wat is ...?' },
        ),
        voordelen: fields.array(icoonTitelTekst, { label: 'Voordelen (4 kaarten)', itemLabel: (p) => p.fields.titel.value }),
        waarom: fields.object({ titel: fields.text({ label: 'Titel' }), tekst: fields.text({ label: 'Tekst (lege regel = nieuwe alinea)', multiline: true }) }, { label: 'Waarom ...?' }),
        onderdelenTitel: fields.text({ label: 'Onderdelen: kop (bv. Wat kunnen we optimaliseren?)' }),
        onderdelenNoot: fields.text({ label: 'Onderdelen: toelichting onder de lijst (optioneel)', multiline: true }),
        werkTitel: fields.text({ label: 'Uit ons werk: kop (optioneel)' }),
        werk: fields.array(
          fields.object({
            afbeelding: fields.image({ label: 'Afbeelding (banner, carrousel, video still, scherm)', directory: 'public/images/werk', publicPath: '/images/werk/' }),
            titel: fields.text({ label: 'Titel of klant' }),
            type: fields.text({ label: 'Type (bv. Carrousel, Video, Banner)' }),
          }),
          { label: 'Uit ons werk (galerij, verschijnt zodra er beelden zijn)', itemLabel: (p) => p.fields.titel.value || 'Beeld' },
        ),
        onderdelen: fields.array(fields.object({ icoon: fields.select({ label: 'Icoon', options: icoonOpties, defaultValue: 'vink' }), label: fields.text({ label: 'Label' }) }), {
          label: 'Onderdelen (iconen-raster)',
          itemLabel: (p) => p.fields.label.value,
        }),
        wanneer: fields.array(fields.text({ label: 'Punt' }), { label: 'Wanneer is dit interessant?', itemLabel: (p) => p.value }),
        waaromWedigify: fields.array(icoonTitelTekst, { label: 'Waarom Wedigify', itemLabel: (p) => p.fields.titel.value }),
        resultaten: fields.array(
          fields.object({
            icoon: fields.select({ label: 'Icoon', options: icoonOpties, defaultValue: 'grafiek' }),
            richting: fields.select({ label: 'Richting', options: [{ label: 'Omhoog', value: 'op' }, { label: 'Omlaag', value: 'neer' }], defaultValue: 'op' }),
            titel: fields.text({ label: 'Titel' }),
            tekst: fields.text({ label: 'Tekst' }),
          }),
          { label: 'Wat levert het op?', itemLabel: (p) => p.fields.titel.value },
        ),
        uitleg: fields.array(titelTekst, { label: 'Uitleg (SEO-tekstblokken met H2)', itemLabel: (p) => p.fields.titel.value }),
        faq: fields.array(
          fields.object({
            vraag: fields.text({ label: 'Vraag' }),
            antwoord: fields.text({ label: 'Antwoord', multiline: true }),
          }),
          { label: 'Veelgestelde vragen', itemLabel: (p) => p.fields.vraag.value },
        ),
        artikelen: fields.array(fields.relationship({ label: 'Artikel', collection: 'kennis' }), {
          label: 'Gerelateerde kennisartikelen',
          itemLabel: (p) => p.value ?? '',
        }),
        ctaTitel: fields.text({ label: 'Slot-CTA kop' }),
        ctaLabel: fields.text({ label: 'Slot-CTA knop' }),
        ctaIntro: fields.text({ label: 'Slot-CTA tekst', multiline: true }),
        seoTitel: fields.text({ label: 'SEO-titel' }),
        seoOmschrijving: fields.text({ label: 'SEO-omschrijving', multiline: true }),
      },
    }),
    cases: collection({
      label: 'Cases',
      slugField: 'klant',
      path: 'src/content/cases/*',
      format: { data: 'yaml' },
      columns: ['klant', 'titel'],
      schema: {
        klant: fields.slug({ name: { label: 'Klant' } }),
        titel: fields.text({ label: 'Kop (navy deel)' }),
        titelAccent: fields.text({ label: 'Kop (paars deel)' }),
        branche: fields.text({ label: 'Branche' }),
        plaats: fields.text({ label: 'Plaats' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
        diensten: fields.array(fields.relationship({ label: 'Dienst', collection: 'diensten' }), {
          label: 'Diensten (voor filter)',
          itemLabel: (p) => p.value ?? '',
        }),
        hoofdcijfer: fields.text({ label: 'Hoofdcijfer (bv. 8 weken)' }),
        hoofdcijferLabel: fields.text({ label: 'Toelichting hoofdcijfer' }),
        kort: fields.text({ label: 'Korte omschrijving' }),
        resultaten: fields.array(kv, { label: 'Resultaatcijfers', itemLabel: (p) => p.fields.waarde.value }),
        uitdaging: fields.text({ label: 'De uitdaging', multiline: true }),
        aanpak: fields.text({ label: 'Onze aanpak', multiline: true }),
        aanpakPunten: fields.array(fields.text({ label: 'Punt' }), { label: 'Aanpak in punten', itemLabel: (p) => p.value }),
        resultaat: fields.text({ label: 'Het resultaat', multiline: true }),
        quoteTekst: fields.text({ label: 'Klantquote (leeg = niet tonen)', multiline: true }),
        quoteNaam: fields.text({ label: 'Quote — naam' }),
        quoteFunctie: fields.text({ label: 'Quote — functie' }),
        team: fields.array(fields.relationship({ label: 'Teamlid', collection: 'team' }), {
          label: 'Team op deze case',
          itemLabel: (p) => p.value ?? '',
        }),
        stack: fields.array(fields.text({ label: 'Tool' }), { label: 'Stack', itemLabel: (p) => p.value }),
        afbeelding: fields.image({ label: 'Afbeelding', directory: 'public/images/cases', publicPath: '/images/cases/' }),
        datum: fields.date({ label: 'Datum' }),
        volgorde: fields.integer({ label: 'Volgorde', defaultValue: 99 }),
        seoOmschrijving: fields.text({ label: 'SEO-omschrijving', multiline: true }),
        seoTitel: fields.text({ label: 'SEO titel (max 60 tekens, optioneel)' }),
      },
    }),
    branches: collection({
      label: 'Branches',
      slugField: 'naam',
      path: 'src/content/branches/*',
      format: { data: 'yaml' },
      columns: ['naam', 'heroTitel'],
      schema: {
        naam: fields.slug({ name: { label: 'Branche (menu en kaart)' } }),
        kort: fields.text({ label: 'Korte omschrijving (kaart)', multiline: true }),
        icoon: fields.select({ label: 'Icoon', options: icoonOpties, defaultValue: 'winkel' }),
        heroTitel: fields.text({ label: 'Hero kop (navy deel)' }),
        heroAccent: fields.text({ label: 'Hero kop (paars deel)' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        heroPunten: fields.array(fields.text({ label: 'Punt' }), { label: 'Hero punten', itemLabel: (p) => p.value }),
        uitdagingenIntro: fields.text({ label: 'Uitdagingen intro', multiline: true }),
        uitdagingen: fields.array(icoonTitelTekst, { label: 'Uitdagingen in deze branche', itemLabel: (p) => p.fields.titel.value }),
        oplossingen: fields.array(icoonTitelTekst, { label: 'Wat Magento en Wedigify oplossen', itemLabel: (p) => p.fields.titel.value }),
        cases: fields.array(fields.relationship({ label: 'Case', collection: 'cases' }), { label: 'Cases', itemLabel: (p) => p.value ?? '' }),
        diensten: fields.array(fields.relationship({ label: 'Dienst', collection: 'diensten' }), { label: 'Relevante diensten', itemLabel: (p) => p.value ?? '' }),
        reviewBedrijven: fields.array(fields.text({ label: 'Bedrijfsnaam' }), { label: 'Reviews tonen van (bedrijfsnaam uit site instellingen)', itemLabel: (p) => p.value }),
        artikelen: fields.array(fields.relationship({ label: 'Artikel', collection: 'kennis' }), { label: 'Artikelen', itemLabel: (p) => p.value ?? '' }),
        faq: fields.array(fields.object({ vraag: fields.text({ label: 'Vraag' }), antwoord: fields.text({ label: 'Antwoord', multiline: true }) }), { label: 'FAQ', itemLabel: (p) => p.fields.vraag.value }),
        ctaTitel: fields.text({ label: 'CTA kop' }),
        volgorde: fields.integer({ label: 'Volgorde', defaultValue: 99 }),
        seoTitel: fields.text({ label: 'SEO titel (max 60 tekens)' }),
        seoOmschrijving: fields.text({ label: 'SEO omschrijving', multiline: true }),
      },
    }),
    team: collection({
      label: 'Team',
      slugField: 'naam',
      path: 'src/content/team/*',
      format: { data: 'yaml' },
      columns: ['naam', 'rol'],
      schema: {
        naam: fields.slug({ name: { label: 'Naam' } }),
        rol: fields.text({ label: 'Functie' }),
        afdeling: fields.select({
          label: 'Afdeling',
          options: [
            { label: 'Directie', value: 'directie' },
            { label: 'Strategie', value: 'strategie' },
            { label: 'Development', value: 'development' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Support', value: 'support' },
          ],
          defaultValue: 'development',
        }),
        foto: fields.image({ label: 'Foto (vierkant)', directory: 'public/images/team', publicPath: '/images/team/' }),
        bio: fields.text({ label: 'Korte bio', multiline: true }),
        email: fields.text({ label: 'E-mail' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        volgorde: fields.integer({ label: 'Volgorde', defaultValue: 99 }),
      },
    }),
    kennis: collection({
      label: 'Kennis (blog)',
      slugField: 'titel',
      path: 'src/content/kennis/*',
      format: { contentField: 'body' },
      columns: ['titel', 'datum'],
      schema: {
        titel: fields.slug({ name: { label: 'Titel' } }),
        omschrijving: fields.text({ label: 'Omschrijving', multiline: true }),
        seoTitel: fields.text({ label: 'SEO titel (max 60 tekens, optioneel)' }),
        datum: fields.date({ label: 'Datum' }),
        bijgewerkt: fields.date({ label: 'Laatst bijgewerkt (optioneel)' }),
        auteur: fields.relationship({ label: 'Auteur', collection: 'team' }),
        categorie: fields.select({
          label: 'Categorie',
          options: [
            { label: 'Magento', value: 'magento' },
            { label: 'Groei', value: 'groei' },
            { label: 'Strategie', value: 'strategie' },
            { label: 'Nieuws', value: 'nieuws' },
          ],
          defaultValue: 'nieuws',
        }),
        afbeelding: fields.image({ label: 'Afbeelding', directory: 'public/images/kennis', publicPath: '/images/kennis/' }),
        body: fields.markdoc({ label: 'Artikel' }),
      },
    }),
    paginas: collection({
      label: 'Juridische pagina\'s',
      slugField: 'titel',
      path: 'src/content/paginas/*',
      format: { contentField: 'body' },
      schema: {
        titel: fields.slug({ name: { label: 'Titel' } }),
        omschrijving: fields.text({ label: 'SEO-omschrijving' }),
        bijgewerkt: fields.date({ label: 'Laatst bijgewerkt' }),
        body: fields.markdoc({ label: 'Tekst' }),
      },
    }),
    vacatures: collection({
      label: 'Vacatures',
      slugField: 'titel',
      path: 'src/content/vacatures/*',
      format: { contentField: 'body' },
      schema: {
        titel: fields.slug({ name: { label: 'Titel' } }),
        uren: fields.text({ label: 'Uren (bv. 32-40 uur)' }),
        locatie: fields.text({ label: 'Locatie', defaultValue: 'Rotterdam' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        actief: fields.checkbox({ label: 'Actief', defaultValue: true }),
        geplaatst: fields.date({ label: 'Geplaatst op (voor Google for Jobs)' }),
        body: fields.markdoc({ label: 'Vacaturetekst' }),
      },
    }),
  },
});
