// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // TODO: set real domain once decided (see docs/DECISIONS.md Open/Deferred)

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});