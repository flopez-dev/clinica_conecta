---
name: maquetacion
description: Reglas de maquetación del sitio Clínica Conecta — paleta, ritmo de página, tipografía y accesibilidad. Úsala al crear o modificar cualquier página o componente Astro del sitio.
---

# Maquetación de Clínica Conecta

Reglas visuales del sitio, hoy solo implícitas en el código existente
(`src/pages/index.astro`, `src/components/Header.astro`, `src/styles/global.css`).
Mantenerlas explícitas evita que cada página nueva reinvente la maquetación.

## Paleta

- Solo los tokens `brand-*` definidos en el `@theme` de `src/styles/global.css`
  (`brand-50`, `brand-100`, `brand-500`, `brand-600`, `brand-700`) y la escala `slate` de
  Tailwind. Nunca un color hexadecimal suelto en una clase o en CSS.
- Los `brand-*` son provisionales hasta que llegue la identidad visual definitiva del
  cliente — si hace falta un tono nuevo, añádelo al `@theme`, no lo inventes inline.

## Ritmo de página

Patrón ya establecido en `src/pages/index.astro`:

- Contenedor: `mx-auto max-w-5xl px-6`.
- Secciones de contenido: `py-16`. Hero / sección principal: `py-24`.
- `h1`: `text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl`.
- `h2` (títulos de sección): `text-2xl font-semibold text-slate-900`.
- Texto de cuerpo: `text-slate-600`, con `mt-2` o `mt-4` respecto al título.
- Enlaces de acción: `text-brand-600 underline` o `hover:text-brand-600` según contexto
  (ver `src/components/Header.astro` y `src/pages/404.astro`).

## Accesibilidad

- Un único `h1` por página; jerarquía de encabezados sin saltos (no pasar de `h1` a `h4`).
- Contraste mínimo AA — los pares `slate-900`/`slate-600` sobre blanco ya lo cumplen; no
  aclarar el texto de cuerpo por debajo de `slate-500`.
- Estados de foco visibles en todo elemento interactivo (no quitar el `outline` por defecto
  sin sustituirlo).
- `alt` descriptivo en toda imagen; `lang="es"` ya fijado en `Base.astro`, no lo dupliques.

## Prohibido

- Crear `tailwind.config.js` — Tailwind v4 se configura en `@theme`.
- Añadir librerías de componentes o CSS (Bootstrap, MUI, etc.) o frameworks de iconos sin
  que se pida explícitamente.
- CSS global fuera de `src/styles/global.css`.
