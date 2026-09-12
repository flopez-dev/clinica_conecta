import type { APIRoute } from 'astro';
import { withBase } from '../lib/withBase';

/**
 * Generado en build en vez de vivir en public/ porque la URL del sitemap
 * depende de SITE_URL/BASE_PATH, que cambian entre GitHub Pages y
 * Cloudflare (ver astro.config.mjs) — un robots.txt estático no podría
 * apuntar al sitemap correcto en los dos destinos a la vez.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL(withBase('/sitemap-index.xml'), site);

  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
