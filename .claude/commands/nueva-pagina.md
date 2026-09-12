---
description: Crea una página nueva en src/pages/ siguiendo el patrón del sitio
argument-hint: <ruta> <título>
---

Argumentos: `$ARGUMENTS` — el primero es la ruta (p. ej. `contacto` o `servicios/dental`),
el resto es el título de la página (puede tener espacios).

Crea `src/pages/<ruta>.astro` siguiendo exactamente el patrón de `src/pages/index.astro`:

- Importa y usa `Base`, `Header` y `Footer` (`src/layouts/Base.astro`,
  `src/components/Header.astro`, `src/components/Footer.astro`).
- Pasa a `<Base>` un `title` (usando el título dado, sufijado con " — Clínica Conecta" si
  no lo lleva ya) y una `description` breve y real en español — no un placeholder vacío.
- Cualquier `href`/`src` interno pasa por `withBase()` (`src/lib/withBase.ts`), nunca una
  ruta literal.
- Sigue las reglas de maquetación de la skill `maquetacion` para el ritmo de página,
  tipografía y paleta (contenedor `mx-auto max-w-5xl px-6`, tokens `brand-*`/`slate`, etc.).
- Copy en español; contenido real si se conoce, o un placeholder claro ("Próximamente.")
  si no.

Al terminar, ejecuta `npm run check` para confirmar que no hay errores de tipos.
