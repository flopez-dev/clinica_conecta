# Clínica Conecta

Web estática del cliente Clínica Conecta. Astro 7 + Tailwind v4, TypeScript strict.
La home (`/`) es la landing del negocio; además hay dos páginas legales (`/aviso-legal/`,
`/privacidad/`) y la 404.

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

- `src/pages/` — rutas del sitio: `index.astro` (home), `aviso-legal.astro` y `privacidad.astro`
  (páginas legales, ver abajo), `404.astro` y `robots.txt.ts` (dinámico, ver más abajo).
- `src/layouts/Base.astro` — layout único; toda página lo envuelve.
- `src/components/`:
  - `Header.astro` — menú del sitio. Crema sobre el hero azul `#inicio`; cuando el hero sale de
    pantalla, un script le añade `.is-solid` y pasa a azul (`navy-800`). En una página sin
    `#inicio` se queda crema. Sus enlaces son `withBase('/')` + `#apartado`: desde la home hacen
    scroll y desde las demás páginas llevan a la home. Logo con `srcset`: `conecta-logo-*.png` en
    el estado crema y `conecta-logo-oscuro-*.png` en el azul.
  - `Cabecera.astro` — bloque azul de cabecera de las páginas interiores (legales y 404). Lleva
    `id="inicio"` para que el `Header` haga el relevo crema→azul; pinta un rótulo dorado en
    mayúsculas (prop `rotulo`), el `h1` (prop `titulo`) y un slot para lo que va debajo. La usan
    `Legal.astro` y `404.astro`.
  - `Contacto.astro` — la sección `#contacto`, que hace de pie del sitio (tarjeta «Hablemos»,
    redes, texto legal, enlaces a aviso legal y privacidad, copyright). Sus bloques llevan
    `data-reveal-contacto`: toda página que la incluya necesita también `<Revelar />`, o esos
    bloques se quedan invisibles con JS activo.
  - `Revelar.astro` — script de reveal-al-scroll: marca con `data-visible` los `[data-reveal]`,
    `[data-reveal-group]` y `[data-reveal-contacto]` al entrar en pantalla. Con movimiento
    reducido no hace nada y el CSS los deja visibles.
  - `Legal.astro`, `Apartado.astro` y `ListaDatos.astro` — montan las páginas legales.
  - `WhatsAppFloat.astro` — botón flotante de WhatsApp, sin props (toma `whatsappHref` de
    `src/lib/contacto.ts`). La burbuja «Hablemos» junto al círculo solo aparece desde `sm`
    (640 px): en móvil tapaba el CTA del hero. Solo lo usa la home.
- **Páginas legales** (`aviso-legal.astro`, `privacidad.astro`): las monta `Legal.astro` —
  `Header`, `Cabecera`, índice de apartados (fijo en escritorio, con el apartado en curso
  marcado), el contenido, «Volver al inicio», `Contacto` y `Revelar`. Cada página declara sus
  apartados con `numerar()` (`src/lib/apartados.ts`): de esa lista salen el índice y los títulos.
  Si cambia el texto, actualizar su constante `actualizado`.
- `src/lib/withBase.ts` — helper obligatorio para enlaces internos (ver abajo).
- `src/lib/contacto.ts` — fuente única de los datos de contacto: `telefono`, `telefonoLegible`,
  `correo`, las URL de WhatsApp con sus mensajes precargados (`whatsappHref`, `llamadaHref`,
  `tarifaHref`, `whatsappPerfilHref`), `mailtoHref`, las redes con los trazados de sus iconos de
  Phosphor (`redes`) y `buscadorProfesionalesHref`. `src/lib/estilo.ts` — `curva`, `foco` y la
  clase `enlace` para enlaces dentro de un texto. `src/lib/apartados.ts` — `numerar()`.
- `src/styles/global.css` — `@font-face` de la tipografía autoalojada, tokens de Tailwind v4
  (`@theme`), la entrada del hero (`.animate-hero-in`), las reglas de reveal (`[data-reveal]`,
  `[data-reveal-group]`, `[data-reveal-contacto]`), `.retrato-organico` (el radio asimétrico del
  retrato del hero) y la regla de movimiento reducido de `#menu-mobile`; todo en un único
  fichero (no crear otros `.css`).
- `src/fonts/` — `playfair-display.woff2`, la única familia autoalojada (subconjunto latino).
  Vive en `src/`, no en `public/`, para que Vite reescriba su URL con el base path del
  despliegue.
- `public/brand/` — logo del cliente, en PNG: `conecta-logo-300/600.png` (del kit del
  cliente; sus SVG venían vacíos, por eso PNG) y `conecta-logo-oscuro-300/600.png`, variante para
  fondo azul generada a partir de ese PNG (azul oscuro → crema), porque el kit no la trae.
- `public/foto/juan-ignacio-cuadrada.webp` — retrato del hero. `public/og-image.png` — la imagen
  OG de todas las páginas (la pone `Base.astro`).
- `public/favicon.ico`, `favicon-16/32.png`, `apple-touch-icon.png`, `android-chrome-*.png`,
  `site.webmanifest` — iconos del kit del cliente, para todo el sitio (enlazados en `Base.astro`).
  El manifest usa rutas relativas para que funcione con el base path de GitHub Pages.
- `public/_headers` — cabeceras de seguridad y caché para Cloudflare Workers (GitHub Pages lo
  ignora). `public/.well-known/security.txt` — contacto de seguridad (RFC 9116); su `Expires`
  caduca el 2027-09-20 y hay que renovarlo antes.
- `tests/smoke.spec.ts` — smoke tests de Playwright: en `/`, `/aviso-legal/` y `/privacidad/`
  comprueban un único `h1`, que no haya errores de consola ni desbordamiento horizontal, y el
  menú móvil; además, que las páginas legales enlazan a la home, y la 404.

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
  más abajo). Patrón de uso en `src/components/Header.astro` y `src/components/Legal.astro`.
- Toda página se envuelve en `<Base title="…" description="…">` — ambas props son
  obligatorias. `noindex` solo lo lleva `404.astro`. El sitemap (`sitemap()` en
  `astro.config.mjs`) deja fuera la 404 por su cuenta.
- Tailwind v4 **sin** `tailwind.config.js`: los tokens viven en `@theme` de `src/styles/global.css`.
  No crear un config JS. Paleta de marca real: `navy-900/800/600/300/200/100`, `cream-50`,
  `gold-400`, `ink`; `navy-300`/`navy-200` son tonos claros para texto sobre azul (los usa la
  sección de contacto). Tipografía: `--font-serif` (Playfair Display) para títulos y
  `--font-sans` (pila de sistema) para el cuerpo.
- `trailingSlash: 'always'` + `build.format: 'directory'` (`astro.config.mjs`): los
  enlaces internos llevan barra final.
- **Tipografías autoalojadas, nunca `<link>` a Google Fonts.** La única familia web, Playfair
  Display, se sirve desde `src/fonts/` con su `@font-face` en `global.css`; el cuerpo usa la pila
  de sistema y no descarga nada. Al añadir un peso o una familia, se descarga el WOFF2 a
  `src/fonts/` y se declara su `@font-face` en `global.css`. Declararla ahí (y no con `<link>`)
  hace que el navegador baje solo lo que la página pinta, y evita comunicar la IP de cada
  visitante a un tercero. La política de privacidad afirma que no hay peticiones externas: si
  eso cambia, hay que actualizar `/privacidad/`.
- El sitio es `lang="es"`: copy, comentarios de código y mensajes de commit en español.
- Prettier ordena las clases de Tailwind automáticamente (`prettier-plugin-tailwindcss`) — no
  reordenarlas a mano, `npm run format` ya lo hace.

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
- **En la web no se muestran precios**, por decisión del cliente. El bloque «Condiciones del
  servicio» de Sesiones (`#como-funciona`) lleva el botón "Consultar tarifa" (con el icono de
  WhatsApp), que remite a WhatsApp para el importe. No es un hueco por rellenar, no añadas
  cifras.
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
