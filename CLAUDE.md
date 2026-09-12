# Clínica Conecta

Web estática del cliente Clínica Conecta. Astro 7 + Tailwind v4, TypeScript strict.
Contenido todavía provisional (ver `src/pages/index.astro`).

## Comandos

| Comando           | Acción                                                |
| :---------------- | :----------------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo en `localhost:4321` (arráncalo en background) |
| `npm run build`    | Build de producción en `./dist/`                      |
| `npm run preview`  | Sirve localmente el build de producción                |
| `npm run check`    | Comprueba tipos con `astro check`                       |

## Estructura

- `src/pages/` — rutas del sitio.
- `src/layouts/Base.astro` — layout único; toda página lo envuelve.
- `src/components/` — `Header.astro`, `Footer.astro`.
- `src/lib/withBase.ts` — helper obligatorio para enlaces internos (ver abajo).
- `src/styles/global.css` — tokens de Tailwind v4 (`@theme`).

## Reglas no obvias

- **`withBase()` en todo `href`/`src` interno escrito a mano** (`src/lib/withBase.ts`).
  Astro solo antepone `base` a los assets que él mismo empaqueta, no a rutas literales —
  un `href="/contacto/"` a pelo se rompe en uno de los dos destinos de despliegue (ver
  más abajo). Patrón de uso en `src/components/Header.astro` y `src/pages/404.astro`.
- Toda página se envuelve en `<Base title="…" description="…">` — ambas props son
  obligatorias. Usa `noindex` para páginas que no deben indexarse (ver `src/pages/404.astro`).
- Tailwind v4 **sin** `tailwind.config.js`: los tokens (colores `brand-*`, fuente) viven
  en el bloque `@theme` de `src/styles/global.css`. No crear un config JS. Los `brand-*`
  son provisionales hasta que llegue la identidad visual definitiva del cliente.
- `trailingSlash: 'always'` + `build.format: 'directory'` (`astro.config.mjs`): los
  enlaces internos llevan barra final.
- El sitio es `lang="es"`: copy, comentarios de código y mensajes de commit en español.

## Ramas y despliegue

| Rama       | Destino                                                |
| :--------- | :------------------------------------------------------ |
| `develop`  | GitHub Pages, bajo `/clinica_conecta/`                  |
| `main`     | Cloudflare Workers, bajo `/`                            |
| otras / PR | Solo CI (tipos + build)                                 |

`astro.config.mjs` lee `SITE_URL`/`BASE_PATH` de variables de entorno; cada workflow
pasa las suyas.

## Estado conocido (no son bugs)

- `deploy-cloudflare.yml` falla en el último paso hasta que se añadan los secretos
  `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en GitHub. No lo trates como algo que
  "arreglar" en el código.
- El dominio propio del cliente está pendiente — hay TODOs en
  `.github/workflows/deploy-cloudflare.yml` y `wrangler.jsonc` para cuando exista.

## Antes de dar algo por terminado

Ejecuta `/verificar` (o manualmente `npm run check` y luego `npm run build` con
`SITE_URL=https://flopez-dev.github.io BASE_PATH=/clinica_conecta/`) — es el base path
que de verdad ejercita `withBase()`, y es lo mismo que hace `.github/workflows/ci.yml`.
