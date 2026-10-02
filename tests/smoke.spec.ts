import { test, expect } from '@playwright/test';

// Batería mínima y reproducible de lo que se ha comprobado a mano varias
// veces en el desarrollo de este sitio: un único h1, sin errores de consola,
// sin overflow horizontal, y el menú móvil abre/cierra.
// '' (no '/') para la home: con baseURL terminando en `/clinica_conecta/`,
// un path que empiece por '/' resuelve contra el origen y se sale del base
// path (bug real que se detectó escribiendo este mismo test).
const PAGES = ['', 'terapia-cognitivo-conductual/', 'terapia-emdr/', 'aviso-legal/', 'privacidad/'];

for (const path of PAGES) {
  test.describe(`${path || '/'}`, () => {
    test('carga sin errores, con un único h1 y sin overflow horizontal', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(String(err)));

      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();

      await expect(page.locator('h1')).toHaveCount(1);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);

      expect(errors).toEqual([]);
    });

    test('el menú móvil abre y cierra', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'El botón de menú solo es visible en viewports móviles');

      await page.goto(path);

      const toggle = page.locator('#menu-toggle');
      const menu = page.locator('#menu-mobile');

      await expect(menu).not.toHaveAttribute('data-open');
      await toggle.click();
      await expect(menu).toHaveAttribute('data-open');
      await toggle.click();
      await expect(menu).not.toHaveAttribute('data-open');
    });

    test('Escape cierra el menú móvil y devuelve el foco al botón', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'El botón de menú solo es visible en viewports móviles');

      await page.goto(path);

      const toggle = page.locator('#menu-toggle');
      const menu = page.locator('#menu-mobile');

      // Con el menú abierto el botón se anuncia como «Cerrar menú».
      await toggle.click();
      await expect(menu).toHaveAttribute('data-open');
      await expect(toggle).toHaveAttribute('aria-label', 'Cerrar menú');

      await page.keyboard.press('Escape');
      await expect(menu).not.toHaveAttribute('data-open');
      await expect(toggle).toHaveAttribute('aria-label', 'Abrir menú');
      await expect(toggle).toBeFocused();

      // Objetivo táctil de al menos 44 px (WCAG 2.2, 2.5.8 pide 24 como mínimo).
      const caja = await toggle.boundingBox();
      expect(caja?.width).toBeGreaterThanOrEqual(44);
      expect(caja?.height).toBeGreaterThanOrEqual(44);
    });

    test('el primer Tab enfoca «Saltar al contenido» y lleva al <main>', async ({ page }) => {
      await page.goto(path);

      await page.keyboard.press('Tab');
      const salto = page.getByRole('link', { name: 'Saltar al contenido' });
      await expect(salto).toBeFocused();
      await expect(salto).toBeVisible();
      await expect(salto).toHaveAttribute('href', '#contenido');
      await expect(page.locator('main#contenido')).toHaveCount(1);
    });

    test('landmarks: un <main>, un <footer> fuera de él y navegaciones con nombre', async ({
      page,
    }) => {
      await page.goto(path);

      await expect(page.locator('main')).toHaveCount(1);
      // El pie es el landmark contentinfo solo si no cuelga de <main> ni de una sección.
      await expect(page.locator('body > footer')).toHaveCount(1);
      await expect(page.locator('main footer')).toHaveCount(0);

      const sinNombre = await page
        .locator('nav')
        .evaluateAll(
          (navs) =>
            navs.filter((n) => !n.getAttribute('aria-label') && !n.getAttribute('aria-labelledby'))
              .length,
        );
      expect(sinNombre).toBe(0);
    });

    // Lo que no debe llegar nunca a producción: marcadores sin rellenar y los guiones
    // largos o dobles que delatan un texto sin revisar. Se mira el texto visible y el
    // de las preguntas desplegables, no los scripts ni los estilos.
    test('el texto no lleva marcadores [ ] ni «--» ni rayas largas', async ({ page }) => {
      await page.goto(path);

      const texto = await page.evaluate(() => {
        const trozos: string[] = [];
        const recorrido = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (recorrido.nextNode()) {
          const nodo = recorrido.currentNode;
          const padre = nodo.parentElement?.tagName;
          if (padre === 'SCRIPT' || padre === 'STYLE' || padre === 'NOSCRIPT') continue;
          trozos.push(nodo.textContent ?? '');
        }
        return trozos.join(' ');
      });

      expect(texto).not.toMatch(/\[[A-Z_]{4,}\]/);
      expect(texto).not.toMatch(/--|\u2014/);
    });

    test('SEO: un canonical absoluto, JSON-LD válido y robots coherente', async ({ page }) => {
      await page.goto(path);

      const canonicales = await page
        .locator('link[rel="canonical"]')
        .evaluateAll((l) => l.map((e) => e.getAttribute('href') ?? ''));
      expect(canonicales).toHaveLength(1);
      expect(canonicales[0]).toMatch(/^https:\/\//);

      // Todos los bloques JSON-LD tienen que parsear y declarar su contexto.
      const bloques = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((b) => b.map((e) => e.textContent ?? ''));
      for (const bloque of bloques) {
        const datos = JSON.parse(bloque);
        expect(JSON.stringify(datos)).toContain('schema.org');
      }

      // El build de la preview de Pages (NOINDEX_SITE=true) bloquea todo; el de
      // producción solo la 404. CI construye sin la variable.
      test.skip(process.env.NOINDEX_SITE === 'true', 'Build con NOINDEX_SITE: todo va noindex');
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    });
  });
}

// La home enlaza desde las tarjetas de enfoques a sus páginas explicativas.
test('la home enlaza a las páginas de TCC y EMDR', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('link', { name: /Conoce la TCC/ })).toHaveAttribute(
    'href',
    /\/terapia-cognitivo-conductual\/$/,
  );
  await expect(page.getByRole('link', { name: /Conoce EMDR/ })).toHaveAttribute(
    'href',
    /\/terapia-emdr\/$/,
  );
});

// Las páginas legales comparten header y cierre con la home: su «Volver al
// inicio» y el logo llevan a la home.
for (const path of ['aviso-legal/', 'privacidad/']) {
  test(`${path} enlaza a la home`, async ({ page }) => {
    await page.goto(path);

    const base = new URL(page.url()).pathname.replace(path, '');
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((enlaces) => enlaces.map((a) => a.getAttribute('href') ?? ''));

    expect(hrefs).toContain(base);
  });
}

// Una ruta que no existe sirve la 404 (con su estado HTTP) y ofrece volver al
// inicio. Sin comprobar la consola: el propio 404 se registra como error.
test('una ruta inexistente muestra la página 404', async ({ page }) => {
  const response = await page.goto('ruta-que-no-existe/');
  expect(response?.status()).toBe(404);

  await expect(page.locator('h1')).toHaveText('Página no encontrada');
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible();
});

// `robots.txt` lo genera una ruta de Astro según el entorno de build. En producción deja
// pasar a los buscadores y bloquea a los rastreadores de entrenamiento de IA; en la
// preview de Pages (NOINDEX_SITE=true) lo cierra todo.
test('robots.txt coincide con el entorno de build', async ({ request }) => {
  const respuesta = await request.get('robots.txt');
  expect(respuesta.ok()).toBeTruthy();
  const cuerpo = await respuesta.text();

  if (process.env.NOINDEX_SITE === 'true') {
    expect(cuerpo).toBe('User-agent: *\nDisallow: /\n');
  } else {
    expect(cuerpo).toContain('Allow: /');
    expect(cuerpo).toContain('User-agent: GPTBot');
    expect(cuerpo).toMatch(/Sitemap: https:\/\/.+\/sitemap-index\.xml/);
  }
});

test('la 404 lleva noindex', async ({ page }) => {
  await page.goto('ruta-que-no-existe/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
