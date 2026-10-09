// 301-redirects van de oude WordPress-site (wedigify.nl, sitemap okt. 2026) naar de nieuwe structuur.
// URL's die gelijk blijven (/magento/hyva/, /contact/, /cases/ ...) staan hier niet in.

/** Blogartikelen die naar /kennis/ verhuizen (zelfde slug). Importeer ze met `npm run import:wp`. */
const kennisSlugs = [
  'magento-consultancy-door-wedigify-strategie-succes-voor-jouw-magento-webshop',
  'over-optimalisatie-van-processen-in-softwareontwikkeling',
  'het-belang-van-een-businesscase-en-kpis-voor-e-commerce-succes',
  'composable-commerce-het-buzzwoord-waar-menig-ondernemer-en-e-commerce-manager-fomo-van-krijgt',
  'het-belang-van-magento-support-voor-jouw-e-commerce-succes',
  'de-transformatie-van-e-commerce-door-ai-kansen-en-uitdagingen',
  'maar-hoe-zet-je-social-media-succesvol-in-voor-jouw-bedrijf-wij-helpen-je-op-weg',
  'magento-webshop-laten-maken-een-slimme-investering-voor-jouw-e-commerce-succes',
  'magento-vs-shopify-welk-platform-past-het-beste-bij-jouw-bedrijf',
  'de-ultieme-gids-voor-magento-2-migratie-voordelen-en-best-practices',
  'alles-wat-je-moet-weten-over-googles-helpful-content-update',
  'google-analytics-4-alles-wat-je-moet-weten',
  'zo-zet-je-google-search-console-in-om-seo-te-verbeteren',
  'generative-ai-praktische-toepassingen-binnen-e-commerce',
  'hyperpersonalisatie-in-e-commerce-voorbij-de-voornaam-in-je-nieuwsbrief',
  'onmisbare-automated-e-mail-flows-voor-je-webshop',
  'van-idee-tot-gold-partner-het-verhaal-van-wedigify',
];

/** Case-artikelen op /blog/ die nu een eigen casepagina hebben. */
const caseRedirects = {
  'budgetplan-van-dalende-omzet-naar-structurele-groei-in-6-weken': 'budgetplan',
  'hyva-launch-voor-tacstack-van-design-tot-livegang-in-8-weken': 'tacstack',
  'slim-besparen-zonder-in-te-leveren-de-succesvolle-migratie-van-krale-naar-magento-open-source': 'krale',
  'krales-successful-migration-to-magento-open-source': 'krale',
  'persoonlijk-stijlvol-en-uniek-de-custom-graveermodule-van-zinzi': 'zinzi',
  'slimmer-sneller-stijlvoller-de-hyva-launch-van-uv-fashions': 'uv-fashions',
  'slim-groeien-met-seo-cro-de-hefboomstrategie-voor-greenfield-fashion': 'greenfield-fashion',
  'strategisch-optimaliseren-met-resultaat-de-succesvolle-samenwerking-tussen-shuz-wedigify': 'shuz',
  'domeinmigratie-voor-de-bommel-van-debommelmeubelen-nl-naar-bommelwonen-nl': 'de-bommel',
};

const teamSlugs = [
  'patrick', 'marc', 'dmytro', 'pavel', 'oleksandr', 'oleksandr-2', 'anastasiia', 'marina',
  'jay', 'mike', 'iris', 'ievgenii', 'wouter', 'michelle', 'loyd', 'giulia',
];

/** @type {Record<string, string>} */
export const redirects = {
  // Pagina's
  '/magento-webshop/': '/magento/',
  '/magento/development/': '/magento/webshop-laten-maken/',
  '/wp-content/uploads/2026/06/Wedigify-B.V.-Algemene-Voorwaarden-NL-2026.pdf': '/documenten/wedigify-algemene-voorwaarden-2026.pdf',
  '/services/': '/magento/',
  '/support/': '/magento/support/',
  '/feature-audit/': '/magento/migraties/',
  '/feature-check/': '/magento/migraties/',
  '/aca-shopify-koppeling/': '/magento/integraties/',
  '/digital-marketing/': '/groei/',
  '/digital-marketing/seo/': '/groei/seo/',
  '/digital-marketing/sea/': '/groei/sea/',
  '/digital-marketing/social-advertising/': '/groei/social-advertising/',
  '/digital-marketing/e-mailmarketing/': '/groei/e-mailmarketing/',
  '/digital-marketing/marketing-automation/': '/groei/e-mailmarketing/',
  '/digital-marketing/conversie-optimalisatie-cro/': '/groei/cro/',
  '/digital-marketing/content-creatie/': '/groei/content/',
  '/strategie-en-data/': '/groei/strategie-data/',
  '/artificial-intelligence-ai/': '/groei/ai/',
  '/onze-werkwijze/': '/aanpak/',
  '/waarom-wedigify/': '/over-ons/',
  '/team/': '/over-ons/team/',
  '/privacy-policy/': '/privacy/',
  '/blog/': '/kennis/',
  '/blog/category/blog/': '/kennis/',
  '/blog/category/case-studies/': '/cases/',
  '/blog/author/admin/': '/kennis/',
  '/blog/wedigify-bekroond-met-fonk150-award-erkenning-voor-creativiteit-impact-en-klanttevredenheid/': '/over-ons/',
  '/blog/conversie-optimalisatie-in-2024-zo-haal-je-meer-uit-je-webshop/': '/kennis/conversie-optimalisatie-webshop/',
  '/kennis/conversie-optimalisatie-in-2024-zo-haal-je-meer-uit-je-webshop/': '/kennis/conversie-optimalisatie-webshop/',
  '/blog/met-deze-acht-tips-adverteer-je-succesvol-op-facebook/': '/kennis/webshop-lanceren-7-tips/',
  '/kennis/met-deze-acht-tips-adverteer-je-succesvol-op-facebook/': '/kennis/webshop-lanceren-7-tips/',
  ...Object.fromEntries(teamSlugs.map((s) => [`/team/${s}/`, '/over-ons/team/'])),
  ...Object.fromEntries(kennisSlugs.map((s) => [`/blog/${s}/`, `/kennis/${s}/`])),
  ...Object.fromEntries(Object.entries(caseRedirects).map(([from, to]) => [`/blog/${from}/`, `/cases/${to}/`])),
};
