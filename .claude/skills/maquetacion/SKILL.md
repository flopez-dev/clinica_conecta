---
name: maquetacion
description: Reglas de maquetación del sitio Clínica Conecta — paleta, ritmo de página, tipografía y accesibilidad. Úsala al crear o modificar cualquier página o componente Astro del sitio.
---

# Maquetación de Clínica Conecta

Reglas visuales del sitio, implícitas en el código existente: la home (`src/pages/index.astro`),
las páginas legales (`src/components/Legal.astro`) y la 404.

## Paleta

- **Marca real, no provisional**: los tonos `navy-900/800/600/300/200/100`, `cream-50`, `gold-400`
  e `ink`, definidos en el `@theme` de `src/styles/global.css`. `navy-300`/`navy-200` son tonos
  claros para texto sobre azul (los usa la sección de contacto). La escala `brand-*` del scaffold
  inicial ya no existe; no usar tampoco la escala `slate` de Tailwind, que no refleja la marca
  real.
- Nunca un color hexadecimal suelto en una clase o en CSS — si hace falta un tono nuevo, añadirlo
  al `@theme`, no inventarlo inline. Excepción explícita ya existente: el verde de marca de
  WhatsApp (`bg-[#25D366]` en `WhatsAppFloat.astro`) — es el color oficial del servicio, no de
  Clínica Conecta, por eso vive fuera del sistema de tokens.

## Tipografía

- Una única pareja: `--font-serif` (Playfair Display, autoalojada en `src/fonts/`) para títulos,
  rótulos y cifras destacadas (`font-serif`), y `--font-sans` (pila de sistema) para el cuerpo,
  que es la que lleva el `body`.
- Para añadir un peso o una familia: WOFF2 en `src/fonts/` + `@font-face` en `global.css` (ver
  `CLAUDE.md`), nunca `<link>` a Google Fonts. No crear ficheros `.css` nuevos.

## Ritmo de página

Patrón de la home (`src/pages/index.astro`), que siguen también las páginas interiores:

- Contenedor: `mx-auto max-w-5xl px-6`. En la home, `px-6` va en la `<section>` y
  `mx-auto max-w-5xl` en el `div` interior, para que el fondo ocupe todo el ancho.
- Secciones de contenido: `py-16 sm:py-20`, alternando `bg-white` y `bg-cream-50`. Hero: fondo
  `bg-navy-800` con `pt-14 pb-20 sm:pt-20 sm:pb-28`.
- Jerarquía de encabezados: `h1` (hero) → `h2` (título de sección) → `h3`/`h4` según haga falta,
  sin saltar niveles.
- Texto de cuerpo sobre fondo claro: `text-ink` (o `text-ink/80`, `text-ink/70` para texto
  secundario); títulos en `text-navy-800`. Nunca por debajo del contraste AA — antes de fijar un
  tono nuevo para texto, comprobarlo con la fórmula de luminancia relativa.
- Enlaces dentro de un texto: subrayado `decoration-gold-400` con `underline-offset-4`; en
  `:hover` pasan a `navy-600` sobre fondo claro y a `cream-50` sobre azul. Anillo de foco visible
  en `gold-400`. En `src/lib/estilo.ts`, `enlace` es la clase completa para fondo claro y `foco`
  el anillo de foco para cualquier enlace o botón.

## Animación

- Curva en `global.css`: `--ease-out` (entradas e interacciones); en los componentes, la
  constante `curva` de `src/lib/estilo.ts` (enlaces y sección de contacto). Reutilizarlas, no
  inventar `cubic-bezier()` sueltos.
- Antes de añadir cualquier animación, pasar por la puerta de frecuencia/propósito de la skill
  `animate`: solo `transform`/`opacity`, respetar `prefers-reduced-motion`, y que el contenido siga
  siendo visible sin JS (mecanismo ya existente: reglas de reveal en `global.css` +
  `Revelar.astro`).

## Accesibilidad

- Un único `h1` por página; jerarquía de encabezados sin saltos.
- Contraste mínimo AA en todo texto — comprobarlo, no darlo por hecho con tonos nuevos.
- Estados de foco visibles en todo elemento interactivo (no quitar el `outline` por defecto
  sin sustituirlo; `foco` de `src/lib/estilo.ts` ya lo resuelve).
- `alt` descriptivo en toda imagen real (`<img>`); un placeholder de foto es un `<div>` con texto
  visible, no un `<img>` con `alt` inventado.
- `lang="es"` ya fijado en `Base.astro`, no lo dupliques.

## Prohibido

- Crear `tailwind.config.js` — Tailwind v4 se configura en `@theme`.
- Añadir librerías de componentes o CSS (Bootstrap, MUI, etc.) o frameworks de iconos sin que se
  pida explícitamente — los iconos del sitio son SVG inline a mano (ver `WhatsAppFloat.astro`,
  los trazados de Phosphor de `src/lib/contacto.ts` y los iconos de servicios y apartados de
  `src/pages/index.astro`).
- CSS global fuera de `src/styles/global.css`.
- Reordenar clases de Tailwind a mano — `npm run format` (Prettier + `prettier-plugin-tailwindcss`)
  ya las ordena.
