const BASE = import.meta.env.BASE_URL;

/**
 * Every enlace interno pasa por aquí. Astro antepone `base` a los assets que
 * empaqueta pero no a los `href`/`src` escritos a mano, y el sitio se sirve
 * bajo /clinica_conecta/ en GitHub Pages (y bajo / en Cloudflare) — un
 * "/contacto/" a pelo se rompería en uno de los dos destinos.
 */
export function withBase(pathname = ''): string {
  return `${BASE.replace(/\/$/, '')}/${String(pathname).replace(/^\//, '')}`;
}
