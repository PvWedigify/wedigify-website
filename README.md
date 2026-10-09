# wedigify.nl — Astro

De nieuwe website van Wedigify. Statisch gegenereerd met **Astro 7**, gestyled met **Tailwind CSS 4** in de Wedigify-huisstijl (Poppins, paars `#763CF7`, navy `#0A0D31`, lavendel `#FBF8FF`) en te beheren via **Keystatic** (Git-based CMS).

Lighthouse (mobiel, lokaal gemeten): 100 / 100 / 100 / 100 op home, dienst-, case-, aanpak-, team- en contactpagina.

## Snel starten

```bash
nvm use            # Node 22 (zie .nvmrc), minimaal 22.12
npm install
npm run dev        # http://localhost:4321
```

CMS: open **http://localhost:4321/keystatic** terwijl `npm run dev` draait.

| Script | Wat het doet |
| --- | --- |
| `npm run dev` | Dev-server + Keystatic-admin |
| `npm run build` | Typecheck (`astro check`) + productie-build naar `dist/` |
| `npm run preview` | De build lokaal bekijken |
| `npm run import:wp` | Eenmalig content uit de huidige WordPress-site halen (zie hieronder) |

## Eerst doen: content uit WordPress importeren

De 20 blogartikelen, de privacyverklaring, de algemene voorwaarden en de teamfoto's staan nog op de oude site. Haal ze binnen zolang die online is:

```bash
npm run import:wp -- --dry   # eerst kijken wat er gebeurt
npm run import:wp
```

Dit schrijft naar `src/content/kennis/`, `src/content/paginas/`, `public/images/` en zet `foto:` in de teambestanden. Loop de artikelen daarna na in Keystatic (koppen, afbeeldingen, auteur).

## Structuur

```
src/
  content/            Alle content (YAML en Markdoc), beheerd via Keystatic
    settings/         site.yaml (NAW, partners, klanten) en home.yaml (homepage-teksten)
    diensten/         17 diensten; `pijler: magento | groei` bepaalt de URL
    cases/            8 cases met resultaatcijfers
    team/             16 teamleden
    kennis/           Blog (.mdoc)
    vacatures/        Vacatures (.mdoc)
    paginas/          Privacy en algemene voorwaarden (.mdoc)
  content.config.ts   Schema's (Zod). Spiegel van keystatic.config.ts
  components/         Header, Footer, PageHero, DienstIndex, CaseFeature, Faq ...
  layouts/Base.astro  <head>, SEO, Open Graph, JSON-LD (ProfessionalService)
  lib/site.ts         Helpers en hoofdmenu
  pages/              Routes
  styles/global.css   Design tokens (@theme) en componentklassen (.knop-paars, .eyebrow ...)
  data/redirects.mjs  301's van de oude WordPress-URL's
keystatic.config.ts   CMS-configuratie
scripts/import-wordpress.mjs
```

### Routes

| URL | Bron |
| --- | --- |
| `/` | `pages/index.astro` + `content/settings/home.yaml` |
| `/magento/`, `/groei/` | Overzicht per pijler |
| `/magento/<dienst>/`, `/groei/<dienst>/` | `content/diensten/*.yaml` |
| `/aanpak/` | Business case → roadmap → jaar samen |
| `/cases/`, `/cases/<klant>/` | `content/cases/*.yaml` (filter op dienst) |
| `/over-ons/`, `/over-ons/team/` | `content/team/*.yaml` (filter op afdeling) |
| `/werken-bij/`, `/werken-bij/<vacature>/` | `content/vacatures/*.mdoc` |
| `/kennis/`, `/kennis/<artikel>/` | `content/kennis/*.mdoc` |
| `/contact/` | Formulier (zie hieronder) |
| `/privacy/`, `/algemene-voorwaarden/` | `content/paginas/*.mdoc` |

Oude URL's (`/digital-marketing/seo/`, `/blog/...`, `/team/...` enz.) staan in `src/data/redirects.mjs`. Ze worden automatisch als echte 301's in `vercel.json` gezet (bij elke `npm run dev` en `npm run build`, dus commit dat bestand mee) en in `dist/_redirects` voor Netlify/Cloudflare.

## Teksten aanpassen

- **Homepage-kop** ("Wij bouwen je Magento-shop. En we blijven."): Keystatic → *Homepage*, of `src/content/settings/home.yaml` (`heroTitel` en `heroAccent`).
- **Telefoon, adres, KvK, partners, klantnamen**: Keystatic → *Bedrijfsgegevens*. Het KvK-nummer is nog leeg.
- **Dienst toevoegen**: Keystatic → *Diensten* → nieuw. Komt automatisch in menu, footer, overzicht en sitemap.
- **Case toevoegen**: Keystatic → *Cases*. Op de homepage tonen? Voeg hem toe aan *Homepage → Uitgelichte cases*.

## Contactformulier

Het formulier post naar `PUBLIC_FORM_ENDPOINT` (zie `.env.example`), bijvoorbeeld Formspree, Basin of een HubSpot-endpoint. Zonder endpoint verwijst het formulier naar telefoon en e-mail. Op Netlify kun je ook Netlify Forms gebruiken (voeg `data-netlify="true"` toe aan het `<form>` in `src/pages/contact.astro`).

## Hosting en livegang

De build is volledig statisch (`dist/`). De site draait op **Vercel**, gekoppeld aan GitHub: elke push naar `main` gaat automatisch live, elke andere branch krijgt een preview URL.

- Framework preset: Astro (staat al in `vercel.json`)
- Build command: `npm run build`, output: `dist`, Node: 22
- Environment variable in Vercel: `PUBLIC_FORM_ENDPOINT`
- Redirects, trailing slashes en cache headers staan in `vercel.json` (wordt automatisch gegenereerd)
- Keystatic draait alleen lokaal (`npm run dev` → `/keystatic`). Wijzigingen die je daar maakt, commit en push je gewoon. Voor online beheer zonder lokale setup: zet Keystatic op GitHub modus (zie bovenaan `keystatic.config.ts`).

Checklist livegang:

1. `npm run import:wp` gedraaid en content nagelopen
2. KvK en ontbrekende teamfoto's (Loyd, Michelle, Oleksandr) aangevuld
3. Klantquotes en case-afbeeldingen toegevoegd (velden staan klaar in Keystatic)
4. `PUBLIC_FORM_ENDPOINT` ingesteld en getest
5. Analytics/consent toegevoegd (bv. Plausible, of GA4 met consentbanner) in `src/layouts/Base.astro`
6. DNS om, daarna Search Console: sitemap `https://wedigify.nl/sitemap-index.xml` indienen en 404's 4 weken volgen

## Keystatic voor het hele team

Lokaal (`storage: { kind: 'local' }`) schrijft Keystatic direct in de repo. Wil je dat collega's online kunnen publiceren:

1. Zet in `keystatic.config.ts`: `storage: { kind: 'github', repo: 'wedigify/wedigify-website' }`
2. Voeg een adapter toe (`npx astro add netlify` of `cloudflare`) en zet de Keystatic-integratie in `astro.config.mjs` ook in productie aan
3. Volg de GitHub-app-stappen in de [Keystatic-docs](https://keystatic.com/docs/github-mode)

Of gebruik Keystatic Cloud (`kind: 'cloud'`).

## Engels toevoegen

`astro.config.mjs` heeft i18n al ingericht met `nl` als standaard zonder prefix. Voeg `'en'` toe aan `locales`, maak pagina's onder `src/pages/en/` en vertaal de content.
