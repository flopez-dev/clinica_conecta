# Clínica Conecta

Web estática del cliente Clínica Conecta. Astro 7 + Tailwind v4, TypeScript strict.
La home (`/`) es la landing real del negocio; `/v2/`, `/v3/` y `/v4/` son propuestas de diseño
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

- `src/pages/` — rutas del sitio: `index.astro` (home), `v2/`, `v3/`, `v4/` (propuestas), `404.astro`,
  `robots.txt.ts` (dinámico, ver más abajo).
- `src/layouts/Base.astro` — layout único; toda página lo envuelve.
- `src/components/` — `Header.astro`/`Footer.astro`/`WhatsAppFloat.astro` (usados por la home; el
  `Header` pasa de crema a azul al salir del hero `#inicio`, y se queda crema en las páginas sin hero:
  aviso legal, privacidad y 404);
  `v2/`, `v3/`, `v4/` — Header/Footer propios de cada propuesta, no compartidos con la home a propósito
  (`/v2/` y `/v4/` ya no usan Footer: su sección `#contacto` hace de pie; `v2/Footer.astro` queda huérfano)
  (ver [Propuestas de diseño](#propuestas-de-diseño-v2-v3)).
- `src/lib/withBase.ts` — helper obligatorio para enlaces internos (ver abajo).
- `src/styles/global.css` — `@font-face` de las tipografías autoalojadas, tokens de Tailwind v4
  (`@theme`) y reglas de animación, todo en un único fichero (no crear otros `.css`).
- `src/fonts/` — WOFF2 de las cinco familias (subconjunto latino). Viven en `src/`, no en
  `public/`, para que Vite reescriba sus URLs con el base path del despliegue.
- `public/brand/` — logos del cliente. `conecta-logo-300/600.png` es el logo definitivo (kit del
  cliente; sus SVG venían vacíos, por eso PNG), usado en el menú de `/v4/`; `conecta-logo-oscuro-*`
  es una variante para fondo azul generada a partir de ese PNG (azul oscuro → crema), porque el kit
  no la trae. Los `conecta-1b-nodo-*.svg` son el logo anterior, que siguen usando home, `/v2/` y `/v3/`.
- `public/favicon.ico`, `favicon-16/32.png`, `apple-touch-icon.png`, `android-chrome-*.png`,
  `site.webmanifest` — iconos del kit del cliente, para todo el sitio (enlazados en `Base.astro`).
  El manifest usa rutas relativas para que funcione con el base path de GitHub Pages.
- `public/_headers` — cabeceras de seguridad y caché para Cloudflare Workers (GitHub Pages lo
  ignora). `public/.well-known/security.txt` — contacto de seguridad (RFC 9116); su `Expires`
  caduca el 2027-09-20 y hay que renovarlo antes.
- `tests/` — smoke tests de Playwright.

## Reglas no obvias

- **CSP en `public/_headers`: solo `'self'`.** Es lo que hace cumplir la afirmación de
  `/privacidad/` de que no hay peticiones a terceros. Si se añade un recurso externo (fuentes,
  analítica, mapas, vídeo incrustado), ampliar la CSP y actualizar `/privacidad/`.
  `script-src` lleva `'unsafe-inline'` porque Astro incrusta scripts con hash cambiante.
- **`robots.txt.ts` bloquea a los rastreadores de entrenamiento de IA** (GPTBot, ClaudeBot,
  CCBot, Google-Extended…) pero deja pasar a los de búsqueda con IA (OAI-SearchBot,
  ChatGPT-User, PerplexityBot) para que la web pueda citarse. Decisión tomada al preparar el despliegue en Cloudflare.
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
- **Tipografías autoalojadas, nunca `<link>` a Google Fonts.** Al añadir un peso o una familia,
  se descarga el WOFF2 a `src/fonts/` y se declara su `@font-face` en `global.css`. Declararlas
  ahí (y no con `<link>`) hace que el navegador baje solo las familias que la página pinta, y
  evita comunicar la IP de cada visitante a un tercero. La política de privacidad afirma que no
  hay peticiones externas: si eso cambia, hay que actualizar `/privacidad/`.
- El sitio es `lang="es"`: copy, comentarios de código y mensajes de commit en español.
- Prettier ordena las clases de Tailwind automáticamente (`prettier-plugin-tailwindcss`) — no
  reordenarlas a mano, `npm run format` ya lo hace.

## Propuestas de diseño (`/v2/`, `/v3/`, `/v4/`)

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
- Reutiliza sin cambios `Base.astro`, `withBase.ts` y el mecanismo de reveal-al-scroll de
  `global.css` (`.js`, `[data-reveal]`, `[data-reveal-group]`). También reutiliza
  `WhatsAppFloat.astro`: `/v2/` y `/v4/` le pasan la prop opcional `etiqueta="Hablemos"`, que
  añade la burbuja de texto junto al círculo solo desde `sm` (640 px): en móvil es siempre solo
  el círculo, porque la burbuja tapaba el CTA del hero. Sin la prop (home y `/v3/`) es solo el círculo.

`/v4/` no es una dirección visual nueva sino una composición de las otras tres: menú de la home
(con relevo crema→azul al salir del hero), hero con la maquetación de `/v2/`, Servicios de `/v2/`,
formación, tarifas, FAQ y contacto de `/v3/`. Usa solo la pareja tipográfica de la home y no
tiene imagen OG propia (usa la de la home).

**Pendiente de decidir (no es un bug, es un cabo operativo):** qué pasa cuando el cliente elija
una propuesta — si se borran las otras dos (páginas, componentes, bloques de `global.css`, imagen
OG, entrada en el filtro de sitemap) o si se promueve `/v2/`/`/v3/` a `/`. No automatizar esto sin
que se pida explícitamente.

## Ramas y despliegue

| Rama       | Destino                                                |
| :--------- | :------------------------------------------------------ |
| `develop`  | GitHub Pages, bajo `/clinica_conecta/`                  |
| `main`     | Cloudflare Workers, en `juanriccardiconecta.com`, bajo `/` |
| otras / PR | Solo CI (tipos, build, formato, lint, tests)            |

`astro.config.mjs` lee `SITE_URL`/`BASE_PATH` de variables de entorno; cada workflow
pasa las suyas.

## Estado conocido (no son bugs)

- `deploy-cloudflare.yml` falla en el último paso hasta que se añadan los secretos
  `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en GitHub. No lo trates como algo que
  "arreglar" en el código.
- El cliente reside y ejerce en Argentina, y atiende solo online: **no hay consulta física en
  España**. Por eso `/aviso-legal/` y `/privacidad/` no llevan NIF, domicilio profesional ni
  registro sanitario, y en su lugar declaran el lugar de ejercicio. No son huecos por rellenar,
  no los repongas. La política de privacidad se apoya en el art. 3.2 del RGPD (aplica por
  dirigirse a personas en la UE) y en la decisión de adecuación de Argentina (2003/490/CE).
- **En la web no se muestran precios**, por decisión del cliente. El apartado `#tarifas` de la
  home y de `/v2/` dice que hay tarifa individual y de pareja, con la duración y las condiciones,
  y remite a WhatsApp para el importe. No es un hueco por rellenar, no añadas cifras. En `/v3/` y
  `/v4/` no hay apartado propio: Tarifas está fundida en Sesiones (`#como-funciona`), donde el
  botón "Consultar tarifa" (con el icono de WhatsApp) remite a WhatsApp para el importe.
- El dominio del cliente es `juanriccardiconecta.com` y ya está escrito en `wrangler.jsonc`
  (ruta con `custom_domain`) y en `SITE_URL` de `.github/workflows/deploy-cloudflare.yml`. La
  zona ya existe en la cuenta de Cloudflare del cliente; lo único que impide el despliegue son
  los secretos de GitHub de arriba, que son configuración fuera del repo, no código que arreglar.
  Bot Fight Mode y AI Labyrinth también se activan desde el panel de Cloudflare, no desde el repo.

## Antes de dar algo por terminado

Ejecuta `/verificar`, o manualmente:

```
npm run format:check && npm run lint && npm run check
SITE_URL=https://flopez-dev.github.io BASE_PATH=/clinica_conecta/ npm run build
npm run test:e2e
```

El base path de GitHub Pages es el que de verdad ejercita `withBase()`. Es lo mismo que hace
`.github/workflows/ci.yml`.
