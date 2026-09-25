---
description: Crea una página nueva en src/pages/ siguiendo el patrón del sitio
argument-hint: <ruta> <título>
---

Argumentos: `$ARGUMENTS` — el primero es la ruta (p. ej. `contacto` o `recursos/ansiedad`),
el resto es el título de la página (puede tener espacios).

Crea `src/pages/<ruta>.astro` siguiendo el patrón de las páginas interiores
(`src/pages/404.astro`, o `src/components/Legal.astro` para ver uno más completo):

- Envuelve todo en `<Base>` (`src/layouts/Base.astro`) con un `title` (el título dado, sufijado
  con " · Clínica Conecta" si no lo lleva ya, como las páginas legales) y una `description`
  breve y real en español — no un placeholder vacío. Sin `noindex`: solo lo lleva la 404.
- Los imports son relativos a la ruta: una página anidada (`recursos/ansiedad`) sube un nivel
  más (`../../components/…`).
- Dentro: `<Header />` (`src/components/Header.astro`) y un `<main class="text-ink">` que abre
  con `<Cabecera rotulo="…" titulo="…">` (`src/components/Cabecera.astro`; el slot lleva lo que
  va bajo el título, p. ej. una entradilla), sigue con el contenido de la página en un
  contenedor `mx-auto max-w-5xl px-6` y cierra con `<Contacto />`
  (`src/components/Contacto.astro`). Después del `main`, `<Revelar />`
  (`src/components/Revelar.astro`): sin él, los bloques de `Contacto` se quedan invisibles.
- Cualquier `href`/`src` interno pasa por `withBase()` (`src/lib/withBase.ts`), nunca una
  ruta literal.
- Sigue las reglas de maquetación de la skill `maquetacion` para el ritmo de página,
  tipografía y paleta (secciones `py-16 sm:py-20`, tokens `navy-*`, `cream-50`, `gold-400`,
  `ink`, etc.).
- Copy en español; contenido real si se conoce, o un placeholder claro ("Próximamente.")
  si no.

Al terminar, ejecuta `npm run check` para confirmar que no hay errores de tipos.
