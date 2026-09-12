// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The site is published on GitHub Pages today, under /clinica_conecta/, so that
// is the default here — dev matches the preview the client sees. The Cloudflare
// workflow overrides both once there is a domain: SITE_URL=<worker o dominio>
// BASE_PATH=/
const site = process.env.SITE_URL ?? 'https://flopez-dev.github.io';
const base = process.env.BASE_PATH ?? '/clinica_conecta/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },

  integrations: [
    sitemap({
      // /v1/ y /v2/ son propuestas de comparación para el cliente (noindex),
      // no rutas públicas — fuera del sitemap además de fuera del índice.
      filter: (page) => !/\/v[12]\/$/.test(page),
    }),
  ],

  vite: { plugins: [tailwindcss()] },
});
