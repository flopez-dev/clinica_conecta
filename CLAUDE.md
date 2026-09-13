# Clínica Conecta

Web estática del cliente Clínica Conecta. Astro 7 + Tailwind v4, TypeScript strict.
La home (`/`) es la landing real del negocio; `/v2/` y `/v3/` son propuestas de diseño
alternativas para que el cliente elija (ver [Propuestas de diseño](#propuestas-de-diseño-v2-v3)).

## Comandos

| Comando              | Acción                                                                |
| :------------------- | :--------------------------------------------------------------------- |
| `npm run dev`         | Servidor de desarrollo en `localhost:4321` (arráncalo en background) |
| `npm run build`       | Build de producción en `./dist/`                                     |
| `npm run preview`     | Sirve localmente el build de producción                              |
| `npm run check`       | Comprueba tipos con `astro check`                                     |
| `npm run format`      | Formatea el repo con Prettier (`--write`)                            |
| `npm run format:check`| Comprueba formato sin escribir — es lo que corre en CI                |
| `npm run lint`        | ESLint sobre `.astro`/`.ts`                                           |
| `npm run test:e2e`    | Smoke tests de Playwright (`tests/smoke.spec.ts`)                     |

## Estructura

- `src/pages/` — rutas del sitio: `index.astro` (home), `v2/`, `v3/` (propuestas), `404.astro`,
  `robots.txt.ts` (dinámico, ver más abajo).
- `src/layouts/Base.astro` — layout único; toda página lo envuelve.
- `src/components/` — `Header.astro`/`Footer.astro`/`WhatsAppFloat.astro` (usados por la home);
  `v2/`, `v3/` — Header/Footer propios de cada propuesta, no compartidos con la home a propósito
  (ver [Propuestas de diseño](#propuestas-de-diseño-v2-v3)).
- `src/lib/withBase.ts` — helper obligatorio para enlaces internos (ver abajo).
- `src/styles/global.css` — tokens de Tailwind v4 (`@theme`) y reglas de animación, todo en un
  único fichero (no crear otros `.css`).
- `public/brand/` — logo real del cliente (SVG, variantes claro/oscuro/icono/horizontal/apilado),
  usado hoy solo en `/v3/`.
- `tests/` — smoke tests de Playwright.

## Reglas no obvias

- **`withBase()` en todo `href`/`src` interno escrito a mano** (`src/lib/withBase.ts`).
  Astro solo antepone `base` a los assets que él mismo empaqueta, no a rutas literales —
  un `href="/contacto/"` a pelo se rompe en uno de los dos destinos de despliegue (ver
  más abajo). Patrón de uso en `src/components/Header.astro` y `src/pages/404.astro`.
- Toda página se envuelve en `<Base title="…" description="…">` — ambas props son
  obligatorias. Usa `noindex` para páginas que no deben indexarse (`/v2/`, `/v3/`, `404.astro`).
- Tailwind v4 **sin** `tailwind.config.js`: los tokens viven en `@theme` de `src/styles/global.css`.
  No crear un config JS. Paleta de marca real: `navy-900/800/600/300/200/100`, `cream-50`,
  `gold-400`, `ink` (ver `public/brand/` para el origen de los tonos `navy-300`/`navy-200`, sacados
  del logo). `v2/index.astro` y `v3/index.astro` añaden su propia pareja tipográfica namespaced
  (`--font-v2-*`, `--font-v3-*`) en el mismo fichero — no crear ficheros CSS nuevos.
- `trailingSlash: 'always'` + `build.format: 'directory'` (`astro.config.mjs`): los
  enlaces internos llevan barra final.
- El sitio es `lang="es"`: copy, comentarios de código y mensajes de commit en español.
- Prettier ordena las clases de Tailwind automáticamente (`prettier-plugin-tailwindcss`) — no
  reordenarlas a mano, `npm run format` ya lo hace.

## Propuestas de diseño (`/v2/`, `/v3/`)

`/` es la landing original; `/v2/` y `/v3/` son direcciones visuales alternativas del mismo
contenido factual, pensadas para que el cliente compare y elija antes de que el sitio se
considere terminado. Cada propuesta:

- Tiene su propio `Header`/`Footer` (`src/components/v2/`, `src/components/v3/`) — deliberadamente
  no comparten componente con la home, para no arrastrar los cambios de una al diseño de otra
  mientras compiten.
- Lleva `noindex` en `<Base>` y está excluida del sitemap (filtro en `astro.config.mjs`) — son
  comparativas internas, no páginas públicas todavía.
- Tiene su propia imagen OG (`public/og-image-v2.png`, `public/og-image-v3.png`) y su propio
  bloque `jsonLd` en el frontmatter de la página.
- Reutiliza sin cambios `Base.astro`, `WhatsAppFloat.astro`, `withBase.ts` y el mecanismo de
  reveal-al-scroll de `global.css` (`.js`, `[data-reveal]`, `[data-reveal-group]`).

**Pendiente de decidir (no es un bug, es un cabo operativo):** qué pasa cuando el cliente elija
una propuesta — si se borran las otras dos (páginas, componentes, bloques de `global.css`, imagen
OG, entrada en el filtro de sitemap) o si se promueve `/v2/`/`/v3/` a `/`. No automatizar esto sin
que se pida explícitamente.

## Ramas y despliegue

| Rama       | Destino                                                |
| :--------- | :------------------------------------------------------ |
| `develop`  | GitHub Pages, bajo `/clinica_conecta/`                  |
| `main`     | Cloudflare Workers, bajo `/`                            |
| otras / PR | Solo CI (tipos, build, formato, lint, tests)            |

`astro.config.mjs` lee `SITE_URL`/`BASE_PATH` de variables de entorno; cada workflow
pasa las suyas.

## Estado conocido (no son bugs)

- `deploy-cloudflare.yml` falla en el último paso hasta que se añadan los secretos
  `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en GitHub. No lo trates como algo que
  "arreglar" en el código.
- El dominio propio del cliente está pendiente — hay TODOs en
  `.github/workflows/deploy-cloudflare.yml` y `wrangler.jsonc` para cuando exista.

## Antes de dar algo por terminado

Ejecuta `/verificar`, o manualmente:

```
npm run format:check && npm run lint && npm run check
SITE_URL=https://flopez-dev.github.io BASE_PATH=/clinica_conecta/ npm run build
npm run test:e2e
```

El base path de GitHub Pages es el que de verdad ejercita `withBase()`. Es lo mismo que hace
`.github/workflows/ci.yml`.
