// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

const pagesBase = process.env.SITE_BASE?.replace(/^\/+|\/+$/g, '');
const base = pagesBase ? `/${pagesBase}` : undefined;
const routeWithBase = (path) => `${base ?? ''}${path}`;

// https://astro.build/config
export default defineConfig({
  site: 'https://sundharesan11.github.io',
  base,

  // /ambitions was an orphaned duplicate of /to; one canonical route now.
  redirects: {
    '/ambitions': routeWithBase('/to')
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});
