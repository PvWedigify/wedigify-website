import { defineMarkdocConfig, nodes, component } from '@astrojs/markdoc/config';

// De paginatitel is altijd de enige <h1> (uit de template). Een "# kop" in de
// content wordt daarom als <h2> gerenderd, zodat elke pagina precies één H1 heeft.
export default defineMarkdocConfig({
  nodes: {
    heading: {
      ...nodes.heading,
      render: component('./src/components/MarkdocKop.astro'),
    },
  },
});
