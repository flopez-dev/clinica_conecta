---
name: maquetacion
description: Reglas de maquetación del sitio Clínica Conecta — paleta, ritmo de página, tipografía y accesibilidad. Úsala al crear o modificar cualquier página o componente Astro del sitio.
---

# Maquetación de Clínica Conecta

Reglas visuales del sitio, implícitas en el código existente. El sitio tiene una home (`/`) y dos
propuestas de diseño alternativas (`/v2/`, `/v3/`, ver `CLAUDE.md`) — cada una tiene su propia
paleta/tipografía dentro de la misma familia de marca, así que estas reglas distinguen lo que es
común a las tres de lo que es propio de cada una.

## Paleta

- **Marca real, no provisional**: los tonos `navy-900/800/600/300/200/100`, `cream-50`, `gold-400`
  e `ink`, definidos en el `@theme` de `src/styles/global.css`. `navy-300`/`navy-200` vienen del
  logo real (`public/brand/`) — son los tonos de su variante para fondo oscuro. No usar `brand-*`
  ni la escala `slate` de Tailwind — son del scaffold inicial y no reflejan la marca real.
- Nunca un color hexadecimal suelto en una clase o en CSS — si hace falta un tono nuevo, añadirlo
  al `@theme`, no inventarlo inline. Excepción explícita ya existente: el verde de marca de
  WhatsApp (`bg-[#25D366]` en `WhatsAppFloat.astro`) — es el color oficial del servicio, no de
  Clínica Conecta, por eso vive fuera del sistema de tokens.
- `/v2/` y `/v3/` añaden su propia pareja tipográfica namespaced en el mismo `@theme`
  (`--font-v2-serif`/`--font-v2-sans`, `--font-v3-display`/`--font-v3-sans`) — mismo mecanismo,
  no crear ficheros `.css` nuevos por propuesta.

## Ritmo de página

Patrón común a las tres versiones (cada una con su propia composición, ver sus páginas):

- Contenedor: `mx-auto max-w-5xl px-6`.
- Secciones de contenido: `py-16`–`py-20`. Hero / sección principal: `py-24`–`py-28`.
- Jerarquía de encabezados: `h1` (hero) → `h2` (título de sección) → `h3`/`h4` según haga falta,
  sin saltar niveles.
- Texto de cuerpo sobre fondo claro: `text-ink` o `text-navy-900`, nunca por debajo del contraste
  AA — antes de fijar un tono nuevo para texto, comprobarlo con la fórmula de luminancia relativa
  (ver ejemplos ya calculados en los comentarios de `global.css` y en el historial de la rama).
- Enlaces de acción: subrayado + color de acento (`navy-600`/`gold-400` según la propuesta),
  variando de tono en `:hover`.

## Animación

- Curvas en `global.css`: `--ease-out` (entradas/interacciones), `--ease-in-out` (movimiento en
  pantalla) — reutilizarlas, no inventar `cubic-bezier()` sueltos.
- Antes de añadir cualquier animación, pasar por la puerta de frecuencia/propósito de la skill
  `animate`: solo `transform`/`opacity`, respetar `prefers-reduced-motion`, y que el contenido siga
  siendo visible sin JS (mecanismo `.js [data-reveal]` ya existente en `global.css` +
  `Base.astro`).

## Accesibilidad

- Un único `h1` por página; jerarquía de encabezados sin saltos.
- Contraste mínimo AA en todo texto — comprobarlo, no darlo por hecho con tonos nuevos.
- Estados de foco visibles en todo elemento interactivo (no quitar el `outline` por defecto
  sin sustituirlo).
- `alt` descriptivo en toda imagen real (`<img>`); los placeholders de foto (sin foto real
  todavía) son `<div>` con texto visible, no `<img>` con `alt` inventado.
- `lang="es"` ya fijado en `Base.astro`, no lo dupliques.

## Prohibido

- Crear `tailwind.config.js` — Tailwind v4 se configura en `@theme`.
- Añadir librerías de componentes o CSS (Bootstrap, MUI, etc.) o frameworks de iconos sin que se
  pida explícitamente — los iconos del sitio son SVG inline a mano (ver `WhatsAppFloat.astro` y los
  iconos de servicios/redes sociales de `/v2/`, `/v3/`).
- CSS global fuera de `src/styles/global.css`.
- Reordenar clases de Tailwind a mano — `npm run format` (Prettier + `prettier-plugin-tailwindcss`)
  ya las ordena.
