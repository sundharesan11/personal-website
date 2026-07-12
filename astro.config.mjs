// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // TODO: set real domain once decided (see docs/DECISIONS.md Open/Deferred)

  // /ambitions was an orphaned duplicate of /to; one canonical route now.
  redirects: {
    '/ambitions': '/to'
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});